# Sync Gate

This document specifies the deterministic procedure to sync a worktree with `origin/main` before launch work starts.

## Procedure
1. Fetch the latest changes from the remote:
   `git fetch origin main`
2. Record the base SHA from `origin/main` into a tracking file:
   `git rev-parse origin/main > .sync-base-sha`
3. Sync the local worktree with the origin branch:
   `git reset --hard origin/main`

## State Machine
The worktree follows this state machine:
`UNSYNCED` → `SYNCED` → `LAUNCH_READY`

- **UNSYNCED**: The worktree has not been updated with the latest `origin/main`.
- **SYNCED**: The worktree is updated and the base SHA is recorded in `.sync-base-sha`.
- **LAUNCH_READY**: The worktree has been validated against the recorded SHA and is ready for launch work.

## Validation
To validate the sync state and block launch if out of sync, run:
```bash
if [ "$(git rev-parse HEAD)" != "$(cat .sync-base-sha)" ]; then
  echo "Error: Worktree is out of sync. Please re-run the sync procedure."
  return 1
fi
echo "Validation passed. Worktree is in LAUNCH_READY state."
```
