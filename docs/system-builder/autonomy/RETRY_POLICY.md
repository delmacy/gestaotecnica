# Retry Policy Documentation

## Objective
This document outlines the standard rules and behavior for system retries, handling identifiers, duplicate prevention, status evidence collection, and recovery after interruptions. This policy applies to all autonomous operations and system-builder tasks to ensure predictable, idempotent, and transparent execution.

## 1. Stable Identifiers Preservation
During any retry operation, all stable identifiers must be strictly preserved.
- **Rule:** A retry must use the exact same identifiers (e.g., Task ID, Session ID, Correlation ID) as the original failed or interrupted attempt.
- **Purpose:** Prevents fragmentation of operational logs and guarantees that retries can be correctly correlated with their original execution context.

## 2. Duplicate Prevention
Duplicate side effects must be explicitly prevented during any operation that is retried.
- **Rule:** Before executing a state-changing operation, systems must verify if the side effect (e.g., creating a PR, writing to a database, dispatching an event) has already occurred.
- **Purpose:** Ensures operations are idempotent. If an action was partially completed before failure, the retry must resume from the known state rather than duplicating the action.

## 3. Status Evidence and Completion Proof
A published request (e.g., dispatching an event, calling an API endpoint) is strictly insufficient to declare an operation complete.
- **Rule:** A published request is not treated as proof of completion. Completion can only be declared when explicit, verifiable evidence (a receipt, a success response, or artifact) is observed.
- **Purpose:** Aligns with the Operational Evidence Ledger contract to prevent hallucinated successes based on mere intent or dispatch.

## 4. Handling Unknown States
When a system recovers from an interruption or failure, it may not immediately know the outcome of the previous operation.
- **Rule:** Unknown state is recorded without guessing. If the status of a previous operation cannot be verified, it must be explicitly recorded as `UNKNOWN`.
- **Purpose:** Prevents incorrect assumptions (e.g., inferring failure or success without evidence). The system must require explicit verification rather than making assumptions.

## 5. Recovery After Interruption
When recovering from an unexpected halt, crash, or timeout:
1. Verify the current actual state by querying external systems or ledgers using the preserved stable identifiers.
2. If the status cannot be explicitly determined, log the state as `UNKNOWN` and request human intervention or fallback to a safe state if explicitly supported.
3. Resume execution only if idempotent actions ensure no duplicate side effects will occur.

## 6. Simulated Example

*(Note: The following scenario is a simulated example to demonstrate the retry policy in action.)*

**Scenario:** A deployment action is interrupted by a network timeout.
1. **Attempt 1:**
   - **Task ID:** `TASK-SIMULATED-999`
   - **Action:** Create PR
   - **Result:** Network timeout. Status is `UNKNOWN` (recorded without guessing).
2. **Recovery & Retry:**
   - The system wakes up and begins a retry for `TASK-SIMULATED-999` (Preserving Identifier).
   - The system checks if the PR was actually created despite the timeout (Duplicate Prevention).
   - The system finds the PR was created. It does *not* create a second PR.
   - The system awaits explicit evidence (like a merge receipt) before declaring success. The initial dispatch of the PR creation API call is not treated as completion.
