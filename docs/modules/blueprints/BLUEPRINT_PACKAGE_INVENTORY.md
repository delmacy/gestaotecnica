# Blueprint Package Inventory

## Context
This document inventories the current blueprint/module package concepts found in the repository and formally names the canonical package boundary for blueprints.

## Current Concepts Found
Through repository exploration, blueprints are currently utilized mainly as:
1. **Mocked/Synthetic Data for the Builder UI:** Found extensively in `src/components/builder/form-builder/`, `view-builder`, and `workflow-builder`. They are used for visual design mockups and frontend validation without underlying database persistence (`MOCK_FORM_BUILDER_DATA`, etc.).
2. **Platform vs Runtime references:** Found in `docs/system-builder/validation/` and db concepts, where `blueprints` map to the Platform client (governed by System Builder), defining templates for runtime usage.
3. **Workflow Definitions:** Found in `docs/workflows/PROCESS_DEFINITION_SCHEMA.md` as `blueprintKey` and `blueprintVersion` fields, representing the origin template for an active runtime workflow process.
4. **Governance Blueprints:** Mentioned in governance and view builder contracts (e.g., `ViewBlueprint`, `FormBlueprint`), representing structural configuration templates.

## Canonical Package Boundary
Based on the principle that the System Builder governs and versions configurations while Runtime executes them, the canonical package boundary for blueprints is:

**`platform-blueprints`**

### Rationale
- Blueprints are structural definitions, templates, and configurations governed by the System Builder (Platform domain).
- They sit on the Platform side of the architecture (in `src/platform/blueprints/` conceptually or physically), completely isolated from `runtime-engine` execution records, but providing the metadata and schemas that the runtime consumes.

## Channel Concepts
Existing channel concepts across the platform include:
1. **Notifications Channel:** Defined in `src/platform/notifications/contracts/channels.ts`, focusing on delivery channels (in_app, email, sms, push, webhook).
2. **Support Requests:** Mentioned in requests/communication documentation (RequestChannel).
3. **Data Exports/Imports:** Mentioned in CSV/JSON data export references.

The canonical boundary for blueprint import/export channels is:

**`platform-blueprints-channels`**

This boundary defines the valid mechanisms through which a `BlueprintPackageManifest` can enter or leave the system.
