# OpenCode security boundary

Agent pull requests are prevented from changing `.github/workflows/`, `.github/actions/`, and `vercel.json` by the independent PR gate. The implementation prompt also forbids commits, pushes, merges, secret changes, and deployment changes.

The GitHub workflow remains the authority for branch creation, validation, commits, pull requests, and auto-merge. OpenCode is limited to editing the checked-out working tree and running project commands.
