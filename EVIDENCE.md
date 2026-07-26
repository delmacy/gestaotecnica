# Task Execution Evidence

## Base State
- **Git SHA:** `91a05a68319cbe4c3f37d5a6471d3f13a3b5c961`
- **Node.js Version:** `v22.22.1` (Note: Project constraint normally specifies 24.x, however execution within the sandboxed environment defaults to 22.22.1; all tests executed explicitly as required)

## Acceptance Criteria Answers

1. **Where the user came from, what they do here, where they go next, and how they return:**
   - **Answer:** Implemented `resolveBreadcrumbInventory` to map hierarchical depth (`Workspace` or `Platform Admin` root -> Module Level -> Dynamic/Nested Items) based on current context. Users are presented with distinct clickable anchors to step backwards into parent views/modules cleanly without traversing raw paths.

2. **Empty, blocked, demo, synthetic, and real-data states have distinct user-facing outcomes:**
   - **Answer:** Added logic utilizing context variables (e.g. `environmentMode: 'synthetic'` automatically formats items as "Mock X" unless overridden, `isNotFound` rendering "Entity Not Found", and `isBlocked` rendering "Restricted Area").

3. **User-facing language is commercial/product oriented, not implementation-training oriented:**
   - **Answer:** Breadcrumb nodes resolve against explicit route definitions (`NavigationModule.label`) which contain commercial names (e.g., "Tasker", "Capabilities"), falling back to cleanly formatted strings when traversing raw segments.

4. **Focused tests or documented validation evidence are included in the PR:**
   - **Answer:** Unit tests written and placed inside `tests/unit/platform/builder/contracts/breadcrumb-inventory.test.ts`. See Test Evidence section.

5. **Pipeline discipline is respected:**
   - **Answer:** Changes are strictly constrained to `src/platform/builder/contracts/` backend/data binding domain scope, without bleeding into UI components.

## Test Evidence

Ran newly created unit tests for Breadcrumb Inventory rules using the native test runner:

```sh
$ npx tsx --test tests/unit/platform/builder/contracts/breadcrumb-inventory.test.ts

TAP version 13
# Subtest: Breadcrumb Inventory
    # Subtest: should return just the Workspace root for /builder
    ok 1 - should return just the Workspace root for /builder
    # Subtest: should return just the Platform Admin root for /admin
    ok 2 - should return just the Platform Admin root for /admin
    # Subtest: should resolve Tasker module correctly
    ok 3 - should resolve Tasker module correctly
    # Subtest: should resolve deep nested paths
    ok 4 - should resolve deep nested paths
    # Subtest: should resolve Platform Admin deep nested paths
    ok 5 - should resolve Platform Admin deep nested paths
    # Subtest: should use dynamic labels when provided
    ok 6 - should use dynamic labels when provided
    # Subtest: should prefix with Mock in synthetic mode if no dynamic label is provided
    ok 7 - should prefix with Mock in synthetic mode if no dynamic label is provided
    # Subtest: should not prefix with Mock in synthetic mode if dynamic label is provided
    ok 8 - should not prefix with Mock in synthetic mode if dynamic label is provided
    # Subtest: should render Entity Not Found state for missing items
    ok 9 - should render Entity Not Found state for missing items
    # Subtest: should render Restricted Area state for blocked items
    ok 10 - should render Restricted Area state for blocked items
    # Subtest: should handle missing modules (fallback formatting)
    ok 11 - should handle missing modules (fallback formatting)
    # Subtest: should block traversal on coming_soon modules
    ok 12 - should block traversal on coming_soon modules
    1..12
ok 1 - Breadcrumb Inventory
  ---
  duration_ms: 20.632163
  type: 'suite'
  ...
1..1
# tests 12
# suites 1
# pass 12
# fail 0
```

`npx tsc --noEmit` and global `npm run test` verified. No regressions introduced.

## Builder to Runtime Handoff - Frontend Experience (UX-NAV-02-028)

**Where the user came from:**
The user originated from the Builder environment, typically having just configured an operational process or application. They are on a deployment or testing screen in the Builder where they are ready to launch their work.

**What they do here:**
The user initiates a "Deploy to Runtime" or "Launch in Runtime" action. Based on the data state and permissions, they encounter distinct experiences:
- **Production App**: Successful deployment of real configurations to live runtime servers with clear commercial messaging.
- **Empty App**: Action is blocked/disabled, showing a "No configs to deploy" indicator.
- **Restricted/Blocked**: Action is restricted due to lack of privileges, grayed out as a "Pro Feature".
- **Demo App**: Sandboxed deployment to a demo environment.
- **Synthetic App**: Deployment of synthetic test data to a distinct synthetic runtime, properly badged to avoid confusion with live data.

**Where they go next:**
Upon a successful handoff execution, a persistent confirmation dialog appears with a "View in Runtime" action. Clicking this uses Next.js routing (`useRouter().push()`) to seamlessly transition the user directly into the active Runtime view for their deployed application.

**How they return:**
As defined in the runtime contract, from the runtime application, users with builder rights can use a persistent toolbar to "Return to Builder" to edit configurations.
