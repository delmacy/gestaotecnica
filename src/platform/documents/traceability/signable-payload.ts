import {
  TraceReceipt,
  TraceReceiptSchema,
  TraceReceiptHash,
} from "./contracts";
import { canonicalizeTraceValue } from "./canonicalization";
import { createTraceHash } from "./hashing";

/**
 * Creates a deterministic payload for a Trace Receipt by removing the top-level 'hashes' field.
 * This avoids self-reference when calculating the receipt's own hash.
 *
 * @param receipt The Trace Receipt to process
 * @returns A record containing all receipt fields except the top-level 'hashes'
 */
export function createSignableTraceReceiptPayload(
  receipt: TraceReceipt
): Record<string, unknown> {
  const validated = TraceReceiptSchema.parse(receipt);

  // Destructure to remove top-level hashes while preserving everything else
  const { hashes: _hashes, ...payload } = validated;

  return payload;
}

/**
 * Canonicalizes the signable payload of a Trace Receipt into a deterministic string.
 *
 * @param receipt The Trace Receipt to canonicalize
 * @returns A deterministic string representation
 */
export function canonicalizeSignableTraceReceipt(
  receipt: TraceReceipt
): string {
  return canonicalizeTraceValue(createSignableTraceReceiptPayload(receipt));
}

/**
 * Creates the self-hash for a Trace Receipt.
 *
 * @param receipt The Trace Receipt to hash
 * @param algorithm The hashing algorithm to use
 * @returns A validated TraceReceiptHash object with 'receipt' scope
 */
export function createTraceReceiptSelfHash(
  receipt: TraceReceipt,
  algorithm: "sha256" | "sha512"
): TraceReceiptHash {
  return createTraceHash(
    createSignableTraceReceiptPayload(receipt),
    algorithm,
    "receipt"
  );
}
