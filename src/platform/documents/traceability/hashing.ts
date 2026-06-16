import { createHash, timingSafeEqual } from "node:crypto";
import { canonicalizeTraceValue } from "./canonicalization";
import {
  TraceReceiptHash,
  TraceReceiptHashSchema,
} from "./contracts";

/**
 * Hashes a value after canonicalizing it.
 *
 * @param value The value to hash
 * @param algorithm The hashing algorithm to use
 * @returns The hex-encoded hash string
 */
export function hashCanonicalTraceValue(
  value: unknown,
  algorithm: "sha256" | "sha512"
): string {
  const canonicalValue = canonicalizeTraceValue(value);
  return createHash(algorithm).update(canonicalValue, "utf8").digest("hex");
}

/**
 * Creates a TraceReceiptHash object for a given value.
 *
 * @param value The value to hash
 * @param algorithm The hashing algorithm to use
 * @param scope The scope of the hash
 * @returns A validated TraceReceiptHash object
 */
export function createTraceHash(
  value: unknown,
  algorithm: "sha256" | "sha512",
  scope: "receipt" | "artifact" | "payload" | "document"
): TraceReceiptHash {
  const hashValue = hashCanonicalTraceValue(value, algorithm);

  return TraceReceiptHashSchema.parse({
    algorithm,
    scope,
    value: hashValue,
  });
}

/**
 * Verifies if a value matches a given TraceReceiptHash.
 *
 * @param value The value to verify
 * @param hash The TraceReceiptHash to compare against
 * @returns true if the hash matches, false otherwise
 * @throws Error if the hash object is structurally invalid or canonicalization fails
 */
export function verifyTraceHash(
  value: unknown,
  hash: TraceReceiptHash
): boolean {
  // 1. Validate the hash received
  const validatedHash = TraceReceiptHashSchema.parse(hash);

  // 2. Recalculate the hash
  const calculatedHashValue = hashCanonicalTraceValue(
    value,
    validatedHash.algorithm
  );

  // 3. Compare in constant time
  const calculatedBuffer = Buffer.from(calculatedHashValue, "hex");
  const providedBuffer = Buffer.from(validatedHash.value, "hex");

  if (calculatedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(calculatedBuffer, providedBuffer);
}
