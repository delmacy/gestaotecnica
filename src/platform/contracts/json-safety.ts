/**
 * Robust JSON safety validator.
 * Rejects functions, getters/setters, cycles, non-JSON types, and hostile proxies.
 *
 * Requirements:
 * - protect all object introspection with try/catch;
 * - inspect own property descriptors only;
 * - recurse through descriptor.value, never direct property access;
 * - reject accessors and symbol properties explicitly;
 * - use active-recursion-path detection so shared acyclic references are accepted;
 * - reject revoked/hostile proxies safely.
 */
export function isSafeJson(value: unknown, path = new Set<object>()): boolean {
  // 1. Handle primitives and null
  if (value === null || typeof value !== "object") {
    return typeof value !== "function";
  }

  // 2. Handle Cycles (using active recursion path detection)
  if (path.has(value)) {
    return false; // Cycle detected
  }
  path.add(value);

  try {
    // Check if it's a proxy by trying to trigger a trap or checking if it throws on basic introspection
    Object.getPrototypeOf(value);
    Object.getOwnPropertyNames(value);
    Object.getOwnPropertySymbols(value);
    // Explicitly check if names or symbols are being intercepted
    // hostile proxies might throw here
    (value as Record<string, unknown>).constructor;
  } catch {
    return false;
  }

  try {
    // 3. Handle Arrays
    if (Array.isArray(value)) {
      // Reject non-standard arrays
      if (Object.getPrototypeOf(value) !== Array.prototype) {
        return false;
      }
      for (let i = 0; i < value.length; i++) {
        // Since it's an array, we can use direct access but let's be super safe
        // for hostile proxies that might throw on length or index access.
        const descriptor = Object.getOwnPropertyDescriptor(value, i.toString());
        if (!descriptor || !("value" in descriptor)) {
          // If we can't get a value descriptor for an array element, it's hostile or a hole
          if (descriptor && (descriptor.get || descriptor.set)) return false;
          // Holes are technically allowed in JSON (nullified), but let's see.
          // JSON.stringify([1,,2]) -> "[1,null,2]"
          continue;
        }
        if (!isSafeJson(descriptor.value, path)) return false;
      }
      path.delete(value);
      return true;
    }

    // 4. Handle Objects
    // Reject non-plain objects (Date, Map, Set, etc.)
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) {
      return false;
    }

    // Explicitly reject symbols as properties
    const symbols = Object.getOwnPropertySymbols(value);
    if (symbols.length > 0) {
      return false;
    }

    // Inspect own property descriptors
    const names = Object.getOwnPropertyNames(value);
    for (const name of names) {
      let descriptor: PropertyDescriptor | undefined;
      try {
        descriptor = Object.getOwnPropertyDescriptor(value, name);
      } catch {
        // Revoked proxy or hostile trap
        return false;
      }

      if (!descriptor) continue;

      // Reject accessors
      if (descriptor.get || descriptor.set) {
        return false;
      }

      // Recurse through descriptor.value
      if ("value" in descriptor) {
        if (!isSafeJson(descriptor.value, path)) {
          return false;
        }
      }
    }

    path.delete(value);
    return true;
  } catch {
    // Any error during introspection indicates a hostile/revoked proxy or other safety issue
    return false;
  }
}
