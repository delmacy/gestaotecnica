import { eq, and, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import {
  serviceOrders,
  workItems,
  technicalDocuments,
  assets
} from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  enumProperty,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";
import {
  CreateApprovalInputSchema,
  DecideApprovalInputSchema,
} from "./contracts/approval.schema";

/**
 * Universal Subject Resolver
 * Confirms that the object exists.
 * NOTE: Legacy tables (service_orders, work_items, etc.) currently lack a workspaceId column.
 * Strict workspace isolation is enforced on the Approval Request record itself.
 */
async function validateSubject(
  subjectType: string,
  subjectId: string
): Promise<{ success: boolean; message: string }> {
  const db = getDb();

  try {
    switch (subjectType) {
      case "service_order": {
        const [row] = await db
          .select({ id: serviceOrders.id })
          .from(serviceOrders)
          .where(eq(serviceOrders.id, subjectId))
          .limit(1);
        return row ? { success: true, message: "" } : { success: false, message: "Ordem de Serviço não encontrada." };
      }
      case "work_item": {
        const [row] = await db
          .select({ id: workItems.id })
          .from(workItems)
          .where(eq(workItems.id, subjectId))
          .limit(1);
        return row ? { success: true, message: "" } : { success: false, message: "Item de Trabalho não encontrado." };
      }
      case "asset": {
        const [row] = await db
          .select({ id: assets.id })
          .from(assets)
          .where(eq(assets.id, subjectId))
          .limit(1);
        return row ? { success: true, message: "" } : { success: false, message: "Ativo não encontrado." };
      }
      case "document": {
        const [row] = await db
          .select({ id: technicalDocuments.id })
          .from(technicalDocuments)
          .where(eq(technicalDocuments.id, subjectId))
          .limit(1);
        return row ? { success: true, message: "" } : { success: false, message: "Documento não encontrado." };
      }
      default:
        return { success: false, message: `Tipo de objeto não suportado para validação: ${subjectType}` };
    }
  } catch (error) {
    console.error(`Error validating subject ${subjectType}:${subjectId}`, error);
    return { success: false, message: "Erro interno ao validar objeto." };
  }
}

export const requestApprovalKernelAction: ActionDefinition<any, { id: string }> = {
  key: "approvals.request",
  moduleKey: "approvals",
  description: "Envia um objeto para aprovação universal.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      subjectType: enumProperty(["service_order", "work_item", "document", "asset"], "Tipo do objeto."),
      subjectId: stringProperty("Identificador do objeto."),
      comment: stringProperty("Comentário ou observação inicial."),
      metadata: actionObjectSchema({}, []),
      // Backward compatibility
      serviceOrderId: uuidProperty("OS que será enviada para aprovação (legacy)."),
      note: stringProperty("Observação (legacy)."),
    },
    [],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador da solicitação de aprovação."),
  }),
  emits: ["approval.requested"],
  async handler(input, context) {
    const db = getDb();

    // 1. Resolve inputs with backward compatibility
    let subjectType = input.subjectType;
    let subjectId = input.subjectId;
    const comment = input.comment || input.note;

    if (input.serviceOrderId && !subjectId) {
      subjectType = "service_order";
      subjectId = input.serviceOrderId;
    }

    if (!subjectType || !subjectId) {
       return { success: false, error: { code: "VALIDATION_ERROR", message: "subjectType e subjectId são obrigatórios." } };
    }

    // 2. Validate Inputs against Schema
    const validated = CreateApprovalInputSchema.parse({
      subjectType,
      subjectId,
      comment,
      metadata: input.metadata || {},
    });

    // 3. Subject Validation (Existence)
    const validation = await validateSubject(validated.subjectType, validated.subjectId);
    if (!validation.success) {
      return { success: false, error: { code: "NOT_FOUND", message: validation.message } };
    }

    // 4. Idempotency Check (Prevent duplicate pending requests)
    const [existing] = await db
      .select({ id: processCandidates.id })
      .from(processCandidates)
      .where(
        and(
          eq(processCandidates.workspaceId, context.workspaceId),
          eq(processCandidates.origin, "approval"),
          eq(processCandidates.status, "pending"),
          eq(processCandidates.name, `Approval Request: ${validated.subjectType} ${validated.subjectId}`)
        )
      )
      .limit(1);

    if (existing) {
      return {
        success: true,
        data: { id: existing.id },
        metadata: { info: "Já existe uma solicitação pendente para este objeto." }
      };
    }

    // 5. Persistence (Transitória em process_candidates)
    const [inserted] = await db
      .insert(processCandidates)
      .values({
        workspaceId: context.workspaceId,
        name: `Approval Request: ${validated.subjectType} ${validated.subjectId}`,
        description: validated.comment,
        status: "pending",
        origin: "approval",
        proposedDefinition: {
          subjectType: validated.subjectType,
          subjectId: validated.subjectId,
          requesterId: context.actor.id,
          requesterName: context.actor.name || "Anonymous",
          metadata: validated.metadata,
        },
        evidence: {},
        createdById: context.actor.id,
      })
      .returning({ id: processCandidates.id });

    // 6. Side Effects (Legacy backward compatibility)
    if (validated.subjectType === "service_order") {
      await db
        .update(serviceOrders)
        .set({ status: "waiting_review", updatedAt: new Date() })
        .where(eq(serviceOrders.id, validated.subjectId));
    }

    return {
      success: true,
      data: { id: inserted.id },
      events: [
        {
          eventType: "approval.requested",
          entityType: "approval_request",
          entityId: inserted.id,
          payload: {
            id: inserted.id,
            workspaceId: context.workspaceId,
            subjectType: validated.subjectType,
            subjectId: validated.subjectId,
            requesterId: context.actor.id,
            requesterName: context.actor.name || "Anonymous",
            comment: validated.comment,
            metadata: validated.metadata
          },
        },
      ],
    };
  },
};

