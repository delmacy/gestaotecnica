# View Builder & Workspace Navigation Gap Audit

## Context & Scope
Audit the Builder UI client/workspace navigation and view-builder surfaces against the vertical flow map (`docs/system-builder/planning/VERTICAL_MAP.md`), identifying missing screens, links, and data boundaries.

The Vertical Map defines the following flow entities:
`Client -> Workspace -> Capability -> Entity -> Form -> Process -> Publication -> Execution -> Timeline`

## 1. Builder UI / Workspace Navigation Gaps

### Current State
Navigation is managed by `src/components/builder/shell/shell-data.ts` and structural components in `src/components/builder/shell/`.

### Identified Gaps vs Vertical Map
- **Workspace Data Boundary:** `BuilderShell` uses a synthetic workspace (`CURRENT_WORKSPACE`) and does not integrate the canonical `WorkspaceContextSchema` (`src/platform/contracts/workspace.ts`).
- **Entity & Timeline Screens:** There are no active or planned navigation routes in the Builder Shell for managing generic "Entities" (Identity/RBAC models) or viewing an operational "Timeline", which are key steps in the vertical map.
- **Publication State Representation:** There is no distinct screen or shell state showing "Publishing" or cross-module "Publication Status" (Draft vs. Published) at the workspace level, despite the existence of `PublicationResultEnvelopeSchema` (in `src/platform/workflows/contracts/process-definition.ts`).

### Follow-up Candidates (Navigation)
- **C1:** Create an `Entity Management` mock route to align with the Identity schema.
- **C2:** Create a `Timeline / Observability` route placeholder in the shell.
- **C3:** Update `shell-data.ts` to transition from static mock workspaces to consuming a context provider implementing `WorkspaceContextSchema`.

## 2. View Builder Surface Gaps

### Current State
View Builder MVP exists in `src/app/(builder)/builder/view-builder/` with components in `src/components/builder/view-builder/`. It is currently marked as "coming_soon" in the shell navigation.

### Identified Gaps vs Vertical Map
- **Missing Navigation Link:** View Builder is listed in `FUTURE_MODULES` (`href: "#"`) in `shell-data.ts`. It is disconnected from the workspace client flow despite the page existing.
- **Capability / Form / Process Data Boundaries:** The `ViewBindingsPanel.tsx` uses purely synthetic bindings. There is no schema or boundary translation that converts a `CapabilityItem` (`src/components/builder/capabilities/capability-types.ts`), `FormDefinitionSchema` (`src/platform/forms/contracts/form-definition.ts`), or `ProcessDefinitionSchema` (`src/platform/workflows/contracts/process-definition.ts`) into the internal structures required by the View Builder. The visual binding claims connection, but the data boundary is broken/unimplemented.
- **Missing Persistence Contract:** Unlike Forms (`FormDefinitionSchema`) and Processes (`ProcessDefinitionSchema`), there is no canonical `ViewDefinitionSchema` in `src/platform/contracts/` (or `src/platform/views/contracts/`). The View Builder operates entirely in memory on `ViewBlueprint` mocks.
- **Missing Application Composer Screen:** The vertical map implies a flow from Form/Process -> Execution. Views are built in isolation; there is no "App Composer" screen to group these views into a cohesive end-user capability or workspace portal.

### Follow-up Candidates (View Builder)
- **C4:** Move `View Builder` from `FUTURE_MODULES` to `ACTIVE_MODULES` (with path `/builder/view-builder`) in `shell-data.ts`.
- **C5:** Create `src/platform/contracts/views/view-definition.ts` to establish the canonical schema for persisting Views.
- **C6:** Implement a translation layer/helper that maps `FormDefinitionSchema` fields into injectable structures for real data binding in Views.
- **C7:** Design and scaffold an "App/Portal Composer" screen to assemble multiple views.

## Acceptance Check
- [x] Audit references concrete routes/components (`shell-data.ts`, `ViewBindingsPanel.tsx`, `src/platform/contracts/`).
- [x] Missing UI work is split into small follow-up candidates (C1-C7).
- [x] No code changes (audit document only).
