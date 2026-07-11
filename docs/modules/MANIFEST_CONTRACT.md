# Manifest Contract

This document outlines the strict module manifest contract utilized by the platform, detailing the structural requirements, validation processes, and current limitations.

## Source of Truth

The canonical schemas and validation envelopes for the Module Manifest are defined in:
- `src/platform/modules/module-manifest.ts`

## Strict Module Manifest Schema (`StrictModuleManifestSchema`)

The `StrictModuleManifestSchema` enforces the core structure and types for a valid manifest:

### Required Fields
- **id**: A non-empty string. (Error messages: `MISSING_MANIFEST_ID`, `EMPTY_MANIFEST_ID`).
- **name**: A non-empty string. (Error message: `MISSING_MANIFEST_NAME`).
- **key**: A unique string identifier for the module.
- **version**: A valid semantic version string compliant with `SchemaVersionSchema`. (Error message: `MISSING_MANIFEST_VERSION` or schema version parse errors).
- **capabilities**: An array of strictly valid UUID strings (`UUIDSchema`). (Error message: `MISSING_MANIFEST_CAPABILITIES`).
- **lifecycleMetadata**: A valid key-value record (`UnknownRecordSchema`). (Error message: `MISSING_LIFECYCLE_METADATA` or record parse errors).

### Optional Fields
- **description**: An optional string describing the module.
- **actions**: An optional array of unique strings representing module actions.
- **events**: An optional array of unique strings representing module events.
- **views**: An optional array of unique strings representing module views.
- **dependencies**: An optional array of unique strings representing module dependencies.
- **lifecycleStatus**: An optional value adhering to `ModuleLifecycleStatusSchema` (e.g., "draft", "active", "deprecated", "retired" or generic string).

## Validation Result Envelope (`ManifestValidationResultEnvelopeSchema`)

All manifest parsing and validation operations return a discriminated union (`ManifestValidationResult`) indicating strict success or failure, avoiding arbitrary exceptions.

- **Success (`ok: true`)**:
  - `ok`: `true`
  - `data`: A fully validated and typed `StrictModuleManifest`.

- **Failure (`ok: false`)**:
  - `ok`: `false`
  - `error`: An object containing:
    - `code`: The error code (e.g., standard Zod issue codes or custom codes like `MISSING_MANIFEST_ID`).
    - `message`: The descriptive error message.
    - `path`: (Optional) An array of strings representing the path to the error.

## Gate D Integration

This contract aligns with the conceptual Gate D (Persistence/Validation Gate) validations, providing the necessary static guarantees for module boundaries before any operational or persistence operations. **Note:** Validation via this contract does not imply or claim install readiness; it only verifies structural contract adherence.

## Current Non-Goals

- Providing installation or deployment readiness assertions.
- Orchestrating cross-module dependency resolution dynamically.
- Managing version compatibility matrices dynamically (these are verified via `manifest-compatibility.ts`).
- Implementing dynamic validation logic that relies on runtime database states.
