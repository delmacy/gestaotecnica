# Evidence: UX-NAV-02-026-builder-runtime-handoff-contract

## Base SHA
Origin branch `main` at commit: `aca313298b1e9a1f33cde067ad110af1b43990c9`

## Environment
Node.js Version: `v24.18.0`

## Contract Delivery
The master contract `BUILDER_RUNTIME_HANDOFF_CONTRACT.md` for the Builder to Runtime Handoff navigation component has been implemented.
It dictates:
1. **User Journey**: Details the origination from Builder screens, action mechanisms, success forward-routing to Runtime URLs, and return paths back to the Builder edit states.
2. **Data & Route Contract**: Defines `POST /api/builder/handoff` inputs (`appId`, `version`, `environmentId`) and responses.
3. **State Behaviors**: Defines explicit behavior for Empty, Blocked (lacking permissions), Demo (sandbox instance), Synthetic (badged as synthetic), and Real-Data (live environment).
4. **Scope Rules**: Granular permissions mapped for `builder_admin`, `builder_member`, and `runtime_user`.
5. **Acceptance Gates**: Required checks (validation, permissions, consistency) before a handoff route resolves.
