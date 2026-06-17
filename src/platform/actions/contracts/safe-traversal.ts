/**
 * Checks if a value contains any functions using safe traversal.
 * - No prototype traversal
 * - No getter execution
 * - Cycle detection
 * - Handles proxies/hostile objects
 */
export function hasFunction(value: unknown, seen = new WeakSet()): boolean {
  if (typeof value === "function") return true;

  if (value === null || typeof value !== "object") {
    return false;
  }

  // Handle cycles
  if (seen.has(value)) {
    return false;
  }
  seen.add(value);

  // Use Object.getOwnPropertyNames to avoid prototype traversal and inherited getters
  const props = Object.getOwnPropertyNames(value);
  for (const prop of props) {
    const descriptor = Object.getOwnPropertyDescriptor(value, prop);

    // Skip if it's a getter to avoid execution
    if (descriptor?.get) {
      continue;
    }

    // Recurse on the value
    try {
      // Accessing property directly might trigger proxy traps or inherited getters if not careful
      // But we already checked it's an "own" property and not a getter descriptor.
      const val = (value as any)[prop];
      if (hasFunction(val, seen)) {
        return true;
      }
    } catch {
      // If accessing the property throws (e.g. revoked proxy), we treat it as potentially unsafe/unserializable
      return true;
    }
  }

  return false;
}
