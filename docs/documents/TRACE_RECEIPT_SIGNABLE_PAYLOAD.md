# Trace Receipt Signable Payload

## Overview

The `signable-payload` module provides functions to create a deterministic payload for a `TraceReceipt`. This payload is specifically designed to be used when calculating the receipt's own hash (self-hash) or for digital signatures, by ensuring that the `hashes` field is excluded to avoid self-reference issues.

## Identification

* Module: `document-traceability`
* Role: `domain_worker`
* Status: `canonical`

## Public Functions

### `createSignableTraceReceiptPayload`

Creates a record containing all `TraceReceipt` fields except for the top-level `hashes` array.

```ts
function createSignableTraceReceiptPayload(
  receipt: TraceReceipt
): Record<string, unknown>
```

**Rules:**
1. Validates the input against `TraceReceiptSchema`.
2. Removes only the top-level `hashes` field.
3. Preserves `hashes` fields if they appear nested within `metadata`, `source.metadata`, or `artifacts[].metadata`.
4. Does not mutate the original object.

### `canonicalizeSignableTraceReceipt`

Generates a deterministic string representation of the signable payload.

```ts
function canonicalizeSignableTraceReceipt(
  receipt: TraceReceipt
): string
```

### `createTraceReceiptSelfHash`

Calculates the cryptographic hash of the signable payload.

```ts
function createTraceReceiptSelfHash(
  receipt: TraceReceipt,
  algorithm: "sha256" | "sha512"
): TraceReceiptHash
```

**Scope:** The resulting hash always has the scope `receipt`.

## Usage Example

```ts
import {
  createTraceReceiptSelfHash,
  TraceReceipt
} from "@platform/documents/traceability";

const receipt: TraceReceipt = { ... };
const selfHash = createTraceReceiptSelfHash(receipt, "sha256");

// Now you can add the self-hash to the receipt's hashes array
receipt.hashes.push(selfHash);
```

## Constraints

- Pure functions only.
- No side effects.
- Strict validation of input types.
- Deterministic output.
