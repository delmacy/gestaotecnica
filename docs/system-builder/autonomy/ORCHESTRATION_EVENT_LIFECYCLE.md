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

*   **Manager (Human / External System):** Initiates requests, provides intent, reviews outcomes, and makes explicit merge and acceptance decisions.
*   **Tasker (ChatGPT / LLM):** Reasons about the Manager's request, generates a plan, and publishes durable task artifacts.
*   **Bridge (System Runtime):** Interprets task artifacts, translates them into actionable commands or configuration, and dispatches them to execution engines.
*   **Jules (Autonomous Agent):** Executes deterministic tasks, implements code changes, creates pull requests, and responds to specific tool calls or feedback loops.
*   **Reviewer / Tester (Human / CI/CD):** Inspects changes, runs validation, and provides feedback (approval, rejection, or requests for changes).

## 2. Event Lifecycle Stages

The lifecycle follows an ordered sequence, emphasizing the separation of reasoning, execution, and acceptance.

### 2.1. Intent & Planning

*   **Input:** Manager provides a goal, request, or issue.
*   **Actor:** Tasker (ChatGPT).
*   **Action:** Analyzes the request, determines required changes, and constructs a detailed execution plan.
*   **Output (Durable):** A structured task definition (e.g., Markdown plan, JSON task payload).
*   **Evidence:** Documented plan available in issue or task system.

### 2.2. Dispatch

*   **Input:** The published task definition.
*   **Actor:** Bridge.
*   **Action:** Translates the task into execution parameters (e.g., GitHub Action inputs, script arguments) and triggers the execution environment.
*   **Output (Durable):** Execution run triggered (e.g., GitHub Actions workflow run).
*   **Evidence:** Action run logs and associated metadata.

### 2.3. Execution

*   **Input:** Dispatch instructions and execution environment.
*   **Actor:** Jules.
*   **Action:** Analyzes code, implements changes, runs local validation (if capable), and prepares a set of modifications.
*   **Output (Durable):** Code modifications on a distinct branch; a Pull Request (PR) raised against the target branch.
*   **Evidence:** PR creation, commit history, and associated descriptions. Jules does *not* merge the PR.

### 2.4. Review and Validation

*   **Input:** The open Pull Request and associated branch.
*   **Actor:** Reviewer (Human) and/or Tester (CI/CD pipeline).
*   **Action:** Inspects the diff, evaluates adherence to requirements, and runs automated checks (linting, tests, security scans).
*   **Output (Durable):** PR comments, review status (Approved/Changes Requested), CI/CD status checks.
*   **Evidence:** Review history on the PR, check statuses linked to the PR head commit.

### 2.5. Iteration (Feedback Loop)

*   **Input:** Review feedback (Changes Requested) or test failures (Blocked/Failed).
*   **Actor:** Jules (reacting to feedback) or Tasker (if replanning is needed).
*   **Action:**
    *   *Simple Fixes (Retry/Feedback):* Jules interprets PR comments or failing CI logs and pushes additional commits to the existing PR.
    *   *Complex Blockers:* If Jules cannot resolve the issue autonomously, the state is reported back, potentially requiring Manager intervention or Tasker replanning.
*   **Output (Durable):** Additional commits, updated PR state, or blocked task status.
*   **Evidence:** New commits on the PR, updated review/check statuses.

### 2.6. Acceptance and Merge

*   **Input:** An approved PR with passing checks.
*   **Actor:** Manager (Human).
*   **Action:** Makes the explicit decision that the changes meet acceptance criteria and performs the merge operation. **Delivery acceptance and merge are separate transitions from execution and are never performed autonomously by Jules.**
*   **Output (Durable):** Merged PR, updated target branch.
*   **Evidence:** Merge commit, closed PR status.

### 2.7. Archival

*   **Input:** Merged or closed task.
*   **Actor:** Manager or Automation.
*   **Action:** Records the final state, updates tracking systems, and closes associated issues.
*   **Output (Durable):** Closed issues, finalized documentation.
*   **Evidence:** System state reflecting completion.

## 3. Summary of State Transitions

| Stage | Responsible Actor | Output/State Transition |
| :--- | :--- | :--- |
| Intent & Planning | Tasker | Request -> Planned Task |
| Dispatch | Bridge | Planned Task -> Dispatched Run |
| Execution | Jules | Dispatched Run -> Open PR |
| Review | Reviewer/Tester | Open PR -> Reviewed/Checked |
| Iteration | Jules/Tasker | Reviewed -> Updated PR (via Feedback/Retry) |
| Acceptance | Manager | Approved PR -> Merged PR (Accepted) |
| Archival | Manager/System | Merged PR -> Closed/Archived |
