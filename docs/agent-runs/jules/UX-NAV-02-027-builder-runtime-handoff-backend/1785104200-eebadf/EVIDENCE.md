# Evidence: UX-NAV-02-027-builder-runtime-handoff-backend

## Task Completion

We have implemented the backend data binding contract for the Builder to Runtime Handoff based on `docs/ui/surfaces/navigation/BUILDER_RUNTIME_HANDOFF_CONTRACT.md`.

### User Journey Addressed
1. **Where the user came from**: The user originates from the Builder environment (`/builder/deploy` or `/builder/processes/[id]/deploy`).
2. **What they do here**: The user triggers a "Deploy to Runtime" action. The `POST /api/builder/handoff` API is called with `{ appId, version, environmentId }`.
3. **Where they go next**: Based on the returned `runtimeUrl`, the frontend can redirect the user to the runtime view (e.g., `/runtime/app/[appId]`).
4. **How they return**: From the Runtime view, a "Return to Builder" action allows them to navigate back using the builder configurations.

### Distinct States Implemented
1. **Empty State**: Triggered when `version` is `'0.0.0'` or `'empty'`. The API returns `success: false`, `status: "empty"`, and `message: "No configurations to deploy"`.
2. **Blocked State**: Triggered when `environmentId` is `'prod-restricted'` or `'blocked'`. Returns `success: false`, `status: "blocked"`, and `message: "Restricted"`.
3. **Demo State**: Triggered when `environmentId` is `'demo'`. Returns `success: true`, `status: "demo"`, `message: "Deploy to Demo Runtime"`, and a runtime URL formatted for demo (e.g., `/runtime/demo/[appId]`).
4. **Synthetic State**: Triggered when `environmentId` is `'synthetic'` or `appId` starts with `'synth-'`. Returns `success: true`, `status: "synthetic"`, `message: "Deploy to Synthetic Runtime"`, and a synthetic runtime URL.
5. **Real-Data State**: The standard case returning `success: true`, `status: "success"`, `message: "Deploying to Production Network"`, and the production `runtimeUrl`.

### Commands Run & Validation
```bash
npx tsx --test tests/platform/builder/contracts/handoff/resolve-handoff.test.ts
# Result: pass 5 (empty state, blocked state, demo state, synthetic state, real data)

npx tsx --test tests/app/api/builder/handoff/route.test.ts
# Result: pass 2 (400 for invalid payload, 200 with success resolution for valid payload)
```

No new explicit TypeScript `any` was introduced.
Node 24 was used.
All architectural boundaries were respected (contract implemented in `src/platform/builder/contracts/handoff` and route mapped in `src/app/api/builder/handoff/route.ts`).
