# Post-merge steps

1. Configure `OPENCODE_MODEL`.
2. Configure the matching provider secret.
3. Configure `OPENCODE_AUTOMATION_TOKEN`.
4. Enable Actions pull-request creation and repository auto-merge.
5. Require the OpenCode pull request gate on `main`.
6. Manually run the task runner against the bootstrap task.
7. Repair the existing package-lock mismatch before enabling unattended production runs.
