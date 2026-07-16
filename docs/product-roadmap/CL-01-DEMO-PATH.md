# CL-01 Demo Path

This document defines the exact first-sale demo path from login to executed workflow for the Alpha launch (CL-01).

## Scope & Personas
- Driven by personas defined in `CL-01-launch-scope.md`.
- Target: Workflow Architect and System Administrator.

## Demo Reset / Reseed Note
**Blocker/Fallback:** The demo reset/reseed functionality is not yet implemented.
**Demo Note:** Between demos, the tenant environment state is currently persistent. To reset, an Administrator must manually clear runtime records via the database or start from a fresh tenant.

## Step 1: Login and Workspace Access
- **Action:** User logs in as Workflow Architect.
- **Surface/Route:** `/auth/login` -> `/workspace`
- **Data State:** Authenticated user session established; tenant isolated workspace loaded.
- **Evidence Produced:** Successful redirect to Builder Shell.
- **Status:** Demo-ready.

## Step 2: Capability Selection
- **Action:** Workflow Architect selects required capabilities for a new workflow.
- **Surface/Route:** `/builder/capabilities` (within Builder Shell)
- **Data State:** Selected `CapabilityItem` metadata loaded into memory.
- **Evidence Produced:** Capabilities appear in the Builder configuration pane.
- **Status:** Demo-ready.

## Step 3: Builder and Publish Workflow
- **Action:** Workflow Architect designs the process graph and clicks Publish.
- **Surface/Route:** `/builder/canvas` -> Publish Action
- **Data State:** `ProcessDefinitionSchema` validated and persisted to platform storage.
- **Evidence Produced:** System returns a success message; workflow definition is marked as published.
- **Status:** Demo-ready.

## Step 4: Workflow Execution
- **Action:** User manually triggers the published workflow.
- **Surface/Route:** `/work/inbox` or relevant launcher surface.
- **Data State:** `ProcessInstanceSchema` instantiated and active in runtime storage.
- **Evidence Produced:** Process transitions to 'in_progress'.
- **Status:** Demo-ready.

## Step 5: Evidence Review (Observability)
- **Action:** System Administrator views the execution timeline.
- **Surface/Route:** `/observability/timeline`
- **Data State:** `TimelineItem` records retrieved and rendered for the active instance.
- **Evidence Produced:** Audit timeline displays executed steps and state transitions.
- **Status:** Demo-ready.
