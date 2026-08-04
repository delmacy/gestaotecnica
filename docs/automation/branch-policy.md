# Agent branch policy

Every automated task uses a dedicated `agent/<task-id>` branch created from the latest `main`. The task runner does not start another task while any `agent/*` pull request remains open.

Branch protection and required checks on `main` remain the final authority for merge eligibility.
