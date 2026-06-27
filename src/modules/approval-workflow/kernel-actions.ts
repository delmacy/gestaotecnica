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
  createApprovalRequestInputSchema,
  decideApprovalInputSchema,
} from "./contracts/approval.schema";

const REQUEST_ORIGIN = "approval-request";
const STEP_ORIGIN = "approval-step";

export const createApprovalRequestKernelAction: ActionDefinition<any, any> = {
  key: "approval_workflow.create_request",
  moduleKey: "approval-workflow",
  description: "Cria uma nova solicitação de aprovação.",
  callableBy: ["ui", "system"],
  inputSchema: actionObjectSchema(
    {
      title: stringProperty("Título."),
      description: stringProperty("Descrição."),
      entityType: stringProperty("Tipo da entidade alvo."),
      entityId: uuidProperty("ID da entidade alvo."),
      steps: actionObjectSchema({}, []), // simplified for kernel registry
    },
    ["title", "entityType", "entityId"],
  ),
  async handler(input, context) {
    const db = getDb();
    const validated = createApprovalRequestInputSchema.parse(input);

    const [request] = await db
      .insert(processCandidates)
      .values({
        workspaceId: context.workspaceId,
        origin: REQUEST_ORIGIN,
        name: validated.title,
        description: validated.description,
        status: "pending",
        proposedDefinition: {
          entityType: validated.entityType,
          entityId: validated.entityId,
          metadata: validated.metadata,
        },
      })
      .returning({ id: processCandidates.id });

    for (let i = 0; i < validated.steps.length; i++) {
      const step = validated.steps[i];
      await db.insert(processCandidates).values({
        workspaceId: context.workspaceId,
        origin: STEP_ORIGIN,
        name: `Step ${i + 1} - ${request.id}`,
        status: i === 0 ? "pending" : "pending", // Simplified
        proposedDefinition: {
          requestId: request.id,
          order: i,
          approverId: step.approverId,
          approverType: step.approverType,
        },
      });
    }

    return {
      success: true,
      data: { id: request.id },
      events: [
        {
          eventType: "approval_workflow.request_created",
          entityType: "approval_request",
          entityId: request.id,
          payload: { id: request.id },
        },
      ],
    };
  },
};

export const decideApprovalKernelAction: ActionDefinition<any, any> = {
  key: "approval_workflow.decide",
  moduleKey: "approval-workflow",
  description: "Registra uma decisão em um passo de aprovação.",
  callableBy: ["ui"],
  inputSchema: actionObjectSchema(
    {
      requestId: uuidProperty("ID da solicitação."),
      stepId: uuidProperty("ID do passo."),
      decision: enumProperty(["approve", "reject"], "Decisão."),
      note: stringProperty("Observação."),
    },
    ["requestId", "stepId", "decision"],
  ),
  async handler(input, context) {
    const db = getDb();
    const validated = decideApprovalInputSchema.parse(input);

    // Validate request and ownership
    const [request] = await db
      .select()
      .from(processCandidates)
      .where(
        and(
          eq(processCandidates.id, validated.requestId),
          eq(processCandidates.workspaceId, context.workspaceId),
          eq(processCandidates.origin, REQUEST_ORIGIN)
        )
      )
      .limit(1);

    if (!request || request.status !== "pending") {
      return { success: false, error: { code: "INVALID_STATE", message: "Solicitação não encontrada ou já finalizada." } };
    }

    // Validate step and ownership
    const [step] = await db
      .select()
      .from(processCandidates)
      .where(
        and(
          eq(processCandidates.id, validated.stepId),
          eq(processCandidates.workspaceId, context.workspaceId),
          eq(processCandidates.origin, STEP_ORIGIN)
        )
      )
      .limit(1);

    if (!step || (step.proposedDefinition as any).requestId !== validated.requestId) {
        return { success: false, error: { code: "NOT_FOUND", message: "Passo não encontrado." } };
    }

    if (step.status !== "pending") {
        return { success: false, error: { code: "ALREADY_DECIDED", message: "Este passo já possui uma decisão." } };
    }

    // Update step
    await db
      .update(processCandidates)
      .set({
        status: validated.decision === "approve" ? "approved" : "rejected",
        proposedDefinition: {
          ...(step.proposedDefinition as any),
          decision: validated.decision,
          decidedAt: new Date(),
          decidedById: context.actor.id,
          note: validated.note,
        },
      })
      .where(
        and(
          eq(processCandidates.id, validated.stepId),
          eq(processCandidates.workspaceId, context.workspaceId),
          eq(processCandidates.origin, STEP_ORIGIN)
        )
      );

    // Update request status
    if (validated.decision === "reject") {
        await db
          .update(processCandidates)
          .set({ status: "rejected", updatedAt: new Date() })
          .where(
            and(
              eq(processCandidates.id, validated.requestId),
              eq(processCandidates.workspaceId, context.workspaceId),
              eq(processCandidates.origin, REQUEST_ORIGIN)
            )
          );
    } else {
        // Logic for next step or completion... simplified here
        await db
          .update(processCandidates)
          .set({ status: "completed", updatedAt: new Date() })
          .where(
            and(
              eq(processCandidates.id, validated.requestId),
              eq(processCandidates.workspaceId, context.workspaceId),
              eq(processCandidates.origin, REQUEST_ORIGIN)
            )
          );
    }

    return {
      success: true,
      data: { id: validated.requestId },
      events: [
        {
          eventType: "approval_workflow.decided",
          entityType: "approval_request",
          entityId: validated.requestId,
          payload: validated,
        },
      ],
    };
  },
};
