# Blocker: Environment mismatch (Node.js version)

The task constraints strictly dictate:
"Use Node.js 24.x for dependency install, tests, typecheck, build, and evidence commands; run `node --version` before implementation and record it in the task/PR evidence; if the environment starts on Node.js 20 or 22, stop and report a blocker instead of proceeding."

The current environment starts on Node.js 22:

```
$ node --version
v22.22.1
```

Base Git SHA: ee6faaec43d4880565adbb11c976daca63843edb

Halting implementation to report the blocker as requested.
