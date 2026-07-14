# Blueprint Packaging

## Overview
This document outlines the contracts, contents, compatibility checks, and redaction mechanisms for Blueprint Packages in the platform.

## Package Contents
The blueprint package is structurally defined by the `BlueprintPackageManifestSchema` (located in `src/platform/blueprints/contracts/blueprint-package-manifest.ts`). The manifest declares explicit sections for:
- **`packageId` & `version`**: The core identifiers of the package.
- **`dependencies`**: Explicitly versioned dependencies (typed with `BlueprintDependencySchema`).
- **Configuration Sections**: Arrays of references to exported configurations:
  - `capabilities`
  - `forms`
  - `views`
  - `workflows`
  - `policies`
- **`seedMetadata`**: A generic key-value structure for initial data required by the structural templates.

## Compatibility
Before a blueprint package is installed, a preflight compatibility check is executed. The result is returned via the `BlueprintCompatibilityCheckResultEnvelopeSchema` (located in `src/platform/blueprints/contracts/blueprint-compatibility-check-result-envelope.ts`). This envelope strictly defines:
- **`compatible`**: A boolean flag determining if the package is safe to install.
- **`warnings`**: An array of string warnings detected during preflight.
- **`blockers`**: An array of strict string violations that block the installation.

## Redaction
Blueprint packages are validated to ensure they do not contain secrets or runtime customer data. The `BlueprintPackageManifestSchema` recursively checks for sensitive keys (e.g., `password`, `secret`, `token`, etc.) using a helper. If any forbidden field is detected, it applies a `FORBIDDEN_SECRET_FIELD` custom Zod issue code via `.superRefine()`, rejecting the package.

## Channels
The **`platform-blueprints-channels`** module acts as the secure boundary for blueprint ingestion and extraction. It supports:
- **Secure Import/Export**: Endpoints for importing and exporting `BlueprintPackageManifest` payloads securely.
- **Checksum**: All import requests must include a strictly formatted SHA-256 string checksum (`/^sha256-[a-f0-9]{64}$/`) to verify package integrity.
- **Dry-run**: Import requests support a `dryRun` boolean flag (defaulting to safe/true) to simulate compatibility checks without side effects.
- **Redaction**: Export requests can specify redaction options to strip sensitive fields before returning the payload, ensuring runtime customer data or secrets are never exposed.

## Non-Goals
- **Import Execution**: The actual execution or hydration of importing blueprint packages into the runtime system or database is strictly considered future work.
