import { eq } from "drizzle-orm";
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

type TransitionDocumentInput = {
  documentId?: string;
  status?: string;
  note?: string;
};

export const transitionDocumentKernelAction: ActionDefinition<
  TransitionDocumentInput,
  { id: string; status: string }
> = {
  key: "documents.transition",
  moduleKey: "documents",
  description: "Transiciona o status de um documento técnico.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      documentId: uuidProperty("Identificador do documento."),
      status: stringProperty("Novo status do documento."),
      note: stringProperty("Observação da transição."),
    },
    ["documentId", "status"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador do documento."),
    status: stringProperty("Status final."),
  }),
  emits: ["document.status_changed"],
  async handler(input) {
    const documentId = String(input.documentId ?? "").trim();
    if (!documentId) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "documentId e obrigatório." },
      };
    }

    const db = getDb();
    const [previous] = await db
      .select({
        id: technicalDocuments.id,
        title: technicalDocuments.title,
        status: technicalDocuments.status,
        serviceOrderId: technicalDocuments.serviceOrderId,
        workItemId: technicalDocuments.workItemId,
        assetId: technicalDocuments.assetId,
      })
      .from(technicalDocuments)
      .where(eq(technicalDocuments.id, documentId))
      .limit(1);

    if (!previous) {
      return { success: false, error: { code: "NOT_FOUND", message: "Documento não encontrado." } };
    }

    const status = input.status ?? previous.status;

    const [updated] = await db
      .update(technicalDocuments)
      .set({
        status: status as "draft",
        updatedAt: new Date(),
      })
      .where(eq(technicalDocuments.id, documentId))
      .returning({
        id: technicalDocuments.id,
        status: technicalDocuments.status,
      });

    return {
      success: true,
      data: updated,
      events: [
        {
          eventType: "document.status_changed",
          entityType: "technical_document",
          entityId: updated.id,
          payload: {
            title: previous.title,
            from: previous.status,
            to: updated.status,
            serviceOrderId: previous.serviceOrderId,
            workItemId: previous.workItemId,
            assetId: previous.assetId,
            note: input.note,
          },
        },
      ],
    };
  },
};
