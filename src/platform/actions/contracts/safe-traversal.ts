export type TraversalResult =
  | { isSafe: true }
  | { isSafe: false; reason: "FUNCTION" | "ACCESSOR" | "CYCLE" | "REVOKED_PROXY" | "HOSTILE_OBJECT" };

/**
 * Checks if a value is safe for serialization using strict traversal.
 * - No prototype traversal
 * - No getter/setter execution (rejects if present)
 * - Cycle detection (rejects if present)
 * - Handles proxies/hostile objects safely
 * - No 'any' usage
 */
export function checkSafety(value: unknown, seen = new WeakSet()): TraversalResult {
  if (typeof value === "function") {
    return { isSafe: false, reason: "FUNCTION" };
  }

  if (value === null || typeof value !== "object") {
    return { isSafe: true };
  }

  // Handle cycles - Rejects cycles as non-serializable for this contract
  if (seen.has(value)) {
    return { isSafe: false, reason: "CYCLE" };
  }
  seen.add(value);

  try {
    const descriptors = Object.getOwnPropertyDescriptors(value);
    const keys = Object.keys(descriptors);

    for (const key of keys) {
      const descriptor = descriptors[key];

      // Reject any own property that is a getter or setter
      if (descriptor.get || descriptor.set) {
        return { isSafe: false, reason: "ACCESSOR" };
      }

      // Recurse only through descriptor.value (the data property)
      const result = checkSafety(descriptor.value, seen);
      if (!result.isSafe) {
        return result;
      }
    }
  } catch {
    // If Object.getOwnPropertyDescriptors throws, it's likely a revoked proxy or hostile object
    return { isSafe: false, reason: "REVOKED_PROXY" };
  }

  return { isSafe: true };
}
