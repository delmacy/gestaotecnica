export type TraversalResult =
  | { isSafe: true }
  | { isSafe: false; reason: "FUNCTION" | "ACCESSOR" | "CYCLE" | "REVOKED_PROXY" | "UNSUPPORTED_BUILTIN" | "HOSTILE_OBJECT" };

/**
 * Checks if a value is safe for serialization using strict traversal.
 * - No prototype traversal
 * - No getter/setter execution (rejects if present)
 * - Cycle detection using active path
 * - Shared references (DAGs) allowed
 * - Built-ins like Date, Map, Set, etc. rejected
 * - Handles proxies/hostile objects safely
 */
export function checkSafety(
  value: unknown,
  path = new Set<unknown>()
): TraversalResult {
  if (typeof value === "function") {
    return { isSafe: false, reason: "FUNCTION" };
  }

  if (value === null || typeof value !== "object") {
    return { isSafe: true };
  }

  // Reject non-plain built-ins
  const tag = Object.prototype.toString.call(value);
  if (tag !== "[object Object]" && tag !== "[object Array]") {
    return { isSafe: false, reason: "UNSUPPORTED_BUILTIN" };
  }

  // Cycle detection: only reject if the object is in the CURRENT recursion path
  if (path.has(value)) {
    return { isSafe: false, reason: "CYCLE" };
  }

  path.add(value);

  try {
    const descriptors = Object.getOwnPropertyDescriptors(value);
    const keys = Object.keys(descriptors);

    for (const key of keys) {
      const descriptor = descriptors[key];

      // Reject any own property that is a getter or setter
      if (descriptor.get || descriptor.set) {
        return { isSafe: false, reason: "ACCESSOR" };
      }

      // Recurse through data property
      const result = checkSafety(descriptor.value, path);
      if (!result.isSafe) {
        return result;
      }
    }
  } catch {
    return { isSafe: false, reason: "REVOKED_PROXY" };
  } finally {
    // Remove from path after finishing this branch to allow shared references elsewhere
    path.delete(value);
  }

  return { isSafe: true };
}
