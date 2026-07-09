import { CapabilityStatus } from "./schemas";

/**
 * Validates whether a capability status transition is allowed.
 *
 * Explicit allowed transitions:
 * - draft -> active
 * - draft -> retired
 * - active -> deprecated
 * - active -> retired
 * - deprecated -> retired
 * - retired is terminal (no transitions allowed)
 * - Self-transitions are rejected
 *
 * @param from The current capability status
 * @param to The target capability status
 * @returns boolean True if the transition is allowed, false otherwise
 */
export function canTransitionCapabilityStatus(from: CapabilityStatus, to: CapabilityStatus): boolean {
  if (from === to) {
    return false;
  }

  switch (from) {
    case "draft":
      return to === "active" || to === "retired";
    case "active":
      return to === "deprecated" || to === "retired";
    case "deprecated":
      return to === "retired";
    case "retired":
      return false; // retired is terminal
    default:
      return false;
  }
}
