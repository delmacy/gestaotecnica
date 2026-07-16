# Blocker: Missing Allowed List for CL-01-004-release-roles

The task instructions for CL-01-004-release-roles strictly require that no files outside the "allowed list" be edited.

However, no `allowed list` or `get_allowed_list.sh` script is provided in the task context (`docs/agent-runs/jules/CL-01-004-release-roles/1784202249-aaa03c/`), nor is there any explicitly defined allowlist for this task in the repository.

Because of the constraint "Do not edit files outside the allowed list," I am blocked from modifying existing documentation (such as `docs/operations/OPERATOR_RUNBOOK.md`) or creating new files to document the launch roles, support ownership, and escalation path.

Please provide the explicit allowed list or remove the constraint so that the required documentation can be added.
