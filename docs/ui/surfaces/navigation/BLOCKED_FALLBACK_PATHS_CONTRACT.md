# Blocked, Error, and Fallback Paths Contract

This document acts as the master contract for handling Blocked, Error, and Fallback Paths within the System Builder platform's navigation architecture, fulfilling task UX-NAV-02-036. It defines the route contract, data contract, role/scope rules, states, and acceptance gates prior to implementation.

## Overview

The Blocked, Error, and Fallback Paths model dictates how the system safely and predictably handles navigation failures, unauthorized access attempts, missing data, and broken workflows. The objective is to prevent users from encountering raw technical errors or dead ends by ensuring every failure state provides a safe, logical recovery path.

- **Objective:** Establish standard routing, interception, and data-handling logic for navigation errors, blocked authorization, missing entities, and invalid states.
- **Language:** User-facing terminology is strictly commercial and product-oriented (e.g., "Access Restricted", "Configuration Unavailable", "Return to Workspace"), avoiding internal implementation jargon like "403 Forbidden", "Null Reference", or "Failed to fetch".

## User Flow Clarification

This contract explicitly maps the core decision points in the failure and fallback journey:

1. **Where the user came from:**
   - The user attempted an action or navigated to a route (e.g., clicking a restricted link, attempting to access a deleted capability, encountering a network error, or trying to perform an action blocked by their role).

2. **What they do here:**
   - The system intercepts the request and determines it cannot be fulfilled (due to authorization, missing data, or system error).
   - The user is presented with a clear, contextual Blocked/Error state view instead of the requested resource.

3. **Where they go next (Fallback Destinations):**
   - The system must provide a primary fallback action based on the context:
     - **Unauthorized/Blocked:** Route back to the immediate parent context, the Workspace Dashboard, or the Platform Dashboard.
     - **Not Found (Missing Entity):** Route back to the aggregate list view for that entity type (e.g., failing to load `/builder/capabilities/123` routes back to `/builder/capabilities`).
     - **System Error/Crash:** Route to a safe global fallback (Dashboard) with an option to retry or contact support.

4. **How they return:**
   - The fallback state must include explicit primary actions (e.g., a "Return to Dashboard" button) and retain the structural navigation (Sidebar, Breadcrumbs) if possible, allowing users to utilize standard return paths to regain their bearings.

## Route & Data Contract

- **Interception Model:** Next.js Error Boundaries (`error.tsx`), Not Found handlers (`not-found.tsx`), and route-level authorization checks are used to intercept failures.
- **Core Fallback Resolutions:**
  - `401 Unauthorized` -> Redirect to `/auth/login` (preserving the intent `?returnTo=...`)
  - `403 Forbidden (Workspace Context)` -> Intercepted at `/builder/...`. Render polite "Access Restricted" view. Fallback action: Navigate to `/builder`.
  - `403 Forbidden (Platform Context)` -> Intercepted at `/admin/...`. Render polite "Platform Access Restricted" view. Fallback action: Navigate to `/admin`.
  - `404 Not Found (Entity)` -> Intercepted at `/builder/[module]/[id]`. Render "Configuration Unavailable". Fallback action: Navigate to `/builder/[module]`.
  - `500 System Error` -> Caught by Error Boundary. Render "Temporary Disruption". Fallback action: Retry or navigate to Dashboard.

## State Handling

The fallback model must adapt dynamically to the system's operational state to ensure a clear user-facing outcome:

### 1. Empty State
- **Condition:** An error or fallback occurs in a module that is currently empty.
- **Outcome:** If a fallback routes a user to an aggregate list that happens to be empty, the standard Empty State Contract takes over (e.g., "Ready to build your first capability?").

### 2. Blocked State (The Primary Focus)
- **Condition:** The user lacks permissions for a route or action.
- **Outcome:** The UI explicitly states the restriction in commercial terms (e.g., "This configuration requires Workspace Admin privileges.") and provides a clear fallback path to a verified safe origin, never exposing raw HTTP codes or stack traces.

### 3. Demo State
- **Condition:** Operating in a pre-configured showcase environment (`environmentMode: 'demo'`).
- **Outcome:** If a user attempts a destructive or restricted action within the demo, it is intercepted smoothly. Instead of an error, they receive a localized notification: "Action restricted in Demo Simulation. No changes were made." They are kept in their current context rather than being forced to a fallback route, maintaining the demonstration flow.

### 4. Synthetic Data State
- **Condition:** Environment utilizes mocked data (`environmentMode: 'synthetic'`).
- **Outcome:** Errors (like 404s for non-existent synthetic IDs) trigger the standard fallback paths. The amber "Synthetic Mode" indicator remains visible on the error and fallback views.

### 5. Real-Data State
- **Condition:** Connected to a live, persistent backend.
- **Outcome:** Full enforcement of the Blocked/Fallback contract based on actual database responses and active RBAC permissions.

## Role & Scope Rules

- **Scope Isolation:** Fallback paths must never cross scope boundaries unintentionally. A blocked action within a Workspace (`/builder`) must fallback to a safe view *within that same Workspace*. It must not eject the user to the global `/admin` context unless their session is entirely invalid.
- **Graceful Degradation:** If a user's role is demoted while they are actively viewing a now-restricted page, subsequent interactions (or the next page load) must gracefully intercept the action and apply the Blocked fallback path, returning them to a permitted aggregate view.

## Acceptance Gates and Test Expectations

Before implementation is considered complete, the following validation evidence must be presented:

- [ ] Implementation explicitly defines the user journey (origin, action, fallback destination, return mechanism) for authorization and missing data failures.
- [ ] Fallback routing correctly differentiates between Workspace and Platform scopes, preventing accidental cross-scope bleed on error.
- [ ] User-facing language on error/blocked views is strictly commercial/product-oriented (no 403, 404, or 500 error codes exposed in the UI text).
- [ ] Interactions remain responsive and accessible on desktop and mobile viewports.
- [ ] Focused tests or documented validation evidence confirm that navigating to a restricted or non-existent entity route safely redirects or renders the correct fallback view.
- [ ] Pipeline discipline is respected: this task completes only the contract definition for Blocked/error/fallback paths.
