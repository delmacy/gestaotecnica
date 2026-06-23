# Bridge Git Synchronization Runbook

## 1. Objective and Scope

This runbook describes the safe recovery procedure when a bridge working copy diverges from its remote branch.

**Scope:**
- Detecting and understanding the impact of non-fast-forward and divergent-branch failures.
- Pausing writer loops before recovery.
- Preserving unique local receipts and events.
- Executing safe fetch, inspection, rebase, conflict resolution, and restart steps.
- Explicit prohibition of unverified force-push recovery.

## 2. Detection and Impact

### Distinguishing Failures

**Transient Failure:**
- Network timeouts, temporary GitHub API unavailability.
- Authentication issues (e.g., token expiration).
- *Indicator:* Git commands fail with network or auth errors, but the local branch commit history does not show conflicting changes with the remote (`git status` reports no divergence).
- *Action:* Retry after verifying connectivity and credentials.

**Branch Divergence:**
- The local bridge working copy has advanced or diverged, while the remote branch has received new commits independently (e.g., another process pushed to the branch, or a PR was merged and the local branch hasn't been updated).
- *Indicator:* `git push` fails with a non-fast-forward error (e.g., `Updates were rejected because the tip of your current branch is behind`). `git pull` without a rebase strategy may fail or prompt for a merge commit.
- *Impact:* The bridge cannot synchronize local states (receipts, events, ledgers) with the remote, blocking further operational progress.

## 3. Pre-Recovery: Pause and Preserve

Before attempting to recover from a divergent branch state, perform the following steps to ensure data is not lost:

1. **Pause Writer Loops:**
   - Stop any automated processes, cron jobs, or bridge writer loops that are currently executing or scheduled to execute against the working directory.
   - *Reason:* Prevents new local commits from being created during the recovery process.

2. **Preserve Unique Local Evidence:**
   - Verify if there are uncommitted changes or recent local commits that only exist in the bridge working copy.
   - Backup critical evidence (such as deployment receipts, operational ledgers, or fleet heartbeats).
   - *Action:* Copy the relevant artifacts to a secure location outside the repository or create a local backup branch.
   - *Reason:* Recovery preserves unique evidence before any reset or rebase that might alter history.

## 4. Recovery Steps: Safe Fetch, Inspect, Rebase

**WARNING:** Unverified force-push recovery (`git push --force` or `git push --force-with-lease` without inspection) is explicitly prohibited.

### 4.1. Safe Fetch
Retrieve the latest remote state without altering the local working directory or branch history.
```bash
git fetch origin
```

### 4.2. Inspection
Determine the extent of the divergence.
```bash
git log HEAD..origin/<branch-name>
git log origin/<branch-name>..HEAD
git status
```
Identify which remote commits need to be integrated and which local commits might conflict.

### 4.3. Rebase and Conflict Resolution
Integrate remote changes by rebasing the local branch onto the updated remote branch. This keeps a linear history and applies local events on top of the latest remote state.
```bash
git rebase origin/<branch-name>
```

**If Conflicts Occur:**
1. Git will pause the rebase.
2. Resolve conflicts manually in the affected files, prioritizing the preservation of remote truth while ensuring local operational receipts are logically integrated.
3. Stage the resolved files:
   ```bash
   git add <resolved-file>
   ```
4. Continue the rebase:
   ```bash
   git rebase --continue
   ```
5. Repeat until the rebase completes successfully.

*Note:* If the rebase goes wrong, abort safely using `git rebase --abort`.

## 5. Restart and Reprocessing

### 5.1. Restart Criteria
The writer loops and automated bridge processes can only be restarted when the repository is in a clean, synchronized state:
- The local branch is successfully rebased and up-to-date with the remote branch.
- `git status` reports nothing to commit and working tree clean.
- `git status` reports the branch is up-to-date with `origin/<branch-name>`, or safely ahead by the strictly preserved local commits.
- A successful `git push` of the preserved local commits has been executed without errors.

### 5.2. Idempotent Reprocessing
Once restarted:
- Any pending work (e.g., dispatch actions, unacknowledged events) must be reprocessed idempotently.
- The system must verify the state of previously attempted operations before re-executing them to prevent duplication.

## 6. Historical Context Constraint

This runbook outlines the required procedure for recovering from divergence. It does not claim that any specific historical incident of divergence was resolved using these steps. It is a forward-looking operational guide.
