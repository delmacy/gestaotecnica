import { ZodError } from "zod";
import { PlatformErrorEnvelope, PlatformErrorEnvelopeSchema } from "./schema";

const UNSAFE_KEYS = ["__proto__", "prototype", "constructor"];

/**
 * Recursively scans a value for unsafe keys and throws if found.
 *
 * @param value - The value to scan.
 * @throws Error with message "UNSAFE_KEY" if an unsafe key is detected.
 */
export function assertNoUnsafeKeys(value: unknown): void {
  if (value === null || typeof value !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      assertNoUnsafeKeys(item);
    }
    return;
  }

  const obj = value as Record<string, unknown>;

  // 1. Scan ALL keys that might be present in a JSON-parsed object.
  // We use a for...in loop because it includes enumerable inherited properties,
  // which might be polluted if we are not careful.
  // Requirements: "inspect own enumerable JSON properties recursively".
  // JSON.parse only creates own properties.

  for (const key in obj) {
    if (UNSAFE_KEYS.includes(key)) {
      throw new Error("UNSAFE_KEY");
    }
  }

  // 2. Also explicitly check for non-enumerable __proto__, prototype, constructor
  // because JSON.parse might be tricked or we might be receiving a pre-parsed object.
  const props = Object.getOwnPropertyNames(obj);
  for (const key of props) {
    if (UNSAFE_KEYS.includes(key)) {
      throw new Error("UNSAFE_KEY");
    }
  }

  // 3. Scan values recursively.
  // We use Object.keys to find nested objects in enumerable properties.
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val !== null && typeof val === "object") {
      assertNoUnsafeKeys(val);
    }
  }
}

/**
 * Recursively sorts the keys of an object to ensure deterministic JSON serialization.
 * Only objects are sorted; arrays preserve their original order.
 * Primitives, null, and undefined are returned as is.
 *
 * @param value - The value to sort.
 * @returns A new value with sorted object keys.
 */
export function sortObjectKeys(value: unknown): unknown {
  if (value === null || typeof value !== "object" || value instanceof Date) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sortObjectKeys);
  }

  const obj = value as Record<string, unknown>;
  const sortedKeys = Object.keys(obj).sort();
  const result: Record<string, unknown> = {};

  for (const key of sortedKeys) {
    result[key] = sortObjectKeys(obj[key]);
  }

  return result;
}

/**
 * serializes a PlatformErrorEnvelope into a deterministic JSON string.
 *
 * @param envelope - The envelope to serialize.
 * @returns A deterministic JSON string.
 * @throws Error if the envelope does not match the canonical schema or contains unsafe keys.
 */
export function serializePlatformError(envelope: PlatformErrorEnvelope): string {
  // 1. Validate with canonical schema
  const validated = PlatformErrorEnvelopeSchema.parse(envelope);

  // 2. Explicitly check for unsafe keys in the validated structure
  assertNoUnsafeKeys(validated);

  // 3. Deterministic sorting
  const sorted = sortObjectKeys(validated);

  // 4. Stringify
  return JSON.stringify(sorted);
}

/**
 * deserializes a JSON string into a validated PlatformErrorEnvelope.
 *
 * @param serialized - The JSON string to deserialize.
 * @returns A validated PlatformErrorEnvelope.
 * @throws Error with code "INVALID_JSON", "UNSAFE_KEY", or "INVALID_ENVELOPE".
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
    throw new Error("INVALID_ENVELOPE"); // Root must be an object
  }

  // 1. Scan for unsafe keys BEFORE validation
  assertNoUnsafeKeys(parsed);

  // 2. Validate with canonical schema
  let validated: PlatformErrorEnvelope;
  try {
    validated = PlatformErrorEnvelopeSchema.parse(parsed);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new Error("INVALID_ENVELOPE");
    }
    throw err;
  }

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

    // Explicit classification as requested
    if (message === "INVALID_JSON" || message === "UNSAFE_KEY" || message === "INVALID_ENVELOPE") {
      return { success: false, error: message };
    }

    return { success: false, error: "INVALID_ENVELOPE" };
  }
}
