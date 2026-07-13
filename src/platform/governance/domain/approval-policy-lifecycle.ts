import { ApprovalPolicyStatus } from "../contracts/approval-policy";

/**
 * Validates whether an approval policy status transition is allowed.
 *
 * Explicit allowed transitions:
 * - draft -> active
 * - draft -> archived
 * - active -> archived
 * - archived is terminal (no transitions allowed)
 * - Self-transitions are rejected
 *
 * @param from The current approval policy status
 * @param to The target approval policy status
 * @returns boolean True if the transition is allowed, false otherwise
 */
export function canTransitionApprovalPolicyStatus(from: ApprovalPolicyStatus, to: ApprovalPolicyStatus): boolean {
  if (from === to) {
    return false;
  }

  switch (from) {
    case "draft":
      return to === "active" || to === "archived";
    case "active":
      return to === "archived";
    case "archived":
      return false; // archived is terminal
    default:
      return false;
  }
}
