# Blocker: Environment Mismatch

The task requires Node.js 24.x, but the environment is running an unauthorized version.

## Details

- **Expected:** Node.js 24.x
- **Actual `node --version`:** `v22.22.1`
- **Base Git SHA:** `92767ccf2abe6b51e885e6e89bcd6532947830e3`

Implementation is halted to comply with the constraint:
> Use Node.js 24.x for dependency install, tests, typecheck, build, and evidence commands; run `node --version` before implementation and record it in the task/PR evidence; if the environment starts on Node.js 20 or 22, stop and report a blocker instead of proceeding.
