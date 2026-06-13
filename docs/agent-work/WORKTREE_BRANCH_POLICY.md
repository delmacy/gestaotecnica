# Worktree and Branch Policy

## Policy

This directory structure must be used for agent workspaces during a wave execution:

```text
main
└── integration/<wave-id>
    ├── task/<package-id-a>
    ├── task/<package-id-b>
    ├── task/<package-id-c>
    └── task/<package-id-d>
```

## Rules

* **One package per branch:** Each Work Package has its own branch `task/<package-id>`.
* **One package per worktree:** Each active package claim is checked out in a Git worktree.
* **Base SHA strictness:** Branches must be based on the exact `base_sha` from the wave.
* **No reuse:** Do not reuse worktrees across packages.
* **Integration branch:** `integration/<wave-id>` is exclusive to the Integrator role.
* **Cleanup:** Remove worktree after integration merge.
* **Validation:** Validate worktree is clean before removing.

## Usage

Agents should not attempt to use worktrees if the environment does not support full Git checkouts (e.g., bare clones, isolated CI steps where `git worktree` is restricted). In those cases, normal checkout and branch switching is permitted, but the logical branch structure remains mandatory.
