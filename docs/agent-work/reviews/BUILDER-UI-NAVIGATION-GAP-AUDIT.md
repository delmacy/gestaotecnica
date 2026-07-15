# Builder UI Navigation Gap Audit

This report maps the current state of Builder UI client navigation against the System Builder vertical flow map.

## 1. Routes and Navigation Status

| Module | Route | Status |
| :--- | :--- | :--- |
| **Dashboard / Shell** | `/builder` | ✅ Found |
| **Tasker** | `/builder/tasker` | ✅ Found |
| **Capabilities** | `/builder/capabilities` | ✅ Found |
| **Registry** | `/builder/registry` | ✅ Found |
| **Process Mirroring** | `/builder/process-mirroring` | ✅ Found |
| **Docs Viewer** | `/builder/docs` | ✅ Found |
| **UI Contracts Viewer**| `/builder/ui-contracts` | ✅ Found |
| **Governance Matrix** | `/builder/governance-matrix`| ✅ Found |
| **Operator Guide** | `/builder/operator-guide` | ✅ Found |
| **Settings** | `/builder/settings` | ✅ Found |
| **Enterprise Map** | `/builder/enterprise-map` | ✅ Found |
| **Workflow Builder** | `/builder/workflow-builder` | ✅ Found |
| **Form Builder** | `/builder/form-builder` | ✅ Found |
| **View Builder** | `/builder/view-builder` | ✅ Found |

## 2. Follow-Up Candidates (Missing UI & Boundary Data Work)

### 2.1 Workspace Boundary Consistency
- **Gap:** Workspace context (`CURRENT_WORKSPACE`) relies on mock data in `src/components/builder/shell/shell-data.ts`.
- **Candidate:** Hydrate Topbar and Builder context natively from `WorkspaceContextSchema` (`src/platform/contracts/workspace.ts`) dynamically.

### 2.2 Client-Side Builder API Contracts
- **Gap:** According to the vertical flow map, while functions like `builder-publish.client.ts` exist, there is no formal canonical zod schema for client API payloads.
- **Candidate:** Create formal Zod schemas for Builder client/server boundary interactions under `src/platform/contracts/`.

### 2.3 Capability Schema Enforcement
- **Gap:** The `CapabilityItem` type in `src/components/builder/capabilities/capability-types.ts` is UI-centric without a `src/platform/contracts/` canonical definition.
- **Candidate:** Move capability definition contracts to `src/platform/contracts/capability.ts` and refactor UI boundaries.

### 2.4 Missing Global "Entity" Context
- **Gap:** `identitySchema` exists strictly in the DB schema without a platform contract representation.
- **Candidate:** Establish a generic canonical "Entity" or "Identity" context schema in `src/platform/contracts/`.

### 2.5 Timeline UI and Schema Contract
- **Gap:** `TimelineItem` is an interface in `src/platform/observability/application/timeline.service.ts` rather than a canonical platform contract, and no Builder UI surface clearly handles Timeline.
- **Candidate:** Define `TimelineSchema` inside `src/platform/observability/contracts/` and map it to a View/Surface.

### 2.6 Dynamic Active/Future Modules Management
- **Gap:** `ACTIVE_MODULES` and `FUTURE_MODULES` are hardcoded in `src/components/builder/shell/shell-data.ts`.
- **Candidate:** Create a feature flag or capability lookup to dynamically determine sidebar modules status instead of hardcoding.
