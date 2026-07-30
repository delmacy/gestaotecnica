import { z } from "zod";
import type { WorkspaceContext } from "@/platform/workspace";

// Domain Status Constraints based on DB enums
export const ServiceOrderStatusSchema = z.enum([
  "draft",
  "open",
  "assigned",
  "in_progress",
  "waiting_review",
  "completed",
  "approved",
  "cancelled",
]);

export type ServiceOrderStatus = z.infer<typeof ServiceOrderStatusSchema>;

export const ApprovalDecisionTypeSchema = z.enum(["approve", "reject"]);
export type ApprovalDecisionType = z.infer<typeof ApprovalDecisionTypeSchema>;

export interface ApprovalDecisionResult {
  status: ServiceOrderStatus;
  approvedAt?: Date;
  approvedById?: string;
  updatedAt: Date;
}

export class ApprovalWorkflowError extends Error {
  constructor(message: string, public readonly code: "INVALID_STATE" | "UNAUTHORIZED") {
    super(message);
    this.name = "ApprovalWorkflowError";
  }
}

/**
 * Validates and resolves the outcome of an approval decision based on current state and workspace context.
 *
 * Invariants:
 * - Only OS in `waiting_review` can be decided.
 * - Approval marks the OS as `approved` and records the actor and timestamp.
 * - Rejection marks the OS as `open` (returning to execution) and clears approval data.
 * - Requires a valid WorkspaceContext.
 */
export function resolveApprovalDecision(
  currentStatus: string,
  decision: string,
  context: WorkspaceContext
): ApprovalDecisionResult {
  const parsedStatus = ServiceOrderStatusSchema.safeParse(currentStatus);
  if (!parsedStatus.success || parsedStatus.data !== "waiting_review") {
    throw new ApprovalWorkflowError(
      `Cannot decide on OS in status '${currentStatus}'. Must be 'waiting_review'.`,
      "INVALID_STATE"
    );
  }

  const parsedDecision = ApprovalDecisionTypeSchema.safeParse(decision);
  if (!parsedDecision.success) {
    throw new ApprovalWorkflowError(`Invalid decision type: '${decision}'.`, "INVALID_STATE");
  }

  const now = new Date();

  if (parsedDecision.data === "approve") {
    return {
      status: "approved",
      approvedAt: now,
      approvedById: context.actor.type === "user" ? context.actor.id : undefined,
      updatedAt: now,
    };
  }

  // Reject decision
  return {
    status: "open",
    approvedAt: undefined,
    approvedById: undefined,
    updatedAt: now,
  };
}
