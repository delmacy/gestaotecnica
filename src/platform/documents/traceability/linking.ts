import {
  TraceReceipt,
  TraceReceiptSchema,
  TraceReceiptHash,
} from "./contracts";
import { verifyTraceHash } from "./hashing";
import { createSignableTraceReceiptPayload } from "./signable-payload";

export type TraceReceiptChainErrorCode =
  | "INVALID_RECEIPT"
  | "MISSING_SELF_HASH"
  | "INVALID_SELF_HASH"
  | "INVALID_PREVIOUS_RECEIPT_ID"
  | "DUPLICATE_RECEIPT_ID"
  | "UNEXPECTED_ROOT_LINK";

export interface TraceReceiptChainError {
  index: number;
  id: string;
  code: TraceReceiptChainErrorCode;
  message: string;
}

/**
 * Finds the self-hash of a Trace Receipt.
 * A self-hash is a hash with 'receipt' scope.
 * Returns the hash only if exactly one exists.
 *
 * @param receipt The Trace Receipt to search
 * @returns The TraceReceiptHash if exactly one is found, undefined otherwise
 */
export function findTraceReceiptSelfHash(
  receipt: TraceReceipt
): TraceReceiptHash | undefined {
  const receiptHashes = receipt.hashes.filter((h) => h.scope === "receipt");
  if (receiptHashes.length === 1) {
    return receiptHashes[0];
  }
  return undefined;
}

/**
 * Verifies the integrity of a Trace Receipt by checking its self-hash.
 *
 * @param receipt The Trace Receipt to verify
 * @returns true if the receipt is structurally valid and has exactly one valid self-hash
 */
export function verifyTraceReceiptSelfHash(receipt: TraceReceipt): boolean {
  try {
    // 1. Validate the receipt structure
    const validated = TraceReceiptSchema.parse(receipt);

    // 2. Require exactly one receipt hash
    const receiptHashes = validated.hashes.filter((h) => h.scope === "receipt");
    if (receiptHashes.length !== 1) {
      return false;
    }

    const selfHash = receiptHashes[0];

    // 3. Recalculate and verify
    const payload = createSignableTraceReceiptPayload(validated);
    return verifyTraceHash(payload, selfHash);
  } catch (error) {
    // Structural errors lead to false
    if (error instanceof Error && error.name === "ZodError") {
      return false;
    }
    // We don't catch other internal programming errors
    throw error;
  }
}

/**
 * Verifies the direct link between two Trace Receipts.
 *
 * @param previous The previous Trace Receipt in the chain
 * @param current The current Trace Receipt in the chain
 * @returns true if current points to previous and both have valid self-hashes
 */
export function verifyTraceReceiptLink(
  previous: TraceReceipt,
  current: TraceReceipt
): boolean {
  if (current.previousReceiptId !== previous.id) {
    return false;
  }

  return verifyTraceReceiptSelfHash(previous) && verifyTraceReceiptSelfHash(current);
}

/**
 * Verifies an ordered chain of Trace Receipts.
 *
 * @param receipts The sequence of Trace Receipts to verify
 * @returns An object indicating validity and a list of identified errors
 */
export function verifyTraceReceiptChain(
  receipts: readonly TraceReceipt[]
): {
  valid: boolean;
  errors: readonly TraceReceiptChainError[];
} {
  if (receipts.length === 0) {
    return { valid: true, errors: [] };
  }

  const errors: TraceReceiptChainError[] = [];
  const seenIds = new Set<string>();

  receipts.forEach((receipt, index) => {
    const id = receipt?.id ?? `unknown-${index}`;

    // 1. Structural Validation and Self-Hash Integrity
    let isStructurallyValid = false;
    try {
      TraceReceiptSchema.parse(receipt);
      isStructurallyValid = true;
    } catch {
      errors.push({
        index,
        id,
        code: "INVALID_RECEIPT",
        message: "Receipt is structurally invalid",
      });
    }

    if (isStructurallyValid) {
      const receiptHashes = receipt.hashes.filter((h) => h.scope === "receipt");
      if (receiptHashes.length === 0) {
        errors.push({
          index,
          id,
          code: "MISSING_SELF_HASH",
          message: "Receipt is missing a self-hash (scope='receipt')",
        });
      } else if (receiptHashes.length > 1) {
        errors.push({
          index,
          id,
          code: "INVALID_SELF_HASH",
          message: "Receipt has multiple self-hashes",
        });
      } else if (!verifyTraceReceiptSelfHash(receipt)) {
        errors.push({
          index,
          id,
          code: "INVALID_SELF_HASH",
          message: "Receipt self-hash is invalid",
        });
      }
    }

    // 2. Uniqueness
    if (seenIds.has(id)) {
      errors.push({
        index,
        id,
        code: "DUPLICATE_RECEIPT_ID",
        message: `Duplicate receipt ID: ${id}`,
      });
    }
    seenIds.add(id);

    // 3. Chain Linking
    if (index === 0) {
      // Root receipt should not have a previousReceiptId
      if (receipt.previousReceiptId !== undefined) {
        errors.push({
          index,
          id,
          code: "UNEXPECTED_ROOT_LINK",
          message: "Root receipt should not have previousReceiptId",
        });
      }
    } else {
      const previous = receipts[index - 1];
      if (receipt.previousReceiptId !== previous?.id) {
        errors.push({
          index,
          id,
          code: "INVALID_PREVIOUS_RECEIPT_ID",
          message: `Receipt does not point to the previous receipt ID: ${previous?.id}`,
        });
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors: Object.freeze(errors),
  };
}
