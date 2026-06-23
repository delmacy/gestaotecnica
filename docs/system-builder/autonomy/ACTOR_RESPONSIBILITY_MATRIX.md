# Actor Responsibility Matrix

## Objective

This document defines the strict boundaries, responsibilities, and interactions among the various actors operating within the System Builder environment. It clearly separates reasoning capabilities (GPT roles) from deterministic execution and human oversight.

## Actor Definitions and Boundaries

### 1. Manager (GPT Role)
- **Role:** High-level strategic planner and workflow orchestrator.
- **Responsibilities:** Determines execution strategies, defines task dependencies, and oversees the process flow.
- **Boundaries:** The Manager is a reasoning AI entity, **not the human operator**. It decides *how* tasks should be approached but does not execute the tasks itself.

### 2. Tasker (GPT Role)
- **Role:** Operational planner and task dispatcher.
- **Responsibilities:** Breaks down management strategies into actionable tasks and instructions.
- **Boundaries:** Does not write code or perform reviews; it only formats and dispatches actionable task definitions to other agents.

### 3. Reviewer (GPT Role)
- **Role:** Code and structural validator.
- **Responsibilities:** Reviews code changes, ensures architectural compliance, and provides constructive feedback (e.g., via `NEED_COMMENT_PR`).
- **Boundaries:** A distinct GPT role from Tester and Jules. It observes and evaluates but does not implement the fixes.

### 4. Tester (GPT Role)
- **Role:** Quality assurance and CI/CD analyst.
- **Responsibilities:** Evaluates test execution reports, artifacts, and logs to ensure the system functions correctly.
- **Boundaries:** A distinct GPT role. It reads evidence and requests adjustments if needed, but it does not execute local test commands directly to bypass CI.

### 5. Agent Control Bridge
- **Role:** Execution and communication layer.
- **Responsibilities:** Translates decisions into system commands, handles API integrations, and routes payloads between reasoning roles and tools.
- **Boundaries:** **Deterministic and non-reasoning**. It blindly executes valid commands and reports outputs; it makes no decisions regarding code logic or business rules.

### 6. Jules
- **Role:** Autonomous Software Engineer (Implementation Agent).
- **Responsibilities:** Implements code, explores codebases, writes tests, and opens or updates Pull Requests.
- **Boundaries:** Jules writes the code and automates the PR creation/updating process. **Jules does not merge PRs**.

### 7. GitHub / Actions
- **Role:** Operational platform and continuous integration runtime.
- **Responsibilities:** Hosts code, runs automated tests, builds artifacts, and enforces protection rules.
- **Boundaries:** Actions and checks are **evidence sources, not decision-makers**. They provide factual pass/fail data that the Tester and Human Operator use to make decisions.

### 8. Human Operator
- **Role:** Final authority and release manager.
- **Responsibilities:** Provides initial requirements, intervenes when the system is blocked, performs explicit human gates, and triggers production changes.
- **Boundaries:** Distinct from the Manager. The Human Operator holds the keys for ultimate acceptance (`MERGE_PR`, deployments) and explicit approvals.

## Critical Transitions

The lifecycle of a task delivery fundamentally separates validation from integration:
- **ACCEPT_DELIVERY:** Evaluates whether the autonomous agent (Jules) successfully met the Acceptance Criteria of the task. This is a validation state.
- **MERGE_PR:** Represents the actual integration of code into the target branch. This is an explicit transition often reserved for the Release Manager or Human Operator, ensuring CI is green. `MERGE_PR` is explicitly separate from `ACCEPT_DELIVERY`.

## RACI Matrix

**Key:**
- **R** = Responsible (Does the work)
- **A** = Accountable (Approves the work)
- **C** = Consulted (Provides input)
- **I** = Informed (Kept up to date)

| Activity | Manager | Tasker | Jules | Reviewer | Tester | Bridge | Actions | Human |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Planning** | R/A | C | I | I | I | I | I | C/A |
| **Dispatch** | A | R | I | I | I | R | I | I |
| **Coding** | I | I | R | C | I | R | I | I |
| **Review** | I | I | R | A | I | R | I | I |
| **Testing** | I | I | R | I | A | R | R | I |
| **Acceptance** (`ACCEPT_DELIVERY`) | I | A | I | R | R | I | C | A |
| **Merge** (`MERGE_PR`) | I | I | I | I | I | I | C | R/A |
| **Archival** | I | R | I | I | I | R | I | I |

---
*Note: The Agent Control Bridge executes the mechanics for transitions and dispatches (R), while reasoning agents decide the content.*
