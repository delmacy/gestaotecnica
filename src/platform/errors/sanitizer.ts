/**
 * PKG-ERROR-SANITIZER-001
 * Sanitização segura de erros desconhecidos.
 */

const MAX_DEPTH = 5;
const MAX_PROPS = 50;
const MAX_ITEMS = 50;
const MAX_STRING = 2000;

const ALLOWED_ROOT_KEYS = new Set([
  "name",
  "message",
  "code",
  "category",
  "status",
  "statusCode",
  "cause",
  "issues",
  "metadata",
]);

const SENSITIVE_KEYS = new Set([
  "password",
  "passwd",
  "secret",
  "token",
  "accesstoken",
  "refreshtoken",
  "authorization",
  "cookie",
  "set-cookie",
  "apikey",
  "privatekey",
  "clientsecret",
  "connectionstring",
]);

const FORBIDDEN_KEYS = new Set([
  "stack",
  "raw",
  "original",
  "request",
  "response",
  "headers",
  "cookies",
  "sql",
  "query",
  "environment",
  "process",
]);

/**
 * Checks if a key is sensitive and should be redacted.
 */
function isSensitive(key: string): boolean {
  return SENSITIVE_KEYS.has(key.toLowerCase());
}

/**
 * Safely converts a value to string without triggering hostile getters or throwing.
 */
function safeToString(value: unknown): string {
  try {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (typeof value === "bigint") return value.toString();
    if (typeof value === "symbol") return value.description || "symbol";
    if (typeof value === "function") return value.name || "function";

    if (value instanceof Date) {
      return isNaN(value.getTime()) ? "Invalid Date" : value.toISOString();
    }
    if (value instanceof RegExp) return value.toString();
    if (value instanceof URL) return value.toString();

    return Object.prototype.toString.call(value);
  } catch {
    return "[UNREADABLE]";
  }
}

/**
 * Recursively sanitizes a value.
 */
function internalSanitize(
  value: unknown,
  depth: number,
  stack: Set<unknown>
): unknown {
  // 1. Primitives and base cases
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  const type = typeof value;

  if (type === "string") {
    const str = value as string;
    if (str.length > MAX_STRING) return str.slice(0, MAX_STRING) + "[TRUNCATED]";
    return str;
  }

  if (type === "number" || type === "boolean") return value;
  if (type === "bigint") return (value as bigint).toString();
  if (type === "symbol") return (value as symbol).description || "symbol";
  if (type === "function") return (value as Function).name || "function";

  // 2. Cycle detection
  if (stack.has(value)) return "[CIRCULAR]";

  // 3. Special objects (base cases)
  try {
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? "Invalid Date" : value.toISOString();
    }
    if (value instanceof RegExp) return value.toString();
    if (value instanceof URL) return value.toString();

    if (value instanceof Map) return "[UNSUPPORTED:Map]";
    if (value instanceof Set) return "[UNSUPPORTED:Set]";
    if (value instanceof ArrayBuffer) return "[UNSUPPORTED:ArrayBuffer]";
    if (ArrayBuffer.isView(value)) return "[UNSUPPORTED:TypedArray]";
    if (value instanceof Promise) return "[UNSUPPORTED:Promise]";

    // 4. Depth check - apply for objects and arrays
    if (depth >= MAX_DEPTH) return "[TRUNCATED]";

    // Array processing
    if (Array.isArray(value)) {
      const result: unknown[] = [];
      stack.add(value);
      try {
        const len = Math.min(value.length, MAX_ITEMS);
        for (let i = 0; i < len; i++) {
          try {
            const descriptor = Object.getOwnPropertyDescriptor(value, String(i));
            if (!descriptor) {
              // Hole or missing descriptor
              result.push("undefined");
              continue;
            }

            if (typeof descriptor.get !== "undefined") {
              // Accessor property - do not execute
              result.push("[UNREADABLE]");
            } else {
              // Data property
              result.push(internalSanitize(descriptor.value, depth + 1, stack));
            }
          } catch {
            // Descriptor lookup failure (e.g. Proxy trap throws)
            result.push("[UNREADABLE]");
          }
        }
        if (value.length > MAX_ITEMS) result.push("[TRUNCATED]");
      } finally {
        stack.delete(value);
      }
      return result;
    }

    // General Object processing
    const result: Record<string, unknown> = {};
    stack.add(value);

    try {
      // getOwnPropertyNames can throw on revoked Proxy
      const props = Object.getOwnPropertyNames(value);
      const len = Math.min(props.length, MAX_PROPS);

      for (let i = 0; i < len; i++) {
        const key = props[i];

        // Redaction and Forbidden key check
        if (isSensitive(key)) {
          result[key] = "[REDACTED]";
          continue;
        }

        if (FORBIDDEN_KEYS.has(key.toLowerCase())) {
          // Omit forbidden technical keys
          continue;
        }

        try {
          const descriptor = Object.getOwnPropertyDescriptor(value, key);
          if (descriptor && typeof descriptor.get === "undefined") {
            result[key] = internalSanitize(descriptor.value, depth + 1, stack);
          } else if (descriptor && typeof descriptor.get !== "undefined") {
            // Accessor on object - omit or mark as unreadable?
            // Contract says skip or emit marker. Omission is safer for objects.
          }
        } catch {
          // Ignore hostile properties
        }
      }
    } finally {
      stack.delete(value);
    }

    return result;
  } catch {
    return "[UNREADABLE]";
  }
}

/**
 * Converts an "unknown" value into safe, limited data for PlatformErrorEnvelope details.
 *
 * @param value - The unknown value to sanitize.
 * @returns A safe record containing sanitized data.
 */
export function sanitizeUnknownError(value: unknown): Record<string, unknown> {
  try {
    if (value === null || value === undefined || typeof value !== "object") {
      return { message: safeToString(value) };
    }

    const stack = new Set<unknown>();
    const sanitized = internalSanitize(value, 0, stack);

    if (typeof sanitized !== "object" || sanitized === null || Array.isArray(sanitized)) {
      return { message: safeToString(sanitized) };
    }

    const root = sanitized as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    for (const key of Object.keys(root)) {
      if (ALLOWED_ROOT_KEYS.has(key)) {
        result[key] = root[key];
      }
    }

    // Secondary safety issue correction: Read name/message through internalSanitize result or descriptors
    if (value instanceof Error) {
      if (!result.name) {
        try {
          const d = Object.getOwnPropertyDescriptor(value, "name");
          if (d && typeof d.get === "undefined") result.name = String(d.value);
          else if (!d) result.name = value.name; // Fallback to prototype name if no own property
        } catch {
          result.name = "Error";
        }
      }
      if (!result.message) {
        try {
          const d = Object.getOwnPropertyDescriptor(value, "message");
          if (d && typeof d.get === "undefined") result.message = String(d.value);
          // If message is a getter on own property or prototype, we rely on safeToString or skip
        } catch {
          // Ignore
        }
      }
    }

    if (Object.keys(result).length === 0) {
      if (typeof root.message === "string") {
        result.message = root.message;
      } else {
        result.message = safeToString(value);
      }
    }

    return Object.freeze(result);
  } catch {
    return Object.freeze({ message: "Unknown error" });
  }
}
