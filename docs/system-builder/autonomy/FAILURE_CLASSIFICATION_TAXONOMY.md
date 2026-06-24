# Failure Classification Taxonomy

## Objective
Establish consistent criteria for classifying operational outcomes, ensuring that failures, scope mismatches, and superseded work are handled correctly. This taxonomy defines explicit states for `DISQUALIFIED`, `OUT_OF_SCOPE`, `ARCHIVED`, retryable failures, corrective actions, and new-task creation.

## 1. Core Principles
- **Evidence-Based Classification:** Classification must be based entirely on recorded evidence in the Operational Evidence Ledger, never on assumptions or missing data.
- **Idempotency in Recovery:** All retry rules must preserve idempotency and avoid duplicate effects.
- **Strict Archival:** `ARCHIVED` must never be used as a synonym for a technical failure.
- **No Retroactive Reclassification:** No real historical Pull Requests or tasks shall be retroactively classified by this document.

## 2. Classification Definitions and Consequences

### `DISQUALIFIED`
- **Definition:** The task or operation fundamentally violates architectural rules, governance policies, or core contracts, making its current approach invalid.
- **Distinction:** This is a conceptual or compliance failure, not a transient technical glitch.
- **Consequence:** The task must not be retried in its current form. It requires a fundamental redesign or corrective action before any new attempt.

### `OUT_OF_SCOPE`
- **Definition:** The requested work or observed behavior expands beyond the defined boundaries of the current task, sprint, or component.
- **Distinction:** Identifies a scope expansion or mismatch rather than a defect in the system.
- **Consequence:** The out-of-scope elements must be stripped from the current operation. If the work is still necessary, a new task must be created to address it.

### `ARCHIVED`
- **Definition:** Work that is obsolete, superseded by newer implementations, or intentionally retired.
- **Distinction:** `ARCHIVED` is strictly for obsolescence, not for work that failed to execute due to technical or logical errors.
- **Consequence:** The work is preserved for historical reference but is removed from active execution paths. No retry is permitted.

### Retryable Failure
- **Definition:** A failure caused by transient issues (e.g., network timeouts, temporary unavailabilities, or race conditions) where the underlying logic remains valid.
- **Consequence:** The operation may be retried. The retry *must* preserve the exact same identifiers (Task ID, Session ID, Correlation ID) to maintain idempotency and avoid duplicate effects.

### Corrective Action
- **Definition:** An intervention required when an operation fails due to a logical error, missing dependencies, or incorrect configuration that can be fixed within the same conceptual scope.
- **Consequence:** The task remains active, but code or configuration must be amended. Subsequent attempts keep the same identifiers if they represent the same logical task, but verifiable validation must be performed before the next attempt.

### New-Task Creation
- **Definition:** When an issue requires significant architectural changes, fundamentally alters the original scope, or is discovered while addressing a different concern (`OUT_OF_SCOPE`).
- **Consequence:** The original task is closed or narrowed, and a distinct new task (with a new Task ID) is created to track the separate logical unit of work.

## 3. Identifiers and Retry Strategy

- **When to Preserve Identifiers:** Retries for transient failures or minor corrective actions within the exact same scope must reuse the original Task ID, Session ID, and Correlation ID. This ensures tracking continuity and prevents duplicate side-effects (e.g., creating multiple PRs for the same issue).
- **When a New Task is Required:** A new Task ID is required if the original task is classified as `DISQUALIFIED` (and needs a total rewrite), or if the failure resolution expands the original intent (`OUT_OF_SCOPE`).

## 4. Decision Table: Closed Unmerged PRs and Interrupted Sessions

| Scenario | Evidence Observation | Classification | Required Action | Identifier Handling |
| :--- | :--- | :--- | :--- | :--- |
| Network timeout during script execution | Log shows `ECONNRESET` or timeout exception | Retryable Failure | Retry the execution | Preserve all original identifiers |
| PR closed because feature is no longer needed | PR comments/ledger indicate shifting business priority | ARCHIVED | Halt work, close task if fully superseded | N/A (End of lifecycle) |
| PR introduces major breaking changes to unrelated module | Validation tools flag architectural violation | DISQUALIFIED | Revert changes, rethink approach | Use same ID for correction, or New ID if scope is entirely changed |
| PR closed due to scope creep | Review notes state changes belong in a separate epic | OUT_OF_SCOPE | Remove out-of-scope commits | Create a New Task ID for the removed work |
| Session crashes abruptly | Ledger ends prematurely without final status | Interrupted Session | Check external state (e.g., GitHub PRs) | Preserve all identifiers, verify state to avoid duplicate actions |
| PR has a bug that fails CI tests | CI logs show specific unit test failures | Corrective Action | Fix the failing tests and push updates | Preserve all original identifiers |
