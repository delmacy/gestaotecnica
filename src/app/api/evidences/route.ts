import { NextResponse } from "next/server";
import { runAction } from "@/platform/actions";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { getEvidences } from "@/modules/evidences/queries";
import { createReceipt } from "@/platform/events/event-log-service";
import { z } from "zod";

export const dynamic = "force-dynamic";

const AttachEvidenceInputSchema = z.object({
  title: z.string().min(1, "title é obrigatório."),
  description: z.string().optional(),
  fileUrl: z.string().url().optional(),
  mimeType: z.string().optional(),
  serviceOrderId: z.string().uuid().optional(),
  workItemId: z.string().uuid().optional(),
  assetId: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  try {
    const text = await req.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_JSON", message: "Invalid JSON payload" } },
        { status: 400 }
      );
    }

    const validation = AttachEvidenceInputSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: validation.error.message, details: validation.error.issues } },
        { status: 400 }
      );
    }

    const context = await resolveWorkspaceContext({ source: "integration" });
    const result = await runAction("evidences.attach", validation.data, context);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const firstEvent = result.events && result.events.length > 0 ? result.events[0] : undefined;
    const receipt = firstEvent ? createReceipt(firstEvent as unknown as Parameters<typeof createReceipt>[0], "success", { processorId: "evidences-api" }) : undefined;

    return NextResponse.json({ success: true, data: result.data, receipt }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Resolve context to enforce auth/context validation
    await resolveWorkspaceContext({ source: "integration" });

    const requests = await getEvidences();

    return NextResponse.json({ success: true, data: requests }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
