import { getDb } from "@/db";
import { technicalDocuments } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";

type GenerateDocumentInput = {
  title?: string;
  documentType?: string;
  content?: string;
  serviceOrderId?: string;
  workItemId?: string;
  assetId?: string;
};

export const generateDocumentKernelAction: ActionDefinition<
  GenerateDocumentInput,
  { id: string; title: string; status: string }
> = {
  key: "documents.generate",
  moduleKey: "documents",
  description: "Gera um documento tecnico em rascunho.",
  callableBy: ["ui", "integration", "automation", "system"],
  emits: ["document.generated"],
  async handler(input) {
    const title = String(input.title ?? "").trim();
    if (!title) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "title e obrigatorio." },
      };
    }

    const db = getDb();
    const [document] = await db
      .insert(technicalDocuments)
      .values({
        title,
        documentType: input.documentType ?? "technical_report",
        content: input.content,
        serviceOrderId: input.serviceOrderId,
        workItemId: input.workItemId,
        assetId: input.assetId,
        status: "draft",
      })
      .returning({
        id: technicalDocuments.id,
        title: technicalDocuments.title,
        status: technicalDocuments.status,
      });

    return {
      success: true,
      data: document,
      events: [
        {
          eventType: "document.generated",
          entityType: "technical_document",
          entityId: document.id,
          payload: {
            title: document.title,
            documentType: input.documentType ?? "technical_report",
            serviceOrderId: input.serviceOrderId,
            workItemId: input.workItemId,
            assetId: input.assetId,
          },
        },
      ],
    };
  },
};
