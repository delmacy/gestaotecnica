# Primary Action and Next-Step Model Contract

This document serves as the master contract for the Primary Action and Next-Step Model within the System Builder platform's navigation architecture, fulfilling task UX-NAV-01-031. It defines the route contract, data contract, role/scope rules, states, and acceptance gates prior to implementation.

## Overview

The Primary Action and Next-Step Model orchestrates how users discover, initiate, and proceed through core workflows within the System Builder (e.g., creating a capability, starting a process mirroring intake). It ensures a predictable, context-aware call-to-action (CTA) strategy that bridges the gap between static navigation (like the Sidebar) and active task execution.

- **Objective:** Define a consistent framework for primary actions and logical next steps that prevents user dead ends, clarifies operational context, and smoothly handles edge cases like insufficient permissions or missing data.
- **Language:** User-facing terminology is strictly commercial and product-oriented (e.g., "Initiate Analysis", "Define Capability", "Proceed to Approval"), avoiding internal implementation jargon.

## User Flow Clarification

This contract explicitly maps the core decision points in the user journey:

1. **Where the user came from:**
   - Users arrive at a primary action surface (e.g., a dashboard or empty module view) via global navigation (Sidebar, Breadcrumbs) or direct links. They enter expecting to accomplish a specific operational objective (e.g., "I need to log a new task").

2. **What they do here:**
   - The user evaluates the context. The primary action (e.g., a prominent "New Task" button) is singular, clear, and unambiguous on any given view, drawing immediate focus without competing with secondary actions.

3. **Where they go next:**
   - Activating the primary action transitions the user smoothly to the execution context (e.g., opening a creation modal, navigating to a multi-step form route, or transitioning from a list view to a detail edit view). The system anticipates the logical next step.

4. **How they return:**
   - Following a primary action sequence (e.g., completing a form), the system automatically routes the user to the most logical success context (e.g., the newly created entity's detail page or back to the aggregate list with a success toast). Breadcrumbs and the "Cancel/Back" secondary actions provide manual escape hatches during execution.

## Route & Data Contract

- **Primary Action Positioning:** Primary actions are contextually bound. In a list view, the action (e.g., "Create") sits in the Topbar or header area. Within an entity detail view, primary actions pertain to moving the entity's state forward (e.g., "Submit for Review").
- **Next-Step Resolution:** Next steps after an action are driven by the backend state machine or entity lifecycle definition, not hardcoded frontend flows. For instance, successfully creating a Process Mirroring intake should return an ID that the frontend uses to dynamically route the user to `/builder/process-mirroring/[id]`.

## State Handling

The primary action model must adapt dynamically to the system's operational state to ensure a clear user-facing outcome:

### 1. Empty State
- **Condition:** Navigating to a module with no existing records.
- **Outcome:** The primary action takes center stage as a commercial call-to-action in the main view (e.g., an empty state illustration with a prominent "Register your first tenant workspace" button). The standard topbar action may be hidden to focus attention on the central CTA.

### 2. Blocked State
- **Condition:** The user lacks the required role or license to perform the primary action in the current context.
- **Outcome:** The primary action button remains visible but is disabled (reduced opacity). A clear, polite tooltip explains the restriction (e.g., "Requires Pro License" or "Only Admins can perform this action"). The action never disappears silently, preserving the UI's predictability.

### 3. Demo State
- **Condition:** Operating in a pre-configured showcase environment (`environmentMode: 'demo'`).
- **Outcome:** Primary actions that result in destructive mutations (like deleting a core capability) are disabled or intercepted with a graceful "Action restricted in Demo Mode" modal. Non-destructive actions (like "Start Analysis") function normally to demonstrate value. The global "Demo Mode" badge provides context.

### 4. Synthetic Data State
- **Condition:** Environment utilizes mocked data (`data_source_mode: 'synthetic'`).
- **Outcome:** Primary actions function identically to the Real-Data State, allowing the user to experience the full interaction model. The amber "Synthetic Mode" indicator remains the global warning mechanism.

### 5. Real-Data State
- **Condition:** Connected to a live, persistent backend.
- **Outcome:** Primary actions immediately trigger genuine state changes. Transitions to next steps incorporate proper loading indicators (e.g., button spinners) to prevent double-submissions, followed by clear success/error routing.

## Role/Scope Rules

- **Platform vs. Workspace Alignment:** Primary actions strictly obey the active scope. Actions triggered in `/builder` (Workspace context) only affect that tenant. Actions in `/admin` (Platform context) affect the global system.
- **Role-Based Disabling:** The `WorkspaceContext` and specific entity permissions dictate whether a primary action is active or in a Blocked State. The UI reads these permissions from the backend contract; it does not hardcode role logic on the client.

## Responsive Design

- **Desktop:** Primary actions are prominently displayed in their designated areas (e.g., top right of the module header).
- **Mobile/Tablet:** If horizontal space is constrained, the primary action may transform into a sticky floating action button (FAB) or move into a simplified mobile header, ensuring it remains easily accessible without dominating the screen content.

## Acceptance Gates and Test Expectations

Before implementation is considered complete, the following validation evidence must be presented:

- **E2E Next-Step Verification:** Playwright tests must verify that triggering a primary action (e.g., clicking "Create") and completing the required input successfully routes the user to the logical next step (e.g., the detail view of the new entity).
- **Blocked State Validation:** Tests must assert that a user lacking permissions sees the disabled primary action with the correct commercial tooltip, rather than a hidden button or an actionable button that throws an unhandled error.
- **Empty State CTA Verification:** Tests must confirm that in an empty module, the primary action is prominently featured in the central content area.
- **Responsive Validation:** Automated visual tests must assert that primary actions adapt correctly (e.g., to a FAB or simplified header) on mobile viewports.