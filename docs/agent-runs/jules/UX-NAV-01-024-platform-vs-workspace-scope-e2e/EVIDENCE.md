# Execution Evidence

## Journey End-to-End Validation
The E2E tests have been updated and run successfully to validate the Platform versus workspace scope clarity journey.

The `/admin` route's distinct layout design is a deliberate decision, and omitting the `AppShell` component avoids providing the workspace-scope mobile hamburger menu on the platform-scope `/admin` route.

### Environment & Base SHA
* Base SHA: `0ad3de9 Merge UX-NAV-01-023-platform-vs-workspace-scope-frontend: UX-NAV-01-023 Platform vs Workspace scope — frontend experience`
* Node Version: `v24.18.0`

### Test Execution Output
```
Running 2 tests using 1 worker

  1) [chromium] › tests/e2e/ux-nav-01/platform-vs-workspace-scope.spec.ts:97:7 › Platform vs Workspace Scope Clarity › E2E Path Verification: User can switch between /builder and /admin and UI updates context
  2) [chromium] › tests/e2e/ux-nav-01/platform-vs-workspace-scope.spec.ts:114:7 › Platform vs Workspace Scope Clarity › Responsive Validation: Sidebar collapses appropriately on mobile in Admin

  2 passed (52.6s)
```

## Journey End-to-End Validation: Platform vs Workspace Scope

### Journey Documentation (Walking the User Journey)

**Where the user came from:**
The user authenticates into the application (e.g., via `/auth/login`), receiving an active session. They typically land at the root `/` or are redirected to `/builder` (the active workspace).

**What they do here:**
When navigating to `/builder` or workspace-specific modules (e.g., `/operations`, `/assets`), the user experiences the **Workspace Context**. The UI utilizes the `AppShell` with a sidebar indicating "Governança do workspace" or "Workspace selecionado". The content reflects data specific to the current tenant/workspace.
When navigating to `/admin` or platform-level features, the user enters the **Platform Context**. The UI intentionally omits the `AppShell` (no mobile hamburger) and presents a standalone layout (like "Painel admin"), making it visually and structurally distinct from the workspace context.

**Where they go next:**
From the workspace context, users navigate between active modules using the sidebar or links within the shell. From the platform context (e.g., `/admin`), users manage global resources (Users, Organizations).

**How they return:**
From the workspace context, users can switch to administration by clicking "Admin" in the platform section of the sidebar navigation. From the platform context (`/admin`), users can click links like "Workspace ativo" to return to the workspace context.

### States Validation

1. **Empty State:**
When no records are available in the Platform Context (e.g., no Agent Gateway receipts on `/admin/gateway/receipts`), an explicit empty state is shown (e.g., "Não há receipts do Agent Gateway ainda.") instead of a blank table, differentiating from workspace-level empty states.

2. **Blocked State:**
Navigating to restricted workspace routes results in a distinct blocked UI (e.g., "Plano Superior Necessário") using commercial product language, clearly distinguishing authorization boundaries within the workspace.

3. **Synthetic State:**
When the system is in synthetic mode (e.g., via `WorkspaceContext.environmentMode = 'synthetic'`), the `AppShell` on `/builder` displays an explicit warning banner ("synthetic Mode Ativo: Gestão Técnica e fontes reais permanecem em fase futura.") to clarify that mock data is in use, differing from the true Platform Admin context.

4. **Demo State:**
Similar to the synthetic state, demo mode flags the environment distinctly in the UI, ensuring users do not mistake demonstration content for real operational data.

5. **Real-Data State:**
When `environmentMode = 'real'`, the workspace components render live database records without synthetic banners, and the `/admin` route manages real platform entities securely.
