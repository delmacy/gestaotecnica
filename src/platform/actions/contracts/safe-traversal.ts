export type TraversalResult =
  | { isSafe: true }
  | { isSafe: false; reason: "FUNCTION" | "ACCESSOR" | "CYCLE" | "REVOKED_PROXY" | "UNSUPPORTED_BUILTIN" | "HOSTILE_OBJECT" };

/**
 * Checks if a value is safe for serialization using strict traversal.
 * - No prototype traversal
 * - No getter/setter execution (rejects if present)
 * - Cycle detection using active path
 * - Shared references (DAGs) allowed
 * - Built-ins and custom classes rejected
 * - Handles proxies/hostile objects safely
 */
export function checkSafety(
  value: unknown,
  path = new Set<unknown>()
): TraversalResult {
  // Basic non-object types
  if (typeof value === "function") {
    return { isSafe: false, reason: "FUNCTION" };
  }

  if (value === null || typeof value !== "object") {
    return { isSafe: true };
  }

  // Entire object introspection must be protected
  try {
    // 1. Cycle detection (active path)
    if (path.has(value)) {
      return { isSafe: false, reason: "CYCLE" };
    }

    // 2. Determine if it is a plain object or array without executing Symbol.toStringTag
    const proto = Object.getPrototypeOf(value);
    const isPlainObject = proto === null || proto === Object.prototype;
    const isArray = Array.isArray(value);

    if (!isPlainObject && !isArray) {
      return { isSafe: false, reason: "UNSUPPORTED_BUILTIN" };
    }

    // 3. Descend
    path.add(value);

    // We use getOwnPropertyNames to avoid prototype traversal
    const keys = Object.getOwnPropertyNames(value);
    const descriptors = Object.getOwnPropertyDescriptors(value);

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

    // Check symbols specifically for toStringTag if it's an own property
    const symbols = Object.getOwnPropertySymbols(value);
    for (const sym of symbols) {
       const descriptor = Object.getOwnPropertyDescriptor(value, sym);
       if (descriptor?.get || descriptor?.set) {
         return { isSafe: false, reason: "ACCESSOR" };
       }

       // Only recurse on non-toStringTag symbols for content safety
       if (sym !== Symbol.toStringTag) {
           const result = checkSafety(descriptor?.value, path);
           if (!result.isSafe) {
             return result;
           }
       }
    }

  } catch {
    // Catch-all for revoked proxies or hostile objects
    return { isSafe: false, reason: "REVOKED_PROXY" };
  } finally {
    path.delete(value);
  }

  return { isSafe: true };
}
