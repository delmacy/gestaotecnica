# Menu Metadata Contract

This document explicitly defines the typed route contract, data contract, role/scope rules, states, and acceptance gates for Menu Metadata within the System Builder platform, fulfilling task UX-NAV-01-041. It establishes the typed menu metadata contract.

## User Flow Clarification

The Menu Metadata structures how users perceive and interact with the application’s capabilities.

1. **Where the user came from:**
   - The user entered the system through standard authentication mechanisms or specific deep-links and arrived at a layout surface (like the global Sidebar or an off-canvas mobile menu) that renders options based on this metadata.

2. **What they do here:**
   - The user interprets visual cues (labels, icons, status badges) driven by the menu metadata to understand the commercial structure of the platform, the availability of features, and operational modules they can access within their current workspace context.

3. **Where they go next:**
   - Based on the provided navigation options, the user selects an operational module (e.g., Tasker, Form Builder) or architecture definition module (e.g., Capabilities, Registry) to continue their workflow.

4. **How they return:**
   - Navigation surfaces remain persistently available or accessible via standardized UI controls, allowing the user to return to the core dashboard or traverse directly to a different system segment without losing spatial awareness.

## Typed Route and Data Contract

The menu metadata relies on a strongly typed backend contract (`resolveNavigationInventory`) that securely maps logical business modules to actionable application routes, avoiding hardcoded arrays on the frontend.

### The `NavigationModule` Data Structure

```typescript
export type ModuleStatus = "active" | "coming_soon" | "blocked";

export interface NavigationModule {
  href: string;         // The deterministic absolute path (e.g., "/builder/tasker")
  label: string;        // Product-oriented nomenclature (e.g., "Tasker", not "task_module_v2")
  iconName: string;     // The Lucide icon string identifier to map securely on the client
  status: ModuleStatus; // Driven by license/entitlement and RBAC
  moduleKey?: string;   // The backend permission/entitlement key mapping
}
```

The server component fetches the `WorkspaceContext` and uses it to construct a complete navigation inventory:
```typescript
interface NavigationInventory {
  activeModules: NavigationModule[];
  futureModules: NavigationModule[];
  environmentMode: "real" | "synthetic" | "demo";
}
```

## State Handling

The menu presentation reacts distinctively to application states, ensuring users always understand module context without confronting technical implementation details.

### 1. Real-Data State
- **Condition:** Standard operational environment (`environmentMode === 'real'`).
- **Outcome:** The menu fully populates active modules synchronously. Items reflect their exact authorized status without visual noise or demo badges.

### 2. Demo State
- **Condition:** Controlled environment (`environmentMode === 'demo'`).
- **Outcome:** The menu accurately displays modules, but actions driven by the menu that would modify workspace tenant structure are intercepted. A global Demo Mode indicator contextualizes the session.

### 3. Synthetic State
- **Condition:** System is running on mocked infrastructure (`environmentMode === 'synthetic'`).
- **Outcome:** Navigation structures are built using mocked `NavigationModule` payloads. The system explicitly declares it is using synthetic data boundaries (e.g., global amber warning).

### 4. Empty State
- **Condition:** No entities exist within an accessible module.
- **Outcome:** The menu remains unchanged. If the user navigates into an empty module, they are met with a product-oriented, commercial Call-To-Action (e.g., "Streamline your operations. Define your first business capability") inside the main view.

### 5. Blocked State
- **Condition:** A module is known to the system, but the current user/workspace lacks permissions (`status === 'blocked'`).
- **Outcome:** The menu renders the item with reduced opacity and restricted interaction (e.g., an "Access Denied" or "Pro Feature" tooltip). Clicking the item may trigger an upgrade intent but will not navigate to an unauthorized technical 404 page.

## Role and Scope Rules

- **Platform vs Workspace:** Modules visible in the menu are scoped to the current context. A Workspace context strictly lists workspace operational features. An Admin/Platform context lists global registry and system administration tasks.
- **Strict Typing:** All logic defining visibility relies entirely on typescript domain models (e.g., avoiding explicit `any` in routing loops) to map `iconName` to UI implementations securely across Server-Client boundaries.

## Acceptance Gates

- The metadata contract is enforced by `resolveNavigationInventory` relying strictly on the `WorkspaceContext`.
- No implicit or explicit `any` types are used in the data contract (`NavigationModule`).
- Empty, blocked, demo, synthetic, and real-data outcomes are completely distinct from an implementation perspective.
- Documentation provides product-centric messaging patterns over generic implementation-oriented technical terms.
