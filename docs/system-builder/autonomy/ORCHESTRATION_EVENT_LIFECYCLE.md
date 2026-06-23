# Orchestration Event Lifecycle

## Objective
Describe the lifecycle of orchestration events within System Builder's autonomy loop. It traces the flow from initial planning requests through execution, review, and final acceptance, clearly delineating the responsibilities of various actors and systems.

## Context
The System Builder automation loop separates reasoning from deterministic execution. ChatGPT publishes durable artifacts, the bridge executes supported operations, Jules implements code, and GitHub records evidence. The lifecycle document must make ownership and state transitions unambiguous.

## Scope
- Define the main actors and their responsibilities.
- Describe lifecycle stages from planning request to final archival.
- Map common events and decisions to the responsible actor.
- Document how blockers, questions, retries, and requested changes re-enter the flow.
- State that delivery acceptance and merge are separate transitions.

## 1. Actors and Roles

*   **Manager (GPT Agent):** Initiates requests, provides intent, reviews outcomes, and determines acceptance criteria readiness.
*   **Tasker (GPT Agent):** Reasons about the Manager's request, generates a plan, and publishes durable task artifacts.
*   **Reviewer (GPT Agent):** Inspects changes, runs validation reasoning, and provides explicit approval or requests for changes.
*   **Tester (GPT Agent):** Validates the correctness of the execution against tests and specifications.
*   **Human:** Provides ultimate oversight, overrides, and final approval if needed; distinct from GPT Agents.
*   **Bridge (System Runtime):** Deterministic executor of structured commands and receipts. It translates artifacts into action and manages state transitions without inferring intent.
*   **Jules (Autonomous Agent):** Executes deterministic tasks, implements code changes, creates pull requests, and responds to specific tool calls or feedback loops. Jules never performs a merge.
*   **Sources of Evidence (GitHub Actions / CI):** Deterministic environments that record proof of execution, testing, and validation states.

## 2. Event Lifecycle Stages

The lifecycle follows an ordered sequence, emphasizing the separation of reasoning, execution, and acceptance.

### 2.1. Intent & Planning

*   **Input:** Manager provides a goal, request, or issue.
*   **Actor:** Tasker.
*   **Action:** Analyzes the request, determines required changes, and constructs a detailed execution plan.
*   **Output (Durable):** A structured task definition (e.g., Markdown plan, JSON task payload).
*   **Evidence:** Documented plan available in issue or task system.

### 2.2. Dispatch

*   **Input:** The published task definition.
*   **Actor:** Bridge.
*   **Action:** Translates the task into execution parameters (e.g., GitHub Action inputs, script arguments) and triggers the execution environment without inferring intent.
*   **Output (Durable):** Execution run triggered (e.g., GitHub Actions workflow run).
*   **Evidence:** Action run logs and associated metadata.

### 2.3. Execution

*   **Input:** Dispatch instructions and execution environment.
*   **Actor:** Jules.
*   **Action:** Analyzes code, implements changes, runs local validation, and prepares a set of modifications.
*   **Output (Durable):** Code modifications on a distinct branch; a Pull Request (PR) raised against the target branch.
*   **Evidence:** PR creation, commit history, and associated descriptions. Jules does *not* merge the PR.

### 2.4. Review and Validation

*   **Input:** The open Pull Request and associated branch.
*   **Actor:** Reviewer and Tester.
*   **Action:** Inspects the diff, evaluates adherence to requirements, and evaluates automated checks.
*   **Output (Durable):** PR comments, review status (Approved/Changes Requested).
*   **Evidence:** Review history on the PR, check statuses (from CI/GitHub Actions) linked to the PR head commit.

### 2.5. Iteration (Feedback Loop)

*   **Input:** Review feedback (Changes Requested) or test failures (Blocked/Failed).
*   **Actor:** Jules (reacting to feedback) or Tasker (if replanning is needed).
*   **Action:**
    *   *Simple Fixes (Retry/Feedback):* Jules interprets PR comments or failing CI logs and pushes additional commits to the existing PR.
    *   *Complex Blockers:* If Jules cannot resolve the issue autonomously, the state is reported back, potentially requiring Manager intervention or Tasker replanning.
*   **Output (Durable):** Additional commits, updated PR state, or blocked task status.
*   **Evidence:** New commits on the PR, updated review/check statuses.

### 2.6. Acceptance and Merge

*   **Input:** An approved PR with passing checks and a confirmed Manager acceptance decision.
*   **Actor:** Bridge.
*   **Action:** Executes the `ACCEPT_DELIVERY` transition followed by the `MERGE_PR` transition based on structured commands. **Delivery acceptance and merge are separate transitions executed by the Bridge. Jules never merges the PR.**
*   **Output (Durable):** Merged PR, updated target branch.
*   **Evidence:** Merge commit, closed PR status, recorded receipts.

### 2.7. Archival

*   **Input:** Merged or closed task.
*   **Actor:** Bridge / Automation.
*   **Action:** Records the final state, updates tracking systems, and closes associated issues.
*   **Output (Durable):** Closed issues, finalized documentation.
*   **Evidence:** System state reflecting completion.

## 3. Summary of State Transitions

| Stage | Responsible Actor | Output/State Transition |
| :--- | :--- | :--- |
| Intent & Planning | Tasker | Request -> Planned Task |
| Dispatch | Bridge | Planned Task -> Dispatched Run |
| Execution | Jules | Dispatched Run -> Open PR |
| Review | Reviewer & Tester | Open PR -> Reviewed/Checked |
| Iteration | Jules / Tasker | Reviewed -> Updated PR (via Feedback/Retry) |
| Delivery Acceptance | Bridge | Approved PR -> ACCEPT_DELIVERY |
| Merge | Bridge | ACCEPT_DELIVERY -> MERGE_PR |
| Archival | Bridge / Automation | Merged PR -> Closed/Archived |
