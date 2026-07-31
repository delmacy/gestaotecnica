import { NextResponse } from "next/server";
import { getEntityAttachments } from "@/modules/comments/queries";
import { CreateEntityAttachmentInputSchema } from "@/modules/comments/contracts/entity-collaboration-contract";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { getCurrentUser } from "@/modules/auth/session";
import { getDb } from "@/db";
import { entityAttachments } from "@/db/schema";

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

    const attachments = await getEntityAttachments(entityType, entityId);

    return NextResponse.json({ success: true, data: attachments }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, status: "blocked", message: "Erro interno ao listar anexos" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const text = await req.text();
    let body: unknown;
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      return NextResponse.json(
        { success: false, status: "empty", message: "JSON invalido no corpo da requisicao" },
        { status: 400 },
      );
    }

    const validation = CreateEntityAttachmentInputSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          status: "empty",
          message: "Dados obrigatorios ausentes ou invalidos",
          details: validation.error.issues,
        },
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

    const currentUser = await getCurrentUser();
    const { entityType, entityId, title, fileUrl, mimeType } = validation.data;

    const [attachment] = await getDb()
      .insert(entityAttachments)
      .values({
        entityType,
        entityId,
        title,
        fileUrl,
        mimeType: mimeType ?? null,
        createdById: currentUser?.userId,
      })
      .returning({ id: entityAttachments.id, title: entityAttachments.title });

    return NextResponse.json({ success: true, data: attachment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, status: "blocked", message: "Erro interno ao criar anexo" },
      { status: 500 },
    );
  }
}
