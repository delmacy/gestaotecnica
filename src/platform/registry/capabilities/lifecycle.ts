import { CapabilityStatus, Capability } from "./schemas";

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

/**
 * Checks if a draft capability is structurally ready for activation.
 * Requires draft status, at least one business object, and at least one action.
 *
 * @param capability The capability to evaluate
 * @returns boolean True if ready for activation
 */
export function isCapabilityReadyForActivation(capability: Capability): boolean {
  if (capability.status !== "draft") {
    return false;
  }

  if (!capability.businessObjects || capability.businessObjects.length === 0) {
    return false;
  }

  if (!capability.businessActions || capability.businessActions.length === 0) {
    return false;
  }

  return true;
}

/**
 * Checks if a capability can be safely deactivated (deprecated or retired)
 * based on the status of its dependents.
 *
 * @param targetStatus The target status for the capability
 * @param dependents List of dependents with their current status
 * @returns boolean True if the capability can be deactivated
 */
export function canDeactivateCapability(
  targetStatus: CapabilityStatus,
  dependents: { status: CapabilityStatus }[]
): boolean {
  if (targetStatus !== "deprecated" && targetStatus !== "retired") {
    return true;
  }

  return !dependents.some((dep) => dep.status === "active" || dep.status === "draft");
}
