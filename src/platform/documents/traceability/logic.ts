import { createHash } from "node:crypto";
import {
  TraceReceipt,
  TraceReceiptSchema,
  TraceReceiptHashAlgorithm,
  TraceReceiptVerificationResult,
} from "./contracts";

/**
 * Internal helper to get a canonical version of a value (sorted keys for objects, recursive for arrays).
 */
function getCanonicalValue(payload: unknown): unknown {
  if (payload === null || typeof payload !== "object") {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.map(getCanonicalValue);
  }

  const sortedKeys = Object.keys(payload as object).sort();
  const sortedObject: Record<string, unknown> = {};

  for (const key of sortedKeys) {
    sortedObject[key] = getCanonicalValue((payload as Record<string, unknown>)[key]);
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
 */
export function verifyReceiptHash(
  receipt: TraceReceipt,
  expectedHash: string
): TraceReceiptVerificationResult {
  // To verify the receipt itself, we typically hash the canonicalized receipt excluding the hash itself if it's stored inside.
  // However, the requirement says "verifyReceiptHash(receipt, expectedHash)".
  // Let's assume it means verifying the payload of the receipt.
  const canonical = canonicalizeReceiptPayload(receipt);
  const actualHash = calculateReceiptHash(canonical, "sha256"); // Defaulting to sha256 for receipt integrity

  const isValid = actualHash === expectedHash;

  return {
    valid: isValid,
    timestamp: new Date().toISOString(),
    details: isValid ? undefined : `Hash mismatch. Expected ${expectedHash}, got ${actualHash}`,
  };
}

/**
 * Links a receipt to a previous one, ensuring no self-reference.
 */
export function linkReceiptToPrevious(
  receipt: TraceReceipt,
  previousReceiptId: string
): TraceReceipt {
  if (receipt.id === previousReceiptId) {
    throw new Error("A receipt cannot point to itself as previousReceiptId");
  }

  return {
    ...receipt,
    previousReceiptId,
  };
}
