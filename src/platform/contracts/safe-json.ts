import { z } from "zod";

export type TraversalResult =
  | { isSafe: true }
  | { isSafe: false; reason: "FUNCTION" | "ACCESSOR" | "CYCLE" | "REVOKED_PROXY" | "UNSUPPORTED_BUILTIN" | "HOSTILE_OBJECT" | "SYMBOL_KEY" | "EXTRA_ARRAY_PROPERTIES" };

/**
 * Validates a value for safe JSON serialization using strict traversal.
 * - No prototype traversal
 * - No getter/setter execution (rejects if present)
 * - Cycle detection using active path
 * - Shared references (DAGs) allowed
 * - Built-ins and custom classes rejected
 * - Handles proxies/hostile objects safely
 * - Arrays must only contain numeric properties and length
 * - Rejects Symbol properties
 */
export function checkSafeJsonValue(
  value: unknown,
  path = new Set<unknown>()
): TraversalResult {
  if (typeof value === "function") {
    return { isSafe: false, reason: "FUNCTION" };
  }

  if (value === null || typeof value !== "object") {
    return { isSafe: true };
  }

  try {
    if (path.has(value)) {
      return { isSafe: false, reason: "CYCLE" };
    }

    const proto = Object.getPrototypeOf(value);
    const isPlainObject = proto === null || proto === Object.prototype;
    const isArray = Array.isArray(value);

    if (!isPlainObject && !isArray) {
      return { isSafe: false, reason: "UNSUPPORTED_BUILTIN" };
    }

    path.add(value);

    const keys = Object.getOwnPropertyNames(value);
    const descriptors = Object.getOwnPropertyDescriptors(value);

    for (const key of keys) {
      const descriptor = descriptors[key];

      if (descriptor.get || descriptor.set) {
        return { isSafe: false, reason: "ACCESSOR" };
      }

      if (isArray) {
        if (key !== "length" && isNaN(Number(key))) {
          return { isSafe: false, reason: "EXTRA_ARRAY_PROPERTIES" };
        }
      }

      const result = checkSafeJsonValue(descriptor.value, path);
      if (!result.isSafe) {
        return result;
      }
    }

    const symbols = Object.getOwnPropertySymbols(value);
    if (symbols.length > 0) {
      return { isSafe: false, reason: "SYMBOL_KEY" };
    }
  } catch {
    return { isSafe: false, reason: "REVOKED_PROXY" };
  } finally {
    path.delete(value);
  }

  return { isSafe: true };
}

// Zod Schema integrating the safe JSON check
export const SafeJsonValueSchema = z.unknown().superRefine((val, ctx) => {
  const result = checkSafeJsonValue(val);
  if (!result.isSafe) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid JSON payload: ${result.reason}`,
    });
  }
});

export const SafeJsonRecordSchema = z.record(z.string(), SafeJsonValueSchema);
