import { eq, and, desc, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
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
  type CreateApprovalInput,
  type DecideApprovalInput,
} from "./contracts/approval.schema";

/**
 * Universal Subject Resolver
 * Confirms that the object exists and belongs to the workspace.
 *
 * IMPORTANT: Currently, legacy tables (service_orders, assets, etc.)
 * lack a workspace_id column, making them 'unsafe' for strict tenant-safe validation
 * in this universal module.
 */
async function validateSubject(
  subjectType: string
): Promise<{ success: boolean; message: string }> {
  // We reject all current subject types until they are migrated to include workspace_id.
  // This enforces the "reject subject types that cannot be validated tenant-safely" rule.
  return {
    success: false,
    message: `O tipo de objeto '${subjectType}' não possui validação de isolamento (workspace_id) ativa e não pode ser submetido com segurança.`
  };
}

export const requestApprovalKernelAction: ActionDefinition<
  CreateApprovalInput & { serviceOrderId?: string; note?: string },
  { id: string }
> = {
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
      // Legacy inputs accepted for mapping
      serviceOrderId: uuidProperty("OS legacy."),
      note: stringProperty("Nota legacy."),
    },
    [],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador da solicitação de aprovação."),
  }),
  emits: ["approval.requested"],
  async handler(input, context) {
    const db = getDb();

    // 1. Resolve inputs
    let subjectType = input.subjectType;
    let subjectId = input.subjectId;
    const comment = input.comment || input.note;

    if (input.serviceOrderId && !subjectId) {
      subjectType = "service_order" as any;
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

    // 3. Subject Validation (Existence & Workspace Isolation)
    const validation = await validateSubject(validated.subjectType);
    if (!validation.success) {
      return { success: false, error: { code: "FORBIDDEN", message: validation.message } };
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

    // 5. Persistence
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

    // NO DIRECT SIDE EFFECTS ON SUBJECTS. Decoupled via events.

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
  DecideApprovalInput & { serviceOrderId?: string; note?: string },
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
      // Legacy inputs accepted for mapping
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

    // 1. Resolve ID with Workspace Filter (Strict)
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
         return { success: false, error: { code: "NOT_FOUND", message: "Nenhuma solicitação de aprovação pendente encontrada." } };
      }
      approvalId = existing.id;
    }

    if (!approvalId) {
      return { success: false, error: { code: "VALIDATION_ERROR", message: "ID da solicitação é obrigatório." } };
    }

    // 2. Authorization
    if (!context.actor.id) {
       return { success: false, error: { code: "UNAUTHORIZED", message: "Ator não identificado." } };
    }

    // 3. Input Validation
    const validated = DecideApprovalInputSchema.parse({
      id: approvalId,
      decision: input.decision === ("approve" as any) ? "approved" : input.decision,
      comment: input.comment || input.note,
      metadata: input.metadata,
    });

    // 4. Atomic Transition and Workspace + Origin Isolation
    // Prevents self-approval and ensures record belongs to tenant and is pending.
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
          eq(processCandidates.status, "pending"),
          // Prevent self-approval (security policy)
          ne(db.raw("proposed_definition->>'requesterId'"), context.actor.id)
        )
      )
      .returning();

    if (!updated) {
      // Diagnostic check for precise error response
      const [record] = await db
        .select({
            status: processCandidates.status,
            workspaceId: processCandidates.workspaceId,
            origin: processCandidates.origin,
            requesterId: db.raw("proposed_definition->>'requesterId'")
        })
        .from(processCandidates)
        .where(eq(processCandidates.id, approvalId))
        .limit(1);

      if (!record) {
        return { success: false, error: { code: "NOT_FOUND", message: "Solicitação não encontrada." } };
      }

      if (record.workspaceId !== context.workspaceId) {
          return { success: false, error: { code: "FORBIDDEN", message: "Solicitação pertence a outro workspace." } };
      }

      if (record.origin !== "approval") {
          return { success: false, error: { code: "FORBIDDEN", message: "O registro não é uma solicitação de aprovação." } };
      }

      if (record.status !== "pending") {
          return { success: false, error: { code: "CONFLICT", message: `Solicitação já se encontra no estado: ${record.status}` } };
      }

      if (record.requesterId === context.actor.id) {
          return { success: false, error: { code: "FORBIDDEN", message: "O solicitante não pode aprovar a própria solicitação." } };
      }

      return { success: false, error: { code: "UNKNOWN_ERROR", message: "Falha ao processar decisão." } };
    }

    const proposed = (updated.proposedDefinition as Record<string, any>) || {};

    // 5. Finalize with Universal Event
    // NO DIRECT SIDE EFFECTS ON SUBJECTS. Decoupled via events.
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
            workspaceId: context.workspaceId,
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
