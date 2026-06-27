import { getRuntimeDb } from "@/db";
import { processCandidates } from "@/db/platform/schema/candidates";
import { eq, and, asc, sql } from "drizzle-orm";
import { type ActionDefinition, type ActionResult } from "@/platform/actions";
import { assertWorkspaceMembership } from "@/modules/workspace-membership/service";
import { appendDomainEvent } from "@/platform/events/event-writer";
import { randomUUID } from "node:crypto";
import { getApprovalRequest, getApprovalSteps } from "./queries";

const REQUEST_ORIGIN = "approval-request";
const STEP_ORIGIN = "approval-step";
const MODULE_KEY = "approval-workflow";

export const requestApproval: ActionDefinition = {
  key: "approval.request",
  moduleKey: MODULE_KEY,
  inputSchema: {
    type: "object",
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      subjectType: { type: "string" },
      subjectId: { type: "string" },
      steps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            approverId: { type: "string", format: "uuid" },
            approverType: { type: "string", enum: ["user", "role"] },
          },
          // required moved to properties object in next level if needed, but ActionSchemaProperty doesn't have it.
          // In standard JSON schema it should be inside 'items' if it's an object.
          // Our ActionSchemaProperty doesn't seem to support 'required' inside it.
        } as any
      } as any
    },
    required: ["title", "subjectType", "subjectId", "steps"],
  },
  handler: async (input: any, context): Promise<ActionResult> => {
    const db = getRuntimeDb();
    const requestId = randomUUID();

    // 1. Validate requester membership
    await assertWorkspaceMembership(context.actor.id!, context.workspaceId);

    // 2. Create Request
    await db.insert(processCandidates).values({
      id: requestId,
      workspaceId: context.workspaceId,
      name: input.title,
      description: input.description,
      status: "pending",
      origin: REQUEST_ORIGIN,
      createdById: context.actor.id,
      proposedDefinition: {
        subjectType: input.subjectType,
        subjectId: input.subjectId,
        currentStep: 0,
        metadata: {},
      }
    });

    // 3. Create Steps
    for (let i = 0; i < input.steps.length; i++) {
      const step = input.steps[i];
      // Validate approver exists (if user)
      if (step.approverType === "user") {
        await assertWorkspaceMembership(step.approverId, context.workspaceId);
      }

      await db.insert(processCandidates).values({
        id: randomUUID(),
        workspaceId: context.workspaceId,
        name: `Step ${i} for ${input.title}`,
        status: i === 0 ? "pending" : "queued",
        origin: STEP_ORIGIN,
        proposedDefinition: {
          requestId,
          order: i,
          approverType: step.approverType,
          approverId: step.approverId,
          metadata: {},
        }
      });
    }

    // 4. Emit Event
    await appendDomainEvent({
      workspaceId: context.workspaceId,
      eventType: "approval.requested",
      entityType: "approval-request",
      entityId: requestId,
      schemaVersion: "1.0",
      payload: { title: input.title, subjectType: input.subjectType, subjectId: input.subjectId },
      metadata: {},
    }, context);

    return { success: true, data: { requestId } };
  }
};

export const decideApproval: ActionDefinition = {
  key: "approval.decide",
  moduleKey: MODULE_KEY,
  inputSchema: {
    type: "object",
    properties: {
      requestId: { type: "string", format: "uuid" },
      stepId: { type: "string", format: "uuid" },
      decision: { type: "string", enum: ["approve", "reject"] },
      reason: { type: "string" },
    },
    required: ["requestId", "stepId", "decision"],
  },
  handler: async (input: any, context): Promise<ActionResult> => {
    const db = getRuntimeDb();

    // 1. Load and Validate Request
    const request = await getApprovalRequest(input.requestId, context.workspaceId);
    if (!request) throw new Error("Approval request not found.");
    if (["completed", "rejected", "cancelled"].includes(request.status)) {
      throw new Error("Cannot decide on a finished approval request.");
    }

    // 2. Load and Validate Step
    const steps = await getApprovalSteps(input.requestId, context.workspaceId);
    const step = steps.find(s => s.id === input.stepId);
    if (!step) throw new Error("Step not found or does not belong to this request.");
    if (step.status !== "pending") throw new Error("This step is not currently pending a decision.");

    // 3. Validate Actor is the Approver
    if (step.approverId !== context.actor.id) {
      throw new Error("Actor is not the authorized approver for this step.");
    }

    const isLastStep = step.order === steps.length - 1;

    if (input.decision === "reject") {
      // Reject Step
      await updateStepStatus(db, step.id, "rejected", {
        decision: "reject",
        decidedBy: context.actor.id,
        decidedAt: new Date().toISOString(),
        reason: input.reason
      });

      // Reject Request
      await updateRequestStatus(db, request.id, "rejected");

      await appendDomainEvent({
        workspaceId: context.workspaceId,
        eventType: "approval.step_rejected",
        entityType: "approval-request",
        entityId: request.id,
        schemaVersion: "1.0",
        payload: { stepId: step.id, reason: input.reason },
        metadata: {},
      }, context);
    } else {
      // Approve Step
      await updateStepStatus(db, step.id, "approved", {
        decision: "approve",
        decidedBy: context.actor.id,
        decidedAt: new Date().toISOString(),
        reason: input.reason
      });

      if (isLastStep) {
        // Complete Request
        await updateRequestStatus(db, request.id, "completed");
        await appendDomainEvent({
          workspaceId: context.workspaceId,
          eventType: "approval.completed",
          entityType: "approval-request",
          entityId: request.id,
          schemaVersion: "1.0",
          payload: { status: "completed" },
          metadata: {},
        }, context);
      } else {
        // Advance to Next Step
        const nextStep = steps.find(s => s.order === step.order + 1);
        if (nextStep) {
          await updateStepStatus(db, nextStep.id, "pending");
          await db.update(processCandidates)
            .set({
              proposedDefinition: sql`${processCandidates.proposedDefinition} || jsonb_build_object('currentStep', ${step.order + 1})`
            })
            .where(eq(processCandidates.id, request.id));
        }

        await appendDomainEvent({
          workspaceId: context.workspaceId,
          eventType: "approval.step_approved",
          entityType: "approval-request",
          entityId: request.id,
          schemaVersion: "1.0",
          payload: { stepId: step.id, nextStepOrder: step.order + 1 },
          metadata: {},
        }, context);
      }
    }

    return { success: true };
  }
};

async function updateStepStatus(db: any, id: string, status: string, extraDef = {}) {
  await db.update(processCandidates)
    .set({
      status,
      proposedDefinition: sql`${processCandidates.proposedDefinition} || ${JSON.stringify(extraDef)}::jsonb`
    })
    .where(eq(processCandidates.id, id));
}

async function updateRequestStatus(db: any, id: string, status: string) {
  await db.update(processCandidates)
    .set({ status })
    .where(eq(processCandidates.id, id));
}
