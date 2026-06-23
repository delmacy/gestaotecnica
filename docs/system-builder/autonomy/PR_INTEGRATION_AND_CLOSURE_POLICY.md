# PR Integration And Closure Policy

## 1. Objective
This document defines the strict states and rules governing when a pull request (PR) is considered accepted, merge-ready, merged, updated, rejected, or closed within the System Builder ecosystem.

## 2. Scope

### 2.1 Separation of ACCEPT_DELIVERY and MERGE_PR
- **ACCEPT_DELIVERY**: This state indicates that the PR meets the acceptance criteria of the task, and the agent has fulfilled its autonomous role. This is an evaluation of the work's quality and alignment with requirements.
- **MERGE_PR**: This is the mechanical process of integrating the approved code into the base branch. It requires that all CI/CD checks have passed and is a separate action from acceptance.
- Acceptance of delivery does **not** automatically trigger a merge.

### 2.2 Updating PR Branch (UPDATE_PR_BRANCH)
An update to the PR branch is required when:
- The base branch has advanced significantly, making the PR stale.
- New commits to the base branch introduce potential integration issues or regressions not covered by the current PR state.
- Conflicts arise between the base branch and the PR.

### 2.3 Handling Exceptions
- **Conflicts**: Must be resolved before the PR can move to `MERGE_READY`. If conflicts require human intervention beyond standard rebase, the PR remains blocked.
- **Failed Checks**: Any failing CI/CD checks prevent integration. The agent or reviewer must address the root cause, or the PR will not advance.
- **Stale Scope**: PRs that have been open for an extended period and no longer align with current project priorities or architectures must be re-evaluated or closed.
- **Superseded Work**: If another PR or commit solves the same problem or makes the PR irrelevant, the PR should be closed as superseded.
- **Pending Comments**: All open corrective comments and requested changes must be explicitly addressed and resolved by the agent or reviewer. Unresolved comments block the PR from being accepted or merged.

### 2.4 Sprint Closure Requirements
A sprint is intrinsically linked to its final technical delivery.
- A sprint **cannot** be closed while related PRs lack a final disposition (Merged, Closed, Rejected).
- If a PR is abandoned or superseded, the related sprint must reflect this closure state accordingly, rather than remaining open indefinitely.

## 3. Acceptance Criteria
- **No Automatic Merging on Green Checks**: Green CI checks alone are necessary but not sufficient to justify merging an old or unreviewed PR.
- **Open Corrective Comments Block Integration**: A PR cannot be considered accepted or merge-ready if there are pending corrective comments or unresolved review threads.
- **Explicit Evidence for Merge**: Merging requires explicit action and verifiable evidence (e.g., passing tests, explicit approval receipts).
- **Sprints Remain Open Until Final Disposition**: A sprint must remain open as long as any associated PR is still pending final resolution.
- **No Historical PR Impact**: This policy governs future PRs and sprint management; no historical PR is retroactively claimed as accepted or rejected by this document.

## 4. Decision Table

| Event / Condition | Resulting State | Required Action / Next Steps |
| :--- | :--- | :--- |
| Agent finishes task to spec | `ACCEPTED` (Delivery) | Await CI checks and final integration review. |
| CI checks pass on `ACCEPTED` PR | `MERGE_READY` | Explicit merge action required. |
| PR meets requirements, CI passes | `MERGED` | Code integrated into base branch. Sprint can be closed. |
| Base branch advances, PR stale | `UPDATE_PR_BRANCH` Required | Rebase or merge base into PR branch. |
| Corrective comments added | `NEEDS_CHANGES` (Blocked) | Agent must resolve comments to proceed. |
| CI checks fail | Blocked | Resolve failures before merge eligibility. |
| Conflicts detected | Blocked | Resolve conflicts via `UPDATE_PR_BRANCH` or manual fix. |
| PR superseded or irrelevant | `CLOSED` / `REJECTED` | Close PR. Close sprint if applicable. |
