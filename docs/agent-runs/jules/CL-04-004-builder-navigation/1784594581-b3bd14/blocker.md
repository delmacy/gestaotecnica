# Blocker: Missing Persistence Read Path for Launch Surfaces

**Task:** CL-04-004-builder-navigation

## Issue Summary
The current task requires connecting the Builder Shell navigation (`ACTIVE_MODULES` in `shell-data.ts`) to "real persisted launch surfaces". The constraint dictates this implementation must stay inside the allowed files (`src/app/**`, `src/components/**`, `tests/**`).

## Evidence
1. **Static Data**: The navigation currently relies completely on hardcoded arrays (`ACTIVE_MODULES` and `FUTURE_MODULES`) in `src/components/builder/shell/shell-data.ts`.
2. **Missing Source**: A scan of the allowed `src/app/`, `src/components/`, and related `src/platform/` directories reveals no existing API endpoints, context providers, or database query ports specifically tailored to fetching/persisting these Builder-specific launch surfaces (e.g. `governance-matrix`, `operator-guide`, `enterprise-map`). The closest mechanism found was `resolveWorkspaceContext()` which loads `workspaceModuleConfigs`, but it does not represent the Builder Shell launch surfaces in question.
3. **Constraint Conflict**: The OpenCode Governor explicitly rejected a static implementation and demanded a persistence-backed read path. However, building the necessary backend persistence adapters, queries, and APIs requires editing schemas and platform-level infrastructure files outside the `src/app/**` and `src/components/**` allowed scope.

## Recommended Action
To fulfill this task without violating constraints, the required data layer logic (fetching persisted builder launch surfaces) must first be implemented upstream in the core backend platform. Until such a data source is available to be consumed in `shell-data.ts` or a related context, this task remains blocked.