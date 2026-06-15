import { createHash } from "node:crypto";
import {
  TraceReceipt,
  TraceReceiptSchema,
  TraceReceiptHashAlgorithm,
  TraceReceiptVerificationResult,
  TraceReceiptVerificationResultSchema,
} from "./contracts";

/**
 * Internal helper to get a canonical version of a value (sorted keys for objects, recursive for arrays).
 * Handles:
 * - nested objects: sorted keys
 * - arrays: recursive elements
 * - null: preserved
 * - booleans: preserved
 * - numbers: preserved
 * - Unicode strings: preserved
 * - undefined object properties: omitted from JSON.stringify
 * - undefined array entries: preserved as null in JSON.stringify
 *
 * Rejects:
 * - circular references: NON_CANONICAL_CIRCULAR_REFERENCE
 * - bigint: NON_CANONICAL_BIGINT
 * - function: NON_CANONICAL_FUNCTION
 * - symbol: NON_CANONICAL_SYMBOL
 */
function getCanonicalValue(payload: unknown, seen = new WeakSet<object>()): unknown {
  if (payload === null) return null;

  const type = typeof payload;

  if (type === "bigint") throw new Error("NON_CANONICAL_BIGINT");
  if (type === "function") throw new Error("NON_CANONICAL_FUNCTION");
  if (type === "symbol") throw new Error("NON_CANONICAL_SYMBOL");

  if (type !== "object") {
    return payload;
  }

  // At this point it's an object or array (and not null)
  if (seen.has(payload as object)) {
    throw new Error("NON_CANONICAL_CIRCULAR_REFERENCE");
  }
  seen.add(payload as object);

  if (Array.isArray(payload)) {
    return payload.map((item) => getCanonicalValue(item, seen));
  }

  const sortedKeys = Object.keys(payload as object).sort();
  const sortedObject: Record<string, unknown> = {};

  for (const key of sortedKeys) {
    const value = (payload as Record<string, unknown>)[key];
    if (value !== undefined) {
      sortedObject[key] = getCanonicalValue(value, seen);
    }
  }

  return sortedObject;
}

/**
 * Deterministically stringifies an object by sorting its keys.
 */
export function canonicalizeReceiptPayload(payload: unknown): string {
  return JSON.stringify(getCanonicalValue(payload));
}

/**
 * Creates a signable payload for a receipt.
 * Excludes fields that would make the hash self-referential:
 * - hashes with scope "receipt"
 */
export function createSignableReceiptPayload(receipt: TraceReceipt): string {
  const { hashes, ...rest } = receipt;

  // Filter out receipt-scope hashes to avoid self-reference
  const signableHashes = hashes.filter(h => h.scope !== "receipt");

  const signableObject = {
    ...rest,
    hashes: signableHashes,
  };

  return canonicalizeReceiptPayload(signableObject);
}

/**
 * Calculates a hexadecimal hash for the given string payload using the specified algorithm.
 */
export function calculateReceiptHash(
  payload: string,
  algorithm: TraceReceiptHashAlgorithm = "sha256"
): string {
  return createHash(algorithm).update(payload).digest("hex");
}

/**
 * Validates and creates a TraceReceipt.
 */
export function createTraceReceipt(input: unknown): TraceReceipt {
  return TraceReceiptSchema.parse(input);
}

/**
 * Verifies if the receipt's hash matches the expected value.
 * Verification is deterministic: requires explicit algorithm, expectedHash, and verifiedAt.
 * Validates output using TraceReceiptVerificationResultSchema.
 */
export function verifyReceiptHash(
  receipt: TraceReceipt,
  context: {
    algorithm: TraceReceiptHashAlgorithm;
    expectedHash: string;
    verifiedAt: string;
  }
): TraceReceiptVerificationResult {
  const signable = createSignableReceiptPayload(receipt);
  const actualHash = calculateReceiptHash(signable, context.algorithm);

  const isValid = actualHash === context.expectedHash;

  const resultCandidate = {
    valid: isValid,
    timestamp: context.verifiedAt,
    details: isValid ? undefined : `Hash mismatch. Expected ${context.expectedHash}, got ${actualHash}`,
  };

  return TraceReceiptVerificationResultSchema.parse(resultCandidate);
}

/**
 * Links a receipt to a previous one, ensuring no self-reference.
 * Produces a new object and validates against TraceReceiptSchema.
 */
export function linkReceiptToPrevious(
  receipt: TraceReceipt,
  previousReceiptId: string
): TraceReceipt {
  if (receipt.id === previousReceiptId) {
    throw new Error("A receipt cannot point to itself as previousReceiptId");
  }

  const linkedReceipt = {
    ...receipt,
    previousReceiptId,
  };

  return TraceReceiptSchema.parse(linkedReceipt);
}
