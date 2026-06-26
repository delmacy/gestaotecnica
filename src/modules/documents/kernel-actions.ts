import { eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { documents } from "@/db/runtime/schema/documents";
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
  // Omitindo vínculos até que as tabelas produtoras (OS, Ativo, Demanda) suportem isolamento por workspace_id
  // serviceOrderId?: string;
  // workItemId?: string;
  // assetId?: string;
};

export const generateDocumentKernelAction: ActionDefinition<
  GenerateDocumentInput,
  { id: string; title: string; status: string }
> = {
  key: "documents.generate",
  moduleKey: "documents",
  description: "Gera um documento tecnico no novo schema runtime.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      title: stringProperty("Título do documento."),
      documentType: stringProperty("Tipo do documento técnico."),
      content: stringProperty("Conteúdo inicial (metadado)."),
    },
    ["title"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador do documento."),
    title: stringProperty("Título do documento."),
    status: stringProperty("Status inicial."),
  }),
  emits: ["document.generated"],
  async handler(input, context) {
    const title = String(input.title ?? "").trim();
    if (!title) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "title e obrigatório." },
      };
    }

    const db = getDb();
    const workspaceId = context.workspaceId;

    if (!workspaceId) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "workspace_id e obrigatório." },
      };
    }

    // GAP: Vínculos com service_orders, work_items e assets foram removidos
    // pois as tabelas legacy ainda não possuem a coluna workspace_id para validação de tenant.
    // Registrado como ISOLATION_GAP_LINKED_ENTITIES.

    const result = await db.transaction(async (tx: any) => {
      const [doc] = await tx
        .insert(documents)
        .values({
          workspaceId,
          title,
          documentType: input.documentType ?? "technical_report",
          status: "draft",
        })
        .returning({
          id: documents.id,
          title: documents.title,
          status: documents.status,
        });

      return { doc };
    });

    return {
      success: true,
      data: {
        id: result.doc.id,
        title: result.doc.title,
        status: result.doc.status,
      },
      events: [
        {
          eventType: "document.generated",
          entityType: "document",
          entityId: result.doc.id,
          payload: {
            title: result.doc.title,
            documentType: input.documentType ?? "technical_report",
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
  description: "Transiciona o status de um documento técnico no novo schema runtime.",
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
  async handler(input, context) {
    const documentId = String(input.documentId ?? "").trim();
    if (!documentId) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "documentId e obrigatório." },
      };
    }

    const db = getDb();
    const workspaceId = context.workspaceId;

    if (!workspaceId) {
      return {
        success: false,
        error: { code: "UNAUTHORIZED", message: "workspace_id e obrigatório." },
      };
    }

    const [previous]: any[] = await db
      .select({
        id: documents.id,
        title: documents.title,
        status: documents.status,
      })
      .from(documents)
      .where(and(
        eq(documents.id, documentId),
        eq(documents.workspaceId, workspaceId)
      ))
      .limit(1);

    if (!previous) {
      return { success: false, error: { code: "NOT_FOUND", message: "Documento não encontrado ou acesso negado." } };
    }

    const status = input.status ?? previous.status;

    const [updated]: any[] = await db
      .update(documents)
      .set({
        status: status,
        updatedAt: new Date(),
      })
      .where(and(
        eq(documents.id, documentId),
        eq(documents.workspaceId, workspaceId)
      ))
      .returning({
        id: documents.id,
        status: documents.status,
      });

    return {
      success: true,
      data: updated,
      events: [
        {
          eventType: "document.status_changed",
          entityType: "document",
          entityId: updated.id,
          payload: {
            title: previous.title,
            from: previous.status,
            to: updated.status,
            note: input.note,
          },
        },
      ],
    };
  },
};
