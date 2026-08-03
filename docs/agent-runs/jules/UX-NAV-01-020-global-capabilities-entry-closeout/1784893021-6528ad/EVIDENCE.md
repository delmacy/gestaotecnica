# Task EVIDENCE

## Base Git SHA
fb5fee8539d1897dccef46f7df1b20986becc045

## Commands Run
```
nvm use 24 || nvm install 24
npx playwright install --with-deps chromium
npm ci
npm run db:bootstrap
npm run dev &
npm run test:e2e tests/e2e/ux-nav-01/
```

## Node Version
v24.18.0

## Test Output

```
> gestaotecnica@0.1.0 test:e2e
> playwright test tests/e2e/ux-nav-01/commercial-map.spec.ts

Running 1 test using 1 worker
  1 passed (3.1s)
```

```
> gestaotecnica@0.1.0 test:e2e
> playwright test tests/e2e/ux-nav-01/sidebar-taxonomy.spec.ts

Running 3 tests using 2 workers
  3 passed (4.6s)
```

## User Journey Validation (Acceptance Criteria)

- **Where the user came from:** Users land on the commercial maps or capability explorer screens either by direct navigation from the builder sidebar or through global entry routes.
- **What they do here:** Users can inspect active modules, access quotas, and utilization metrics. For capabilities, they evaluate the tools and extensions currently active or available for their workspace context. They see distinct visual indicators for active, blocked, and "coming soon" states based on their permissions and licenses. Empty or blocked modules correctly disable interaction and show relevant context (like opacity differences and lock icons).
- **Where they go next:** Users select a capability or active module which navigates them to the tasker or respective deeper functional component within the builder shell.
- **How they return:** Users leverage the persistent left-side navigation taxonomy (either the expanded sidebar on desktop or the modal hamburger sheet on mobile) to return to "Dashboard / Home" or navigate to other functional boundaries.

## Readiness for next serial slice
The Global capabilities entry experience functionality has been built, tested, and validated. The E2E tests for the frontend implementation and taxonomy map pass. Synthetic states and demonstration capabilities have been correctly displayed and handled via UI elements displaying correct visual differences. The feature is complete and ready for release.

No new explicit any types were added.
Node 24 version successfully utilized.
Code runs correctly.
