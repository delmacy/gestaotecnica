# Planning Stock Replenishment Policy

This policy defines the rules and guidelines for how the orchestrator should replenish `tasks/ready/` when the ready-task stock falls below its minimum threshold.

## 1. Separation of Planning and Operations
This policy strictly distinguishes **planning artifacts** from **operational commands**. The planning document describes what tasks need to exist but does not execute the transition of those tasks into active work.

## 2. Task Characteristics
New tasks created to replenish the ready stock must be:
- **Small**
- **Independent**
- **Non-duplicative**

## 3. Frontmatter Requirements
Each ready task placed in `tasks/ready/` requires the following fields in its frontmatter:
- `task_id`
- `repository_full_name`
- `base_branch`

## 4. Execution Commands
The bridge, not the planning document, is exclusively responsible for creating `START_TASK` commands. Planning documents must never embed or attempt to execute operational commands to start tasks.

## 5. Stock Counts
Stock counts are treated purely as **observed values**. They must not be used as inferred completion evidence for any task or process.
