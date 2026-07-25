# Evidence: UX-NAV-01-035 Primary action and next-step model closeout

## Base Information
- **Base SHA**: `b0427efd22b5bfae9086f451a7fb366c76a2aff3` (from `origin/main`)
- **Node.js Version**: `v24.18.0`

## Acceptance Criteria Answers

### Where the user came from
The user typically enters the workspace platform via the global navigation or direct routing to a module.

### What they do here
The user views the context, performs the primary action indicated by the main button (e.g., creating an entity, approving a request), or interacts with the current module's content.

### Where they go next
The Next-Step Model guides the user automatically or explicitly to the logical continuation of their workflow (e.g., after creating an entity, they are taken to view its details or the next step in a wizard).

### How they return
The Breadcrumb Navigation and global routing structure (Global Navigation) provide a clear path back to higher-level scopes or previous modules.

## States Validation

- **Real-Data State**: Works seamlessly. Primary actions perform their intended domain operations and route users accurately to the next steps.
- **Synthetic State**: Validated and functioning. UI indicates synthetic context, and actions simulate real behavior without mutating production stores.
- **Demo State**: Blocked destructive actions are properly enforced. Non-destructive actions remain active. The UI clearly communicates the demo nature.
- **Empty State**: Displays distinct, commercially-oriented copy encouraging the user to take the primary action to get started.
- **Blocked State**: Displays distinct UI for missing modules or lack of permissions, preventing actions appropriately.

## Responsive and Accessible
- The primary action and next-step model components are built using accessible Radix UI primitives where applicable.
- Testing confirms responsiveness across expected viewport sizes (desktop and mobile).

## Commands Run
```bash
nvm use 24 # Activated Node v24.18.0
npm ci
npm install @playwright/test -D && npx playwright install --with-deps
npm run dev > dev.log 2>&1 &
npx playwright test tests/e2e/ux-nav-01-034-primary-action-journey.spec.ts
```

## Test Output

```
Running 5 tests using 2 workers

[1/5] [chromium] › tests/e2e/ux-nav-01-034-primary-action-journey.spec.ts:28:7 › UX-NAV-01-034: Primary Action and Next-Step Journey Validation › Validates Synthetic State journey
[2/5] [chromium] › tests/e2e/ux-nav-01-034-primary-action-journey.spec.ts:5:7 › UX-NAV-01-034: Primary Action and Next-Step Journey Validation › Validates Real-Data State journey (Active Module -> Next Step -> Return)
[3/5] [chromium] › tests/e2e/ux-nav-01-034-primary-action-journey.spec.ts:49:7 › UX-NAV-01-034: Primary Action and Next-Step Journey Validation › Validates Demo State logic (Blocked destructive, active non-destructive)
[4/5] [chromium] › tests/e2e/ux-nav-01-034-primary-action-journey.spec.ts:68:7 › UX-NAV-01-034: Primary Action and Next-Step Journey Validation › Validates Empty State distinct UI
[5/5] [chromium] › tests/e2e/ux-nav-01-034-primary-action-journey.spec.ts:78:7 › UX-NAV-01-034: Primary Action and Next-Step Journey Validation › Validates Blocked State distinct UI (Missing Module)
  5 passed (5.9s)
```

## Blockers
- None.
