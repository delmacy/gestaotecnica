# Review Report - PKG-TRACE-RECEIPT-SIGNABLE-PAYLOAD-001

## Package Information

* ID: `PKG-TRACE-RECEIPT-SIGNABLE-PAYLOAD-001`
* Module: `document-traceability`
* Type: reduced pure-function package

## Objective

Create the deterministic payload used in the self-hash of a Trace Receipt, avoiding self-reference by removing the first-level `hashes` field.

## Implementation Details

The following functions were implemented in `src/platform/documents/traceability/signable-payload.ts`:

1. `createSignableTraceReceiptPayload`: Validates the receipt and returns a new object without the top-level `hashes` field.
2. `canonicalizeSignableTraceReceipt`: Uses `canonicalizeTraceValue` on the signable payload.
3. `createTraceReceiptSelfHash`: Uses `createTraceHash` on the signable payload with the `receipt` scope.

## Verification Results

### Tests

Tests were implemented in `tests/unit/trace-receipt-signable-payload.test.ts` covering:
- [x] Minimal valid receipt
- [x] Full valid receipt
- [x] Top-level `hashes` removal
- [x] Nested `hashes` preservation (metadata, source, artifacts)
- [x] Field preservation (`previousReceiptId`, `correlationId`, `causationId`, `artifacts`)
- [x] Optional fields handling
- [x] Invalid receipt rejection (with `@ts-expect-error`)
- [x] Unknown fields rejection (with `@ts-expect-error`)
- [x] Deep immutability and deep-frozen input support
- [x] Deterministic canonicalization
- [x] Key order independence (without `@ts-expect-error`)
- [x] Scope verification (`receipt`)
- [x] Hash algorithm support (SHA-256, SHA-512)
- [x] Explicit reference behavior verification (`assert.notStrictEqual`)

### Build

- [x] `npm run build` completed successfully.

## Compliance

- [x] No digital signatures implemented.
- [x] No HMAC implemented.
- [x] No linking or receipt chain implemented.
- [x] No persistence, events, storage, API, or UI.
- [x] No `any` or `as any` used in production code or tests.
- [x] No `delete` on original object.
- [x] No `JSON.parse(JSON.stringify(...))` for cloning in production code or tests.
- [x] No direct `crypto` usage (used `hashing.ts` instead).
- [x] No `Date.now` or `randomUUID`.

## Conclusion

The implementation follows all requirements and constraints. The functions are pure, deterministic, and correctly handle the exclusion of the top-level `hashes` field. The test suite has been strengthened to ensure deep immutability and correct reference behavior without relying on placeholder tests or weak cloning methods.

Behavior summary:
- new top-level payload object;
- top-level hashes omitted;
- input graph is never mutated;
- deep cloning is not guaranteed or required.
