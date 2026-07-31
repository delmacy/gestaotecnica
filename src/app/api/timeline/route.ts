import { NextResponse } from "next/server";
import { desc, eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { events as eventLogs } from "@/db/runtime/schema/workflow";
import { resolveWorkspaceContext } from "@/platform/workspace";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const entityType = searchParams.get("entityType");
    const entityId = searchParams.get("entityId");

    if (!entityType || !entityId) {
      return NextResponse.json(
        { success: false, status: "empty", message: "entityType e entityId sao obrigatorios" },
        { status: 400 },
      );
    }

    const context = await resolveWorkspaceContext({ source: "api" });
    if (!context.workspaceId) {
      return NextResponse.json(
        { success: false, status: "empty", message: "Nenhum workspace ativo encontrado" },
        { status: 404 },
      );
    }

    const entries = await getDb()
      .select({
        id: eventLogs.id,
        eventType: eventLogs.eventType,
        entityType: eventLogs.entityType,
        entityId: eventLogs.entityId,
        actorType: eventLogs.actorType,
        actorId: eventLogs.actorId,
        source: eventLogs.source,
        payload: eventLogs.payload,
        createdAt: eventLogs.createdAt,
      })
      .from(eventLogs)
      .where(
        and(
          eq(eventLogs.entityType, entityType),
          eq(eventLogs.entityId, entityId),
          eq(eventLogs.workspaceId, context.workspaceId),
        ),
      )
      .orderBy(desc(eventLogs.createdAt))
      .limit(50);

    return NextResponse.json({ success: true, data: entries }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, status: "blocked", message: "Erro interno ao buscar timeline" },
      { status: 500 },
    );
  }
}
