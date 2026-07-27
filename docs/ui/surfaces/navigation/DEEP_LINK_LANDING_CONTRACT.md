# Deep-link Landing Behavior Contract

This document acts as the master contract for handling Deep-link landing behavior within the System Builder platform's navigation architecture, fulfilling task UX-NAV-02-041. It defines the route contract, data contract, role/scope rules, states, and acceptance gates prior to implementation.

## Overview

The Deep-link landing behavior model governs how the application handles users entering the system via direct URLs (deep links) rather than organic navigation from the root or dashboard. This includes links from emails, external systems, saved bookmarks, or shared messages. The objective is to securely, predictably, and contextually resolve these entry points, ensuring users land in the correct state with proper authorization, context initialization (workspace/platform), and valid fallback mechanisms if the deep link cannot be fulfilled.

- **Objective:** Establish standard routing, interception, context hydration, and data-handling logic for direct URL entry points.
- **Language:** User-facing terminology is strictly commercial and product-oriented (e.g., "Verifying your destination", "Preparing workspace", "Link expired or unavailable"), avoiding internal implementation jargon like "Hydration mismatch", "Session check", or "401 Redirect loop".

## User Flow Clarification

This contract explicitly maps the core decision points in the deep-link journey:

1. **Where the user came from:**
   - The user initiated entry via a direct URL provided externally (email, notification, bookmark, sharing). They are bypassing the standard entry funnel.

2. **What they do here:**
   - The system intercepts the direct URL request before rendering the destination.
   - It assesses authentication status, authorization (role/scope for the targeted resource), and the validity of the requested entity (does it exist?).
   - A brief transition state (e.g., "Verifying your destination...") may be shown if resolving the link requires significant asynchronous checks.

3. **Where they go next (Resolutions):**
   - **Valid & Authorized:** The system fully hydrates the necessary context (e.g., selecting the appropriate workspace implicitly if required by the resource) and routes the user directly to the deep-linked view (e.g., a specific capability detail or analysis report).
   - **Unauthenticated:** The user is redirected to the login flow (`/auth/login`), with the original deep link preserved as a `returnTo` parameter for post-login redirection.
   - **Unauthorized (Role/Scope):** The user lands on a contextual "Access Restricted" view. They are offered a primary action to navigate to their default Workspace Dashboard or Platform Dashboard, depending on their base role.
   - **Invalid/Missing Entity (404):** The user lands on a contextual "Configuration Unavailable" or "Link Expired" view. The fallback action routes them to the aggregate list of that entity type (e.g., if `/builder/capabilities/999` is missing, route to `/builder/capabilities`).

4. **How they return:**
   - Once successfully landed via a deep link, the standard navigation chromes (Sidebar, Breadcrumbs) must be fully initialized. The user is not trapped; they can use standard Return Paths (e.g., clicking "Back to Capabilities" in the breadcrumb) to navigate up the hierarchy, just as if they had navigated there organically.

## Route & Data Contract

- **Interception Model:** Middleware (`middleware.ts`), layout-level session checks, and route-level authorization/data-fetching are used to process the deep link.
- **Data Resolution:**
  - `intent`: The system captures the full original URL path and query parameters upon entry.
  - `context_hydration`: If the deep link targets a specific workspace resource, the system must automatically set that workspace as the "active" context before rendering the view.
- **Resolution Matrix:**
  - `Condition: No Session` -> Action: Redirect to `/auth/login?returnTo=[URL_ENCODED_DEEP_LINK]`
  - `Condition: Session Valid, Valid Entity, Authorized` -> Action: Hydrate context (Workspace/Platform), render target route.
  - `Condition: Session Valid, Unauthorized` -> Action: Fallback to Blocked Path (Workspace/Platform restricted).
  - `Condition: Session Valid, Entity Missing` -> Action: Fallback to Not Found Path (Entity aggregate).

## Role, Scope & Constraints

- **Security Constraint:** Deep links must never bypass authorization checks. An authenticated user clicking a link to a workspace they do not belong to must be blocked.
- **Platform Scope (Admin):** Platform-level deep links (`/admin/...`) require explicit Admin roles. Regular users attempting to use these links will hit a Platform Blocked Path.
- **Workspace Scope (Builder):** Workspace-level deep links (`/builder/...`) require the user to be a member of the targeted workspace. The system must implicitly switch the user's active workspace context to match the link's target if authorized.

## States

- **Empty State:** Not applicable to the routing resolution, but the target view may be empty.
- **Blocked State:** User lacks authorization for the deep link target. See Blocked, Error, and Fallback Paths Contract.
- **Demo/Synthetic State:** If the system is in demo mode, deep links should resolve using synthetic data seamlessly, ensuring the demo experience remains cohesive.
- **Real-Data State:** Links resolve against live production/development data subject to strict authorization.

## Acceptance Gates

- **Gate 1:** Unauthenticated users clicking a deep link are routed to login, and upon successful login, are redirected to the original deep link destination.
- **Gate 2:** Authenticated users clicking an authorized deep link land on the target view with the correct structural navigation (breadcrumbs, sidebar) fully populated.
- **Gate 3:** Authenticated users clicking an unauthorized deep link land on a safe fallback path (e.g., Access Restricted) and are not trapped.
- **Gate 4:** The user flow (origins, actions, next steps, returns) is explicitly documented in commercial language.
