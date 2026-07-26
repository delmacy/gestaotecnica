# Builder to Runtime Handoff Contract

This document acts as the master contract clarifying the route contract, data contract, role/scope rules, states, and acceptance gates for the Builder to Runtime Handoff within the navigation and execution areas of the System Builder platform.

## Overview
The System Builder platform allows authorized users to configure operational and process parameters in the "Builder" environment, and seamlessly deploy or transition those configurations to the "Runtime" environment where end-users interact with them. This contract defines how this handoff is executed from a user journey, data integrity, and route resolution perspective.

## Navigation Experience
1. **Where the user came from**:
    - Users typically originate from the Builder environment (`/builder/deploy` or `/builder/processes/[id]/deploy`). They have finished configuring an operational process or application.
2. **What they do here**:
    - The user triggers a "Deploy to Runtime" or "Launch in Runtime" action. The system packages the builder configurations, validates them against the target runtime schema, and issues a handoff token or session payload.
    - If successful, the user sees a confirmation that the configurations are live.
3. **Where they go next**:
    - Upon successful handoff, the user can optionally click "View in Runtime" to be seamlessly routed to the newly deployed runtime application URL (e.g., `/runtime/app/[appId]`).
4. **How they return**:
    - In the Runtime view, a persistent "Return to Builder" or "Edit Configuration" action (often in a management toolbar if the user has dual privileges) allows routing back to the original Builder configuration screen for that specific artifact.

## Data and Route Contract
The handoff relies on a strict data contract mapping Builder schemas to Runtime schemas.
- Route: `POST /api/builder/handoff`
- Input: `{ "appId": string, "version": string, "environmentId": string }`
- Output: `{ "success": boolean, "runtimeUrl": string, "handoffToken": string }`

### State Rules
- **Empty State**: If an application has no viable versions deployed, the Builder to Runtime Handoff cannot be initiated, and the Launch button is disabled. A message indicating "No configurations to deploy" is shown.
- **Blocked State**: If the user lacks runtime deployment privileges, the handoff action is entirely disabled. The UI renders this distinctively as "Pro Feature" or "Restricted" with an opacity of 50%.
- **Demo State**: In demo environments, the handoff mimics a real deployment but provisions an ephemeral sandbox runtime instance instead of a production one. The UI displays "Deploy to Demo Runtime".
- **Synthetic Data State**: Synthetically generated applications in the Builder, when handed off, target a distinct "Synthetic Runtime" and are badged to avoid confusion with live data operations.
- **Real-Data State**: Real configurations hand off to live production runtime servers and explicitly confirm the commercial impact (e.g., "Deploying to Production Network").

## Role/Scope rules
- `builder_admin`: Has full privileges to execute the Builder to Runtime handoff.
- `builder_member`: Cannot execute the handoff to production runtime but may be able to handoff to staging/demo runtimes depending on granular settings.
- `runtime_user`: Has no builder access and cannot initiate the handoff; only consumes the runtime artifact.

## Acceptance Gates
Before a handoff is considered valid and the user can proceed to the Runtime environment, the following gates must be passed:
1. **Configuration Validation Gate**: The Builder artifact must pass all schema validation checks (no broken references or incomplete mandatory fields).
2. **Permission Verification Gate**: The user must hold explicit rights (e.g., `builder_admin` or specific scoped deployment rights) for the target environment.
3. **State Consistency Gate**: The Builder application state must be saved and committed (no unsaved drafts).
