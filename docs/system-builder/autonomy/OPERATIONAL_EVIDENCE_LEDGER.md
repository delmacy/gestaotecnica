# Operational Evidence Ledger Contract

## 1. Objective
This document defines the strict standard for recording verifiable evidence of operations executed across System Builder entities (ChatGPT, Agent Control Bridge, Jules, GitHub PRs, Actions, Reviewers, Testers). The purpose is to ensure absolute traceability and clearly separate actual observed states from proposals, inferences, or unknown states.

**Under no circumstances should any system invent, infer, or hallucinate operational results, identifiers, or states.** Every claim must be backed by an observable artifact.

## 2. Definitions & Epistemology

The foundation of the ledger relies on strictly categorizing information:

*   **FACT:** An observable, verified event or state backed by an artifact (e.g., a known commit SHA, a direct API response).
*   **PROPOSAL:** An action intended to be taken, but not yet executed or verified.
*   **INFERENCE:** A hypothesis about the system's state or behavior based on partial data (e.g., "the PR probably passed because no errors were seen"). Inferences **must not** be recorded as facts.
*   **UNKNOWN STATE:** An operation was triggered, but the result is missing, inaccessible, or pending verification.

## 3. Allowed Status Vocabulary

When recording states in the ledger, only the following vocabulary is permitted:

*   `OBSERVED`: Evidence was directly observed and verified via artifact/API.
*   `PROPOSED`: The action is planned or a PR has been created, pending execution/review.
*   `PENDING`: An action is in progress or waiting for external response/checks.
*   `INACCESSIBLE`: Evidence exists but cannot be retrieved due to permission or environment constraints.
*   `MISSING`: Expected evidence could not be found (e.g., a check did not run).
*   `UNKNOWN`: The status is undetermined (use this instead of inferring success/failure).
*   `FAILED`: The action or check explicitly reported a failure state.

## 4. Acceptance vs. Merge

It is critical to distinguish between accepting a delivery and merging code.
*   **ACCEPT_DELIVERY:** A reviewer or tester validates that the proposed change meets the acceptance criteria.
*   **MERGE_PR:** The explicit, mechanical act of integrating the code into the base branch.
*   **Rule:** Acceptance of delivery **does not imply** a merge has occurred. These are distinct states and must be recorded separately.

## 5. Ledger Template

Below is the compact Markdown ledger template that agents and systems must use to report their actions.

```markdown
### 📝 Operational Ledger Entry

**Context**
*   **Task ID:** `[TASK-ID]`
*   **Session ID:** `[SESSION-ID]`
*   **Event ID:** `[EVENT-ID | "N/A"]`
*   **Timestamp (UTC):** `YYYY-MM-DDTHH:MM:SSZ`

**Target**
*   **Repository:** `owner/repo`
*   **Base Branch:** `[BRANCH-NAME]`
*   **Target Branch:** `[BRANCH-NAME]`

**Execution Evidence**
*   **Commit SHA:** `[FULL-SHA | "PENDING"]`
*   **PR Number:** `[#NUMBER | "PROPOSED" | "N/A"]`
*   **Command Receipt:** `[RECEIPT-ID | "N/A"]`

**Verification State**
*   **Checks Evidence Status:** `[OBSERVED | PENDING | MISSING | INACCESSIBLE | UNKNOWN]`
*   **Checks Observed Value:** `[SUCCESS | FAILED | N/A]`
*   **Review Evidence Status:** `[OBSERVED | PROPOSED | PENDING | MISSING | INACCESSIBLE | UNKNOWN]`
*   **Review Observed Value:** `[APPROVED | REJECTED | N/A]`
*   **Merge Evidence Status:** `[OBSERVED | PROPOSED | PENDING | MISSING | INACCESSIBLE | UNKNOWN]`
*   **Merge Observed Value:** `[MERGED | N/A]`

**Notes:**
*   [Record any specific artifacts observed, missing data, or why a state is marked INACCESSIBLE/UNKNOWN]
```

## 6. Example Ledger Entry

```markdown
### 📝 Operational Ledger Entry

**Context**
*   **Task ID:** `TASK-GT-EXAMPLE-001`
*   **Session ID:** `sess_abc123`
*   **Event ID:** `evt_xyz789`
*   **Timestamp (UTC):** `2024-05-10T14:32:00Z`

**Target**
*   **Repository:** `delmacy/gestaotecnica`
*   **Base Branch:** `main`
*   **Target Branch:** `feat/example-feature`

**Execution Evidence**
*   **Commit SHA:** `7647418a90123...`
*   **PR Number:** `#257`
*   **Command Receipt:** `N/A`

**Verification State**
*   **Checks Evidence Status:** `OBSERVED`
*   **Checks Observed Value:** `SUCCESS`
*   **Review Evidence Status:** `OBSERVED`
*   **Review Observed Value:** `APPROVED`
*   **Merge Evidence Status:** `PROPOSED`
*   **Merge Observed Value:** `N/A`

**Notes:**
*   All checks passed according to GitHub Actions UI. PR is approved and awaiting manual merge.
```

## 7. Prohibitions

1.  **NO FABRICATION:** Never invent PR numbers, commit SHAs, Event IDs, Session IDs, or Task IDs. If unknown, state `UNKNOWN` or `N/A`.
2.  **NO HALLUCINATED SUCCESS:** Never claim checks passed, a PR was reviewed, a PR was merged, or a bridge consumed a command without explicit, verifiable artifacts.
3.  **NEUTRALITY:** This contract remains implementation-neutral. It does not dictate database designs, event stores, or claim unsupported product behaviors.

## 8. Handling Missing or Inaccessible Evidence

When evidence cannot be retrieved:
1.  Do not guess the outcome.
2.  Mark the corresponding field in the ledger as `MISSING` or `INACCESSIBLE`.
3.  Add a brief note explaining *why* it is missing or inaccessible (e.g., "GitHub Actions API returned 403 Forbidden", "Logs truncated").
