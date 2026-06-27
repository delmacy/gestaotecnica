import { eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  stringProperty,
  uuidProperty,
  enumProperty,
} from "@/platform/actions/schema-presets";
import {
  CreateCaseInputSchema,
  UpdateCaseInputSchema,
  AddCaseCommentInputSchema,
} from "./contracts/case.schema";

const ORIGIN = "case-management";
const COMMENT_ORIGIN = "case-management-comment";

export const createCaseKernelAction: ActionDefinition<any, any> = {
  key: "case_management.create",
  moduleKey: "case-management",
  description: "Cria um novo caso.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      title: stringProperty("Título do caso."),
      description: stringProperty("Descrição detalhada."),
      category: stringProperty("Categoria."),
      priority: enumProperty(["low", "medium", "high", "critical"], "Prioridade."),
      responsibleId: uuidProperty("ID do responsável."),
      metadata: actionObjectSchema({}, []),
    },
    ["title", "category"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("ID do caso criado."),
  }),
  emits: ["case_management.created"],
  async handler(input, context) {
    const db = getDb();

    const validated = CreateCaseInputSchema.parse({
      ...input,
      workspaceId: context.workspaceId,
    });

    const [inserted] = await db
      .insert(processCandidates)
      .values({
        workspaceId: validated.workspaceId,
        name: validated.title,
        description: validated.description,
        status: "open",
        origin: ORIGIN,
        proposedDefinition: {
          category: validated.category,
          priority: validated.priority,
          responsibleId: validated.responsibleId,
          metadata: validated.metadata,
        },
      })
      .returning({ id: processCandidates.id });

    return {
      success: true,
      data: { id: inserted.id },
      events: [
        {
          eventType: "case_management.created",
          entityType: "case",
          entityId: inserted.id,
          payload: validated,
        },
      ],
    };
  },
};

export const updateCaseKernelAction: ActionDefinition<any, any> = {
  key: "case_management.update",
  moduleKey: "case-management",
  description: "Atualiza um caso existente.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      id: uuidProperty("ID do caso."),
      title: stringProperty("Título."),
      description: stringProperty("Descrição."),
      status: enumProperty(["open", "in_progress", "pending", "resolved", "closed"], "Status."),
      priority: enumProperty(["low", "medium", "high", "critical"], "Prioridade."),
      category: stringProperty("Categoria."),
      responsibleId: uuidProperty("ID do responsável."),
      metadata: actionObjectSchema({}, []),
    },
    ["id"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("ID do caso."),
  }),
  emits: ["case_management.updated"],
  async handler(input, context) {
    const db = getDb();
    const validated = UpdateCaseInputSchema.parse(input);

    const [current] = await db
      .select()
      .from(processCandidates)
      .where(
        and(
          eq(processCandidates.id, validated.id),
          eq(processCandidates.workspaceId, context.workspaceId),
          eq(processCandidates.origin, ORIGIN)
        )
      )
      .limit(1);

    if (!current) {
      return { success: false, error: { code: "NOT_FOUND", message: "Caso não encontrado." } };
    }

    const proposed = (current.proposedDefinition as Record<string, any>) || {};
    const updatedProposed = {
      ...proposed,
      category: validated.category ?? proposed.category,
      priority: validated.priority ?? proposed.priority,
      responsibleId: validated.responsibleId ?? proposed.responsibleId,
      metadata: validated.metadata ?? proposed.metadata,
    };

    await db
      .update(processCandidates)
      .set({
        name: validated.title ?? current.name,
        description: validated.description ?? current.description,
        status: validated.status ?? current.status,
        proposedDefinition: updatedProposed,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(processCandidates.id, validated.id),
          eq(processCandidates.workspaceId, context.workspaceId),
          eq(processCandidates.origin, ORIGIN)
        )
      );

    return {
      success: true,
      data: { id: validated.id },
      events: [
        {
          eventType: "case_management.updated",
          entityType: "case",
          entityId: validated.id,
          payload: validated,
        },
      ],
    };
  },
};

export const addCaseCommentKernelAction: ActionDefinition<any, any> = {
  key: "case_management.add_comment",
  moduleKey: "case-management",
  description: "Adiciona um comentário ao caso.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      id: uuidProperty("ID do caso."),
      body: stringProperty("Conteúdo do comentário."),
    },
    ["id", "body"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("ID do comentário."),
  }),
  emits: ["case_management.comment_added"],
  async handler(input, context) {
    const db = getDb();
    const validated = AddCaseCommentInputSchema.parse(input);

    // Verify case exists and belongs to workspace and origin
    const [parent] = await db
      .select({ id: processCandidates.id })
      .from(processCandidates)
      .where(
        and(
          eq(processCandidates.id, validated.id),
          eq(processCandidates.workspaceId, context.workspaceId),
          eq(processCandidates.origin, ORIGIN)
        )
      )
      .limit(1);

    if (!parent) {
      return { success: false, error: { code: "NOT_FOUND", message: "Caso não encontrado ou fora do escopo." } };
    }

    const [comment] = await db
      .insert(processCandidates)
      .values({
        workspaceId: context.workspaceId,
        origin: COMMENT_ORIGIN,
        name: `Comentário no caso ${validated.id}`,
        description: validated.body,
        status: "active",
        proposedDefinition: {
          caseId: validated.id,
          body: validated.body,
          authorId: context.actor.id,
          authorName: context.actor.name,
        },
      })
      .returning({ id: processCandidates.id });

    return {
      success: true,
      data: { id: comment.id },
      events: [
        {
          eventType: "case_management.comment_added",
          entityType: "case",
          entityId: validated.id,
          payload: { commentId: comment.id },
        },
      ],
    };
  },
};
