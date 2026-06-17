import { PlatformErrorEnvelope, PlatformErrorEnvelopeSchema } from "./schema";

/**
 * Recursively sorts the keys of an object to ensure deterministic JSON serialization.
 * Only objects are sorted; arrays preserve their original order.
 * Primitives, null, and undefined are returned as is.
 * Rejects/Neutralizes unsafe keys like __proto__, prototype, constructor.
 */
function sortAndFilter(value: unknown): unknown {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sortAndFilter);
  }

  const obj = value as Record<string, unknown>;
  const sortedKeys = Object.keys(obj).sort();
  const result: Record<string, unknown> = {};

  for (const key of sortedKeys) {
    if (key === "__proto__" || key === "prototype" || key === "constructor") {
      continue;
    }

    const val = obj[key];
    if (val !== undefined && typeof val !== "function" && typeof val !== "symbol") {
      result[key] = sortAndFilter(val);
    }
  }

  return result;
}

/**
 * serializes a PlatformErrorEnvelope into a deterministic JSON string.
 *
 * @param envelope - The envelope to serialize.
 * @returns A deterministic JSON string.
 * @throws Error if the envelope does not match the canonical schema.
 */
export function serializePlatformError(envelope: PlatformErrorEnvelope): string {
  // 1. Validate with canonical schema
  const validated = PlatformErrorEnvelopeSchema.parse(envelope);

  // 2. Deterministic sorting and safe key filtering
  const sorted = sortAndFilter(validated);

  // 3. Stringify
  return JSON.stringify(sorted);
}

/**
 * deserializes a JSON string into a validated PlatformErrorEnvelope.
 *
 * @param serialized - The JSON string to deserialize.
 * @returns A validated PlatformErrorEnvelope.
 * @throws Error if JSON is invalid, root is not an object, or schema validation fails.
 */
export function deserializePlatformError(serialized: string): PlatformErrorEnvelope {
  if (typeof serialized !== "string") {
    throw new Error("Input must be a string");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized);
  } catch {
    throw new Error("INVALID_JSON");
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("ROOT_NOT_OBJECT");
  }

  // Double check prototype pollution in the parsed object (nested)
  const sanitized = sortAndFilter(parsed);

  // Validate with canonical schema
  const validated = PlatformErrorEnvelopeSchema.parse(sanitized);

  return Object.freeze(validated);
}

/**
 * Safely tries to deserialize a JSON string into a PlatformErrorEnvelope.
 * Never throws.
 *
 * @param serialized - The JSON string to deserialize.
 * @returns Success object with data or error message.
 */
export function tryDeserializePlatformError(
  serialized: string
): { success: true; data: PlatformErrorEnvelope } | { success: false; error: string } {
  try {
    const data = deserializePlatformError(serialized);
    return { success: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "UNKNOWN_ERROR";

    // Safe error messages as per requirements
    if (message.includes("Unexpected token") || message === "INVALID_JSON") {
      return { success: false, error: "INVALID_JSON" };
    }
    if (message === "ROOT_NOT_OBJECT") {
      return { success: false, error: "INVALID_ENVELOPE" };
    }
    if (message.includes("invalid_type") || message.includes("Required") || message.includes("invalid_string") || message.includes("invalid_format")) {
      return { success: false, error: "INVALID_ENVELOPE" };
    }

    return { success: false, error: "INVALID_ENVELOPE" };
  }
}
