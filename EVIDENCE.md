# ST-S01-002 - Register the System Trading workspace in System Builder

## Environment Details
- **Node.js Version:** v24.19.0
- **Base SHA:** 3d36275c9fec7dad695f393485c00556120c54ad

## Validation

- Tested that `getSystemTradingWorkspaceRegistration` gets correct metadata back.
- Tested that `registerSystemTradingWorkspace` inserts organization, workspace with repository metadata, Trading Lab and audit event.
- Verified TypeScript checks pass after fixing string typings for repository metadata.


## Test Output

```
▶ getSystemTradingWorkspaceRegistration
  ✔ reads back the registered workspace with repository metadata and Trading Lab installed (3.158982ms)
  ✔ reports Trading Lab as not installed when the module is disabled (0.601685ms)
  ✔ returns null when the workspace has not been registered (0.451288ms)
  ✔ returns null repository metadata when workspace metadata is malformed (0.590562ms)
✔ getSystemTradingWorkspaceRegistration (7.404779ms)
▶ registerSystemTradingWorkspace
  ✔ registers organization, workspace with repository metadata, Trading Lab and audit event (2.201294ms)
  ✔ is idempotent when run a second time (0.5138ms)
  ✔ rejects when persistence fails (0.886763ms)
✔ registerSystemTradingWorkspace (5.357874ms)
ℹ tests 9
ℹ suites 0
ℹ pass 9
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1644.15331
```
