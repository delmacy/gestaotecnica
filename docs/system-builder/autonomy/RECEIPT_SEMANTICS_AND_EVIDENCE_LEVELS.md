# Receipt Semantics And Evidence Levels

## 1. Objective

This document establishes the precise semantics of receipts and evidence levels within the System Builder platform. It defines exactly what different types of artifacts prove (and what they do not), and establishes a hierarchy of evidence strength across the lifecycle of an operation: from initial intent through to archival.

This ensures that the autonomous system operates on observable facts and explicit evidence, forbidding the hallucination of operational states.

## 2. Evidence Definitions & Lifecycle

The lifecycle of an autonomous operation generates different types of artifacts, each representing a specific level of evidence.

### 2.1 Intent Evidence
*   **Definition:** A declared goal, plan, or specification of work to be done.
*   **Example Artifact:** A Task Descriptor, an Issue, or a command file containing instructions.
*   **What it proves:** It proves that a user or system requested an action.
*   **What it does not prove:** It does **not** prove that the action was started, dispatched, or completed.

### 2.2 Dispatch Evidence
*   **Definition:** Proof that an intent has been submitted to a processing entity (e.g., an agent, a workflow, or an API).
*   **Example Artifact:** An Orchestration Event, an HTTP 202 Accepted response, or an initial queue entry.
*   **What it proves:** It proves the request entered the system.
*   **What it does not prove:** It does **not** prove the execution began or finished.

### 2.3 Execution Evidence
*   **Definition:** Proof that an operation is in progress or has been attempted.
*   **Example Artifact:** A `PENDING` command receipt, an open Pull Request, or a running GitHub Action.
*   **What it proves:** It proves the system is actively working on or has generated intermediate artifacts based on the intent.
*   **What it does not prove:** It does **not** prove the result is correct, verified, or integrated. **A command file alone is not treated as proof of execution.**

### 2.4 Result Evidence (Verification)
*   **Definition:** The raw, unfiltered output from automated checks or tests.
*   **Example Artifact:** A GitHub Actions `SUCCESS` or `FAILED` status, a local `npm test` report, or an architectural check output.
*   **What it proves:** It proves the code passed or failed specific programmatic rules at a given point in time.
*   **What it does not prove:** **A green check is not treated as proof of acceptance or merge.** It only means the automated tests passed.

### 2.5 Acceptance Evidence
*   **Definition:** A formal declaration by an authorized entity (reviewer, tester, or human) that the executed work meets the acceptance criteria.
*   **Example Artifact:** An `APPROVED` pull request review, or a specific `ACCEPT_DELIVERY` state in the ledger.
*   **What it proves:** It proves the work is considered "good to go" from a quality standpoint.
*   **What it does not prove:** It does **not** prove the code is in the target branch.

### 2.6 Integration Evidence
*   **Definition:** Proof that accepted work has been successfully incorporated into the target environment.
*   **Example Artifact:** A Merge Commit SHA in the target branch, or a successful Deployment Receipt.
*   **What it proves:** It proves the change is live or integrated. **A merged PR is distinguished from an accepted delivery.**

### 2.7 Archival Evidence
*   **Definition:** Proof that an integrated change has reached its final disposition and the related intent has been closed.
*   **Example Artifact:** A closed Task state, a merged PR that is marked closed, or a completed operational loop log.
*   **What it proves:** It proves the operation is fully concluded and no further action is expected.

## 3. Distinguishing Artifacts

To prevent hallucinated outcomes, systems must strictly differentiate the following:

*   **Command File vs. Execution:** A command file is an instruction (Intent). It is **not** proof that the command was executed. Execution requires a Receipt or Logs.
*   **Event vs. Receipt:** An Event signals a state transition or a trigger (Dispatch). A Receipt is the structured proof of the *outcome* of an action.
*   **Checks vs. PR State:** Checks (e.g., CI tests) are independent verification points (Result Evidence). They do not equate to the overall state of the PR (which includes human/bot reviews).
*   **Merged PR vs. Accepted Delivery:** Accepting delivery (`ACCEPT_DELIVERY`) means the work is approved. Merging the PR (`MERGE_PR`) is the mechanical act of integration. They are distinct states and occur at different times.

## 4. Minimum Evidence Requirements

Before an entity can declare a state transition in the Operational Evidence Ledger, the following minimum evidence must be strictly observed:

*   **To declare PROPOSED:** An explicit Intent artifact must exist (e.g., a Task or PR creation event).
*   **To declare PENDING (Execution):** A Dispatch event or an open Pull Request must be observable.
*   **To declare OBSERVED (Checks):** A specific, completed run from a verified source (like GitHub Actions) must be retrieved. Absence of failure is NOT success.
*   **To declare OBSERVED (Acceptance):** A formal `APPROVED` review or equivalent signature must be retrieved.
*   **To declare OBSERVED (Merge):** A concrete Merge Commit SHA must exist in the target branch history.

**Crucially:** If expected evidence is missing, inaccessible, or undetermined, it **must** be recorded explicitly as `MISSING`, `INACCESSIBLE`, or `UNKNOWN`. It is forbidden to infer success from missing data.

## 5. Evidence Level Matrix

The following compact table summarizes the hierarchy and requirements for each evidence level:

| Level | Definition | Required Artifact | What it Proves | What it Does NOT Prove |
| :--- | :--- | :--- | :--- | :--- |
| **0 - Intent** | Goal specification | Command File, Issue | Request exists | Execution started |
| **1 - Dispatch** | Request accepted | Event, 202 Ack | Entered system | Execution finished |
| **2 - Execution** | Work underway | PR Created, Running CI | Intermediate state | Correctness |
| **3 - Result** | Automated feedback | CI Green/Red Logs | Code passes checks | PR Accepted/Merged |
| **4 - Acceptance** | Formal approval | `APPROVED` Review | Quality is met | PR is merged |
| **5 - Integration** | Code is merged | Merge Commit SHA | Change is live | - |
| **6 - Archival** | Lifecycle closed | Closed PR/Task | Operation finished | - |

## 6. Simulated Example

*(Note: The following ledger entry is **simulated** to demonstrate how evidence levels map to a concrete ledger state. Do not treat these values as real operational data.)*

```markdown
### 📝 Evidence Evaluation (SIMULATED EXAMPLE)
*   **Intent:** Command file `task-123.md` exists.
*   **Execution:** PR `#999` observed open.
*   **Result:** GitHub Action run `id:44556` reported `SUCCESS`.
*   **Acceptance:** `UNKNOWN` (No review recorded).
*   **Integration:** `MISSING` (Merge SHA not found).

**Conclusion:** State is currently `PENDING` integration. Code is verified but neither accepted nor merged.
```
