# PKG-EVENT-TYPES-MAPPERS-001 POST-MERGE REVIEW

## Information
- **Package ID**: PKG-EVENT-TYPES-MAPPERS-001
- **PR Original**: #174
- **PR Review**: #178
- **Module**: events-receipts
- **Decision**: APPROVE_POST_MERGE_WITH_NOTES

## Summary of Corrections
This correction PR addresses the residual issues from the independent review of event types and mappers.

### 1. Removal of "any" from Tests
- All occurrences of `as any` and `(err: any)` in `tests/unit/event-mappers.test.ts` have been removed.
- Replaced with safe types: `unknown`, `EventMapperInput`, and explicit error checks.
- Invalid inputs for testing purposes are now typed as `unknown` before being cast to the target type for the mapper call, ensuring real validation is tested without compromising type safety in the test suite.

### 2. Immutability and Shallow Copy
- **Correction**: The tests and documentation have been updated to accurately reflect the implementation behavior.
- **Implementation**: The mapper uses shallow copy (`{ ...payload }`) for `payload` and `metadata`.
- **Verified Behavior**:
    - The mapper does NOT mutate the input object.
    - The output payload is a NEW reference at the first level.
    - **Limitation**: Nested objects/references within the payload are shared between input and output.
- **Decision**: Deep cloning was not implemented as it requires a formal architectural decision and could have performance implications. This is recorded as a known risk/limitation.

### 3. Timestamp Validation (ISODateTimeSchema)
- **Verified Behavior**: The `ISODateTimeSchema` (from platform contracts) is strictly UTC-only.
- **Accepted**: "2023-10-27T10:00:00Z" (UTC with 'Z' designator).
- **Rejected**:
    - Offsets like "+00:00" or "-03:00".
    - Timestamps without timezone ("2023-10-27T10:00:00").
    - Date-only strings ("2023-10-27").
- **Audit**: Added explicit audit tests to ensure these constraints are enforced and documented.

### 4. Audit Evidence
- Created `tests/unit/event-mappers-audit.test.ts` to automate the verification of:
    - Determinism.
    - Non-mutation of input.
    - Preservation of `workspaceId`, `correlationId`, and `causationId`.
    - Rejection of invalid `schemaVersion` (major.minor.patch).
    - Rejection of non-Z timestamps.
    - Absence of workspace fallbacks.

## Risks & Known Limitations
- **Shallow Copy**: Nested references in the payload remain shared. While the mapper itself is non-mutating, downstream consumers modifying nested properties of the payload would affect other references if they exist.
- **Strict UTC**: The platform strictly requires the 'Z' designator. External systems providing offsets will fail validation unless normalized before reaching the mapper.

## Final Conclusion
The implementation is solid, deterministic, and strictly follows the canonical envelope contract. The removal of `any` improves the health of the test suite. The decision is to approve with notes regarding the shallow copy limitation.
