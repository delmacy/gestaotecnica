# Blocker: Node.js version constraint violation

The environment is running Node.js `v22.22.1`, which violates the task constraint:

> Use Node.js 24.x for dependency install, tests, typecheck, build, and evidence commands; run `node --version` before implementation and record it in the task/PR evidence; if the environment starts on Node.js 20 or 22, stop and report a blocker instead of proceeding.

## Evidence

Output of `node --version`:
```
v22.22.1
```

Base Git SHA:
```
764b0f524675634d75271fd6f06f1a527ae1a67a
```
