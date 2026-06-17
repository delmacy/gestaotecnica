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
 * Drops property accessors (getters/setters) from an object to prevent execution of hostile code.
 * Only returns properties that have a simple value.
 */
function dropAccessors(val: unknown): unknown {
  if (val === null || typeof val !== "object" || Array.isArray(val)) {
    return val;
  }
  const descriptors = Object.getOwnPropertyDescriptors(val);
  const plain: Record<string, unknown> = {};
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (descriptor.get === undefined && descriptor.set === undefined && "value" in descriptor) {
      plain[key] = descriptor.value;
    }
  }
  return plain;
}

/**
 * Finds the self-hash of a Trace Receipt.
 * A self-hash is a hash with 'receipt' scope.
 * Returns the hash only if exactly one exists.
 *
 * Note: This helper expects a valid TraceReceipt. It does not perform structural validation.
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
  // 1. Validate the receipt structure using safeParse on a sanitized input
  const safeInput = dropAccessors(receipt);
  const parsed = TraceReceiptSchema.safeParse(safeInput);
  if (!parsed.success) {
    return false;
  }

  const validated = parsed.data;

  // 2. Require exactly one receipt hash
  const receiptHashes = validated.hashes.filter((h) => h.scope === "receipt");
  if (receiptHashes.length !== 1) {
    return false;
  }

  const selfHash = receiptHashes[0];

  // 3. Recalculate and verify
  const payload = createSignableTraceReceiptPayload(validated);
  return verifyTraceHash(payload, selfHash);
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
  const parsedReceipts: Array<TraceReceipt | undefined> = [];

  receipts.forEach((rawReceipt, index) => {
    // 1. Structural Validation
    // We drop accessors to avoid executing hostile getters during validation
    const safeInput = dropAccessors(rawReceipt);
    const parsed = TraceReceiptSchema.safeParse(safeInput);

    if (!parsed.success) {
      errors.push({
        index,
        id: `unknown-${index}`,
        code: "INVALID_RECEIPT",
        message: "Receipt is structurally invalid",
      });
      parsedReceipts.push(undefined);
      return; // Do not access rawReceipt again
    }

    const receipt = parsed.data;
    const { id } = receipt;
    parsedReceipts.push(receipt);

    // 2. Self-Hash Integrity
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

    // 3. Uniqueness
    if (seenIds.has(id)) {
      errors.push({
        index,
        id,
        code: "DUPLICATE_RECEIPT_ID",
        message: `Duplicate receipt ID: ${id}`,
      });
    }
    seenIds.add(id);

    // 4. Chain Linking
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
      const previous = parsedReceipts[index - 1];
      if (!previous) {
        // If the previous raw item was invalid, do not access it.
        // Record a structured link error because a valid immediate predecessor is unavailable.
        errors.push({
          index,
          id,
          code: "INVALID_PREVIOUS_RECEIPT_ID",
          message: "A valid immediate predecessor is unavailable",
        });
      } else if (receipt.previousReceiptId !== previous.id) {
        errors.push({
          index,
          id,
          code: "INVALID_PREVIOUS_RECEIPT_ID",
          message: `Receipt does not point to the previous receipt ID: ${previous.id}`,
        });
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors: Object.freeze(errors),
  };
}
