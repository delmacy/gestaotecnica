import { getDb } from "@/db";
import { evidences } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";

type AttachEvidenceInput = {
  title?: string;
  description?: string;
  fileUrl?: string;
  mimeType?: string;
  serviceOrderId?: string;
  workItemId?: string;
  assetId?: string;
};

export const attachEvidenceKernelAction: ActionDefinition<
  AttachEvidenceInput,
  { id: string; title: string }
> = {
  key: "evidences.attach",
  moduleKey: "evidences",
  description: "Anexa uma evidencia a uma entidade operacional.",
  callableBy: ["ui", "integration", "automation", "system"],
  emits: ["evidence.attached"],
  async handler(input) {
    const title = String(input.title ?? "").trim();
    if (!title) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "title e obrigatorio." },
      };
    }

    const db = getDb();
    const [evidence] = await db
      .insert(evidences)
      .values({
        title,
        description: input.description,
        fileUrl: input.fileUrl,
        mimeType: input.mimeType,
        serviceOrderId: input.serviceOrderId,
        workItemId: input.workItemId,
        assetId: input.assetId,
      })
      .returning({
        id: evidences.id,
        title: evidences.title,
      });

    return {
      success: true,
      data: evidence,
      events: [
        {
          eventType: "evidence.attached",
          entityType: "evidence",
          entityId: evidence.id,
          payload: {
            title,
            serviceOrderId: input.serviceOrderId,
            workItemId: input.workItemId,
            assetId: input.assetId,
            fileUrl: input.fileUrl,
          },
        },
      ],
    };
  },
};
