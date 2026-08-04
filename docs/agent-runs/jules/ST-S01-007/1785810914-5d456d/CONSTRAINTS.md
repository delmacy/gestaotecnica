# Constraints

- Use Node.js 24.x for dependency install, tests, typecheck, build, and evidence commands; run `node --version` before implementation and record it in the task/PR evidence; if the environment starts on Node.js 20 or 22, first try to activate Node.js 24 with the available version manager (`nvm`, `fnm`, `volta`, `mise`, `asdf`) or a local non-destructive Node.js 24 install; only report a blocker if switching to Node.js 24 fails, and include every command attempted plus exact output.
- No real-money order submission.
- No secrets, broker credentials, or real customer datasets.
- Do not replace persistence with mocks in integration evidence.
- Avoid package or lockfile changes unless the task explicitly requires a dependency.