export const decideApprovalKernelAction: ActionDefinition<
  any,
  { id: string; status: string }
> = {
  key: "approvals.decide",
  moduleKey: "approvals",
  description: "Registra decisão sobre uma solicitação de aprovação.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      id: uuidProperty("ID da solicitação de aprovação."),
      decision: enumProperty(["approved", "rejected"], "Decisão tomada."),
      comment: stringProperty("Justificativa ou comentário."),
      metadata: actionObjectSchema({}, []),
      // Backward compatibility
      serviceOrderId: uuidProperty("OS legacy."),
      note: stringProperty("Nota legacy."),
    },
    [],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("ID da solicitação."),
    status: stringProperty("Estado final."),
  }),
  emits: ["approval.decided"],
  async handler(input, context) {
    const db = getDb();
    let approvalId = input.id;

    // 1. Resolve ID (Backward Compatibility)
    if (input.serviceOrderId && !approvalId) {
      const [existing] = await db
        .select({ id: processCandidates.id })
        .from(processCandidates)
        .where(
          and(
            eq(processCandidates.workspaceId, context.workspaceId),
            eq(processCandidates.origin, "approval"),
            eq(processCandidates.status, "pending")
          )
        )
        .orderBy(desc(processCandidates.createdAt))
        .limit(1);

      if (!existing) {
         // Direct update as legacy fallback if no universal request exists
         const status = input.decision === "approve" || input.decision === "approved" ? "approved" : "open";
         await db.update(serviceOrders).set({
           status,
           approvedAt: status === "approved" ? new Date() : undefined,
           approvedById: status === "approved" && context.actor.type === "user" ? context.actor.id : undefined,
           updatedAt: new Date()
         }).where(eq(serviceOrders.id, input.serviceOrderId));

         return { success: true, data: { id: input.serviceOrderId, status } };
      }
      approvalId = existing.id;
    }

    if (!approvalId) {
      return { success: false, error: { code: "VALIDATION_ERROR", message: "ID da solicitação é obrigatório." } };
    }

    // 2. Authorization & Context Consistency
    if (!context.actor.id) {
       return { success: false, error: { code: "UNAUTHORIZED", message: "Ator não identificado." } };
    }

    // 3. Input Validation
    const validated = DecideApprovalInputSchema.parse({
      id: approvalId,
      decision: input.decision === "approve" ? "approved" : input.decision,
      comment: input.comment || input.note,
      metadata: input.metadata,
    });

    // 4. Atomic Transition and Workspace Isolation
    const [updated] = await db
      .update(processCandidates)
      .set({
        status: validated.decision,
        description: validated.comment,
        proposedDefinition: db.raw(`proposed_definition || jsonb_build_object(
          'approverId', '${context.actor.id}',
          'approverName', '${context.actor.name || "Anonymous"}',
          'decision', '${validated.decision}',
          'decidedAt', '${new Date().toISOString()}'
        )`),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(processCandidates.id, approvalId),
          eq(processCandidates.workspaceId, context.workspaceId),
          eq(processCandidates.origin, "approval"),
          eq(processCandidates.status, "pending")
        )
      )
      .returning();

    if (!updated) {
      // Could be not found OR already decided (status != pending)
      const [record] = await db
        .select({ status: processCandidates.status })
        .from(processCandidates)
        .where(and(eq(processCandidates.id, approvalId), eq(processCandidates.workspaceId, context.workspaceId)))
        .limit(1);

      if (!record) {
        return { success: false, error: { code: "NOT_FOUND", message: "Solicitação não encontrada." } };
      }
      return { success: false, error: { code: "CONFLICT", message: `Solicitação já se encontra no estado: ${record.status}` } };
    }

    const proposed = (updated.proposedDefinition as Record<string, any>) || {};

    // 5. Self-Approval Check (Security Policy)
    if (proposed.requesterId === context.actor.id) {
       // Rollback status because self-approval is forbidden in this universal module
       await db.update(processCandidates)
         .set({ status: "pending" })
         .where(eq(processCandidates.id, approvalId));

       return { success: false, error: { code: "FORBIDDEN", message: "O solicitante não pode aprovar a própria solicitação." } };
    }

    // 6. Side Effects (Legacy backward compatibility)
    if (proposed.subjectType === "service_order") {
       const status = validated.decision === "approved" ? "approved" : "open";
       await db.update(serviceOrders).set({
         status,
         approvedAt: validated.decision === "approved" ? new Date() : undefined,
         approvedById: validated.decision === "approved" && context.actor.type === "user" ? context.actor.id : undefined,
         updatedAt: new Date()
       }).where(eq(serviceOrders.id, proposed.subjectId));
    }

    return {
      success: true,
      data: { id: approvalId, status: validated.decision },
      events: [
        {
          eventType: `approval.${validated.decision}`,
          entityType: "approval_request",
          entityId: approvalId,
          payload: {
            id: approvalId,
            decision: validated.decision,
            comment: validated.comment,
            subjectType: proposed.subjectType,
            subjectId: proposed.subjectId,
            approverId: context.actor.id,
            approverName: context.actor.name,
            metadata: proposed.metadata
          },
        },
      ],
    };
  },
};
