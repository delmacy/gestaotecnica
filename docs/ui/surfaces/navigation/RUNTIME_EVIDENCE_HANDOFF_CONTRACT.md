# Runtime to Evidence Handoff Contract

This document acts as the master contract clarifying the route contract, data contract, role/scope rules, states, and acceptance gates for the Runtime to Evidence Handoff within the navigation and execution areas of the System Builder platform.

## Overview
The System Builder platform allows end-users to execute operational processes in the "Runtime" environment. Upon completion or key milestones, these executions must be securely logged as "Evidence" to prove compliance, track gaps, and mirror real-world processes. This contract defines how this handoff from an active runtime session to an immutable evidence vault is executed from a user journey, data integrity, and route resolution perspective.

## Navigation Experience
1. **Where the user came from**:
    - Users typically originate from the Runtime environment (e.g., `/runtime/processes/[id]/execute` or an active task view). They have just finished executing an operational step, filling out a form, or completing a process that requires a secure audit trail.
2. **What they do here**:
    - The user triggers a "Submit to Record," "Log Evidence," or "Complete Process" action. The system securely packages the runtime execution context (including user inputs, metadata, and timestamps), validates it, and issues a handoff to the Evidence module.
    - If successful, the user is presented with a clear commercial confirmation (e.g., "Record Securely Logged" or "Evidence Captured").
3. **Where they go next**:
    - Upon successful handoff, the user is either routed automatically to their next queued task or provided an option to view their "Evidence Receipt" (e.g., `/runtime/evidence/[evidenceId]/receipt`).
4. **How they return**:
    - From the Evidence Receipt view, a primary "Return to Dashboard" or "Next Task" action allows seamless routing back to the user's active workspace or task queue in the Runtime environment.

## Data and Route Contract
The handoff relies on a strict data contract mapping the runtime execution context into an immutable evidence schema.
- Route: `POST /api/runtime/evidence/handoff`
- Input: `{ "processId": string, "executionPayload": Record<string, unknown>, "timestamp": string }`
- Output: `{ "success": boolean, "evidenceId": string, "receiptUrl": string }`

### State Rules
- **Empty State**: If a runtime task requires mandatory inputs but none have been provided, the handoff cannot be initiated. The submission action is disabled, and a message indicating "Required information missing" is shown.
- **Blocked State**: If the user's session has expired or they lack the authority to log evidence for the specific process, the handoff action is visually locked. The UI renders this distinctively as "Submission Restricted" with a clear reason.
- **Demo State**: In demo environments, the handoff process mimics real evidence logging but routes the payload to an ephemeral sandbox vault. The UI displays "Logged to Demo Vault" to ensure users know this is not a permanent record.
- **Synthetic Data State**: Synthetically generated runtime executions hand off to a dedicated "Synthetic Evidence" partition. The confirmation clearly badges the record as "Synthetic Record" to prevent confusion during actual audits.
- **Real-Data State**: Real execution records hand off to the live, immutable production vault. The system explicitly confirms the binding nature of the action (e.g., "Official Record Captured").

## Role/Scope rules
- `runtime_user`: Can initiate the handoff for processes they are assigned to and view their own receipts.
- `auditor` / `manager`: Has privileges to view the aggregated evidence vault but generally does not initiate the runtime handoff themselves.
- `builder_admin`: Has system-level visibility but is typically restricted from altering the immutable evidence once handed off by a runtime user.

## Acceptance Gates
Before a handoff is considered valid and the user receives a confirmation receipt, the following gates must be passed:
1. **Completeness Gate**: The runtime payload must contain all mandatory fields and signatures required by the configured process schema.
2. **Authorization Gate**: The user must have active credentials and explicit rights to execute and log the target process.
3. **Immutability Gate**: The system must successfully persist the payload into the immutable evidence vault and generate a unique tracking ID before responding with a success state.
