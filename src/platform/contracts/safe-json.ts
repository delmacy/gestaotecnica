import { z } from "zod";

/**
 * PKG-SAFE-JSON-CONTRACT-001
 * Shared security contract for safe JSON values.
 */

export type SafeJsonPrimitive = null | string | boolean | number;
export type SafeJsonArray = SafeJsonValue[];
export type SafeJsonRecord = { [key: string]: SafeJsonValue };
export type SafeJsonValue = SafeJsonPrimitive | SafeJsonArray | SafeJsonRecord;

export type SafeJsonCheckReason =
  | "UNSUPPORTED_TYPE"
  | "NON_FINITE_NUMBER"
  | "ACCESSOR"
  | "SYMBOL_KEY"
  | "CYCLE"
  | "UNSUPPORTED_PROTOTYPE"
  | "HOSTILE_OBJECT";

export type SafeJsonCheckResult =
  | { safe: true }
  | {
      safe: false;
      reason: SafeJsonCheckReason;
      path: Array<string | number>;
    };

/**
 * Internal recursive checker for safe JSON values.
 * Uses an active path Set for cycle detection while allowing DAGs.
 */
function internalCheckSafeJson(
  value: unknown,
  path: Array<string | number> = [],
  activePath: Set<unknown> = new Set()
): SafeJsonCheckResult {
  // 1. Primitives
  if (value === null) return { safe: true };

  const type = typeof value;

  if (type === "string" || type === "boolean") {
    return { safe: true };
  }

  if (type === "number") {
    if (Number.isFinite(value)) {
      return { safe: true };
    }
    return { safe: false, reason: "NON_FINITE_NUMBER", path };
  }

  // Rejeitar outros tipos primitivos (undefined, bigint, symbol)
  if (type !== "object") {
    return { safe: false, reason: "UNSUPPORTED_TYPE", path };
  }

  // 2. Objects and Arrays
  // Introspecção segura protegida por try/catch (para proxies hostis ou revogados)
  try {
    // Ciclo detectado se o objeto já estiver no caminho ativo
    if (activePath.has(value)) {
      return { safe: false, reason: "CYCLE", path };
    }

    const proto = Object.getPrototypeOf(value);

    // Verificação de Arrays
    if (Array.isArray(value)) {
      if (proto !== Array.prototype) {
        return { safe: false, reason: "UNSUPPORTED_PROTOTYPE", path };
      }

      activePath.add(value);
      try {
        // 1. Reject symbol keys on arrays
        let symbols: symbol[] = [];
        try {
          symbols = Object.getOwnPropertySymbols(value);
        } catch {
          return { safe: false, reason: "HOSTILE_OBJECT", path };
        }
        if (symbols.length > 0) {
          return { safe: false, reason: "SYMBOL_KEY", path };
        }

        // 2. Get length safely via descriptor to avoid proxy traps executing code
        let lengthDescriptor: PropertyDescriptor | undefined;
        try {
          lengthDescriptor = Object.getOwnPropertyDescriptor(value, "length");
        } catch {
          return { safe: false, reason: "HOSTILE_OBJECT", path: [...path, "length"] };
        }

        if (!lengthDescriptor || lengthDescriptor.get || lengthDescriptor.set || typeof lengthDescriptor.value !== "number") {
          return { safe: false, reason: "HOSTILE_OBJECT", path: [...path, "length"] };
        }
        const length = lengthDescriptor.value;

        // 3. Inspect all own property names via Reflect.ownKeys to catch non-enumerable numeric keys
        let ownKeys: (string | symbol)[] = [];
        try {
          ownKeys = Reflect.ownKeys(value);
        } catch {
          return { safe: false, reason: "HOSTILE_OBJECT", path };
        }

        const visitedIndices = new Set<string>();

        for (const key of ownKeys) {
          if (typeof key === "symbol") {
             return { safe: false, reason: "SYMBOL_KEY", path };
          }
          if (key === "length") continue;

          // Validate that key is a canonical numeric index "0", "1", ...
          const index = Number(key);
          if (!Number.isInteger(index) || index < 0 || index.toString() !== key) {
            return { safe: false, reason: "HOSTILE_OBJECT", path: [...path, key] };
          }

          if (index >= length) {
             return { safe: false, reason: "HOSTILE_OBJECT", path: [...path, key] };
          }

          visitedIndices.add(key);

          let descriptor: PropertyDescriptor | undefined;
          try {
            descriptor = Object.getOwnPropertyDescriptor(value, key);
          } catch {
            return { safe: false, reason: "HOSTILE_OBJECT", path: [...path, key] };
          }

          if (!descriptor) {
            return { safe: false, reason: "HOSTILE_OBJECT", path: [...path, key] };
          }

          if (descriptor.get || descriptor.set) {
            return { safe: false, reason: "ACCESSOR", path: [...path, key] };
          }

          const result = internalCheckSafeJson(descriptor.value, [...path, key], activePath);
          if (!result.safe) return result;
        }

        // 4. Sparse-array policy: check for missing indices
        // AND check if there are any other indices < length that were missed by ownKeys (for hostile proxies)
        for (let i = 0; i < length; i++) {
          const key = i.toString();

          if (!visitedIndices.has(key)) {
            let descriptor: PropertyDescriptor | undefined;
            try {
               descriptor = Object.getOwnPropertyDescriptor(value, key);
            } catch {
               return { safe: false, reason: "HOSTILE_OBJECT", path: [...path, i] };
            }

            if (!descriptor) {
               return { safe: false, reason: "HOSTILE_OBJECT", path: [...path, i] };
            }

            // Found an index that wasn't in ownKeys but exists. Hostile proxy.
            if (descriptor.get || descriptor.set) {
              return { safe: false, reason: "ACCESSOR", path: [...path, key] };
            }
            const result = internalCheckSafeJson(descriptor.value, [...path, key], activePath);
            if (!result.safe) return result;
          }
        }

        // Final protection: check if there's any property we missed that could be a numeric index >= length
        // This is handled by the loop over ownKeys.

      } finally {
        activePath.delete(value);
      }
      return { safe: true };
    }

    // Verificação de Plain Objects
    let isPlainObject = false;
    try {
      isPlainObject = proto === Object.prototype || proto === null;
    } catch {
      return { safe: false, reason: "HOSTILE_OBJECT", path };
    }

    if (!isPlainObject) {
      return { safe: false, reason: "UNSUPPORTED_PROTOTYPE", path };
    }

    activePath.add(value);
    try {
      // Rejeitar chaves de símbolos
      let symbols: symbol[] = [];
      try {
        symbols = Object.getOwnPropertySymbols(value);
      } catch {
        return { safe: false, reason: "HOSTILE_OBJECT", path };
      }

      if (symbols.length > 0) {
        return { safe: false, reason: "SYMBOL_KEY", path };
      }

      let keys: string[] = [];
      try {
        keys = Object.getOwnPropertyNames(value);
      } catch {
        return { safe: false, reason: "HOSTILE_OBJECT", path };
      }

      for (const key of keys) {
        let descriptor: PropertyDescriptor | undefined;
        try {
          descriptor = Object.getOwnPropertyDescriptor(value, key);
        } catch {
          return { safe: false, reason: "HOSTILE_OBJECT", path: [...path, key] };
        }

        if (!descriptor) continue; // Não deve acontecer com getOwnPropertyNames

        if (descriptor.get || descriptor.set) {
          return { safe: false, reason: "ACCESSOR", path: [...path, key] };
        }

        const result = internalCheckSafeJson(descriptor.value, [...path, key], activePath);
        if (!result.safe) return result;
      }
    } finally {
      activePath.delete(value);
    }

    return { safe: true };
  } catch {
    return { safe: false, reason: "HOSTILE_OBJECT", path };
  }
}

/**
 * Public API to validate if a value is a safe JSON structure.
 */
export function checkSafeJsonValue(value: unknown): SafeJsonCheckResult {
  return internalCheckSafeJson(value);
}

/**
 * Zod schema for any safe JSON value.
 */
export const SafeJsonValueSchema = z.unknown().superRefine((val, ctx) => {
  const result = checkSafeJsonValue(val);
  if (!result.safe) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Insecure JSON value detected: ${result.reason} at ${result.path.join(".") || "root"}`,
      params: { reason: result.reason, path: result.path },
    });
  }
}) as z.ZodType<SafeJsonValue>;

/**
 * Zod schema for a safe JSON record (plain object).
 */
export const SafeJsonRecordSchema = z.unknown().superRefine((val, ctx) => {
  const result = checkSafeJsonValue(val);
  if (!result.safe) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Insecure JSON record detected: ${result.reason} at ${result.path.join(".") || "root"}`,
      params: { reason: result.reason, path: result.path },
    });
    return;
  }

  if (val === null || typeof val !== "object" || Array.isArray(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Expected a safe JSON record (plain object), but received a primitive or array.",
    });
  }
}) as z.ZodType<SafeJsonRecord>;
