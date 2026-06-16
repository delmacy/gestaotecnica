/**
 * Canonicalizes a JSON-compatible value into a deterministic string.
 * Follows strict rules for object key ordering, type validation, and circular reference detection.
 *
 * @param value The value to canonicalize
 * @returns A deterministic string representation of the value
 * @throws Error with specific codes for non-canonical values or structures
 */
export function canonicalizeTraceValue(value: unknown): string {
  const activePath = new Set<unknown>();

  function walk(val: unknown): string {
    // 1. Primitives
    if (val === null) return "null";
    if (typeof val === "string") return JSON.stringify(val);
    if (typeof val === "number") {
      if (!Number.isFinite(val)) {
        throw new Error("NON_CANONICAL_NON_FINITE_NUMBER");
      }
      // JSON.stringify handles numbers correctly, including -0 as 0, which is usually fine for canonicalization
      // unless we strictly need to distinguish -0 and 0. JSON.stringify(-0) === "0".
      return JSON.stringify(val);
    }
    if (typeof val === "boolean") return JSON.stringify(val);

    // 2. Rejected types (non-object)
    if (typeof val === "bigint") throw new Error("NON_CANONICAL_BIGINT");
    if (typeof val === "function") throw new Error("NON_CANONICAL_FUNCTION");
    if (typeof val === "symbol") throw new Error("NON_CANONICAL_SYMBOL");

    // 3. Objects and Arrays
    if (typeof val === "object") {
      // Circular reference check
      if (activePath.has(val)) {
        throw new Error("NON_CANONICAL_CIRCULAR_REFERENCE");
      }
      activePath.add(val);

      try {
        let isArr: boolean;
        try {
          isArr = Array.isArray(val);
        } catch {
          throw new Error("NON_CANONICAL_PROPERTY_ACCESS");
        }

        if (isArr) {
          const arr = val as unknown[];
          let length: number;
          try {
            length = arr.length;
          } catch {
            throw new Error("NON_CANONICAL_PROPERTY_ACCESS");
          }

          const items: string[] = [];
          for (let i = 0; i < length; i++) {
            const key = i.toString();
            let descriptor: PropertyDescriptor | undefined;
            try {
              descriptor = Object.getOwnPropertyDescriptor(arr, key);
            } catch {
              throw new Error("NON_CANONICAL_PROPERTY_ACCESS");
            }

            // 1. Missing descriptor (hole)
            if (!descriptor) {
              items.push("null");
              continue;
            }

            // 2. Accessor detection (must come before value check)
            if (!("value" in descriptor) || descriptor.get || descriptor.set) {
              throw new Error("NON_CANONICAL_ACCESSOR_PROPERTY");
            }

            // 3. Undefined value
            if (descriptor.value === undefined) {
              items.push("null");
              continue;
            }

            items.push(walk(descriptor.value));
          }
          return `[${items.join(",")}]`;
        }

        // Must be literal object or null prototype
        let proto;
        try {
          proto = Object.getPrototypeOf(val);
        } catch {
          throw new Error("NON_CANONICAL_PROPERTY_ACCESS");
        }

        if (proto !== null && proto !== Object.prototype) {
          throw new Error("NON_CANONICAL_OBJECT_TYPE");
        }

        // Get own enumerable keys and sort them lexicographically
        let keys: string[];
        try {
          keys = Object.keys(val).sort();
        } catch {
          throw new Error("NON_CANONICAL_PROPERTY_ACCESS");
        }

        const pairs: string[] = [];
        for (const key of keys) {
          let descriptor: PropertyDescriptor | undefined;
          try {
            descriptor = Object.getOwnPropertyDescriptor(val, key);
          } catch {
            throw new Error("NON_CANONICAL_PROPERTY_ACCESS");
          }

          if (!descriptor) continue;

          // Reject accessors
          if (descriptor.get || descriptor.set || !("value" in descriptor)) {
            throw new Error("NON_CANONICAL_ACCESSOR_PROPERTY");
          }

          const propValue = descriptor.value;

          // Omit undefined properties in objects
          if (propValue === undefined) continue;

          pairs.push(`${JSON.stringify(key)}:${walk(propValue)}`);
        }

        return `{${pairs.join(",")}}`;
      } finally {
        activePath.delete(val);
      }
    }

    // This handles any remaining types like 'undefined' at root
    throw new Error("NON_CANONICAL_OBJECT_TYPE");
  }

  // Handle undefined at root explicitly
  if (value === undefined) {
    throw new Error("NON_CANONICAL_OBJECT_TYPE");
  }

  return walk(value);
}
