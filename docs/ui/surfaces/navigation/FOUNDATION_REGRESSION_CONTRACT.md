# Navigation Foundation Regression Contract

This document explicitly defines the foundation regression contract for navigation, fulfilling the contract objective of task UX-NAV-01-046. It serves as the regression gate to ensure navigation remains robust across future implementations.

## 1. Route Contract

The route contract mandates that any navigation transition within the Shell architecture correctly resolves the `WorkspaceContext` and `NavigationModule` objects before emitting rendering signals to the browser.

### Invariants

- **Root Routing:** The base route `/builder` always resolves to the Workspace Dashboard.
- **Deep Linking:** Attempting to navigate directly to `/builder/[module]` (e.g., `/builder/tasker`) while unauthenticated must intercept and redirect to `/auth/login?redirect=/builder/[module]`.
- **Unknown Routes:** Attempting to navigate to an unknown child of `/builder/` must resolve gracefully to a platform-level `NotFound` state, preventing uncaught Next.js errors.
- **No Side Effects:** Resolving the navigation inventory must be a pure, read-only operation and must not mutate the underlying `WorkspaceContext` or database.

## 2. Data Contract

The navigation system strictly consumes data provided by the `resolveNavigationInventory(context: WorkspaceContext)` function.

### Expected Payload Structure

```typescript
export interface NavigationModule {
  href: string;         // The deterministic absolute path
  label: string;        // Product-oriented nomenclature
  iconName: string;     // The Lucide icon string identifier
  status: "active" | "coming_soon" | "blocked";
  moduleKey?: string;   // The backend permission/entitlement key mapping
}
```

- **Absence of Mock Data:** The frontend must never hallucinate fallback `NavigationModule` arrays if the backend fetch fails. It must present a designated `NavigationError` fallback UI.

## 3. Role and Scope Rules

- **Workspace Boundaries:** A user active in Workspace A (`workspaceId: A`) must never see navigation options explicitly restricted to Workspace B, even if their `actorId` holds privileges in both workspaces.
- **Entitlement Checks:** The navigation inventory explicitly maps `moduleKey` values against the `context.enabledModules` array. If an enabled module lacks a corresponding route definition, the system gracefully ignores it. If a route definition requires a module not present in `enabledModules`, its status must resolve strictly to `blocked`.

## 4. State Handlers and User Outcomes

Navigation UI components must deterministically map backend `environmentMode` and route `status` to distinct visual outcomes.

### 4.1 Empty State (Module Level)
- **User Outcome:** The navigation sidebar/topbar is fully rendered. The module's content area shows a commercial call-to-action to begin working, explicitly telling the user *what to do here* and *where they go next*.

### 4.2 Blocked State
- **User Outcome:** Visible in the navigation menu but visually distinct (e.g., reduced opacity, restricted cursor).
- **Behavior:** Clicking a blocked module does *not* navigate away from the current page, ensuring the user is not sent to a dead end. Instead, a contextual "Pro Feature" tooltip or upgrade modal is presented.

### 4.3 Demo State
- **Condition:** `environmentMode === "demo"`
- **User Outcome:** A global, unmistakable "Demo Mode" badge is pinned to the Topbar. All navigation items remain active, but destructive nested actions (e.g., deleting the workspace) are gracefully intercepted with context-aware tooltips.

### 4.4 Synthetic State
- **Condition:** `environmentMode === "synthetic"`
- **User Outcome:** A global amber indicator contextualizes the session. The user is explicitly warned that data structures are mocked and any changes will not persist.

### 4.5 Real Data State
- **Condition:** `environmentMode === "real"`
- **User Outcome:** The application operates silently without contextual warning badges.

## 5. Acceptance Gates for Implementation

Before any subsequent task considers the navigation regression suite complete, the following gates must be validated:

1. **Test Coverage:** All distinct states (Real, Synthetic, Demo, Blocked, Active) must have corresponding unit test coverage against `resolveNavigationInventory`.
2. **Strict Typing:** No explicit `any` types can be introduced in the routing logic, payloads, or context parsing.
3. **Responsive Verification:** The UI layout driven by this data contract must be visually verified across desktop and mobile breakpoints (via Playwright or explicit review).
