import { getDb } from "@/db";
import { technicalDocuments } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";

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
  description: "Gera um documento técnico em rascunho.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      title: stringProperty("Título do documento."),
      documentType: stringProperty("Tipo do documento técnico."),
      content: stringProperty("Conteúdo inicial."),
      serviceOrderId: uuidProperty("OS relacionada."),
      workItemId: uuidProperty("Demanda relacionada."),
      assetId: uuidProperty("Ativo relacionado."),
    },
    ["title"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador do documento."),
    title: stringProperty("Título do documento."),
    status: stringProperty("Status inicial."),
  }),
  emits: ["document.generated"],
  async handler(input) {
    const title = String(input.title ?? "").trim();
    if (!title) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "title e obrigatório." },
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

