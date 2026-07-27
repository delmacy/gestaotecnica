# Journey Logic Regression Contract

This document acts as the master contract for handling the Journey Logic regression gate within the System Builder platform's navigation architecture, fulfilling task UX-NAV-02-046. It defines the route contract, data contract, role/scope rules, states, and acceptance gates prior to implementation.

## Overview

The Journey Logic regression gate governs the end-to-end navigational flows (journeys) across the platform. It ensures that any given multi-step flow, wizard, or interconnected set of tasks retains its logical sequence, context preservation, and state boundaries. The objective is to securely, predictably, and contextually manage these journeys without regressions when platform changes occur.

- **Objective:** Establish standard routing, state persistence, context hydration, and data-handling logic for multi-step user journeys.
- **Language:** User-facing terminology is strictly commercial and product-oriented (e.g., "Continuing your setup", "Saving progress", "Workflow unavailable"), avoiding internal implementation jargon like "State mismatch", "Context error", or "500 Journey failed".

## User Flow Clarification

This contract explicitly maps the core decision points in the platform's multi-step journeys:

1. **Where the user came from:**
   - The user initiated a multi-step journey (e.g., setting up a new capability, configuring a module) via an explicit primary action on a Dashboard or List view, or was routed here via a deep link specifically meant for workflow continuation.

2. **What they do here:**
   - The user progresses through distinct, sequenced steps.
   - The system validates input, preserves context between steps, and ensures the user is authorized to perform the operations within each step of the journey.
   - The system intercepts premature exits and offers explicit options to save or discard progress.

3. **Where they go next (Resolutions):**
   - **Successful Completion:** The system fully commits the journey's data and routes the user to the logical Success Next-Step Destination (e.g., the detail view of the newly created entity), with a commercial confirmation message.
   - **Saved Draft:** The user opts to pause. The system persists the journey state and routes the user to their Dashboard or List view with a "Draft saved" confirmation.
   - **Discarded/Cancelled:** The user explicitly discards the journey. The system routes them back to the point of origin (Cancel/Back Behavior) with no side effects.

4. **How they return:**
   - During the journey, the user can use standard Return Paths (e.g., "Back to Previous Step", or "Cancel Setup") to navigate backward. Once the journey is completed or paused, standard structural navigation (breadcrumbs, sidebar) is fully available, and the user can return to their point of origin seamlessly.

## Route & Data Contract

- **State Model:** Journey state (`JourneyContext`) must be preserved securely across steps, either via backend draft persistence or secure, validated client-side storage, ensuring no data loss on page refresh.
- **Route Structure:** Journey steps are deterministically routed (e.g., `/builder/[module]/journey/[journeyId]/step/[stepId]`).
- **Data Resolution:**
  - `journey_hydration`: Upon entering a step, the system must hydrate the `JourneyContext` to render the correct view and populate existing data.
  - `validation`: Each transition requires strict input validation before allowing progression to the next step.

## Role, Scope & Constraints

- **Security Constraint:** Journey endpoints must never bypass authorization checks. An authenticated user attempting to access or modify a journey belonging to another workspace must be blocked.
- **Workspace Scope (Builder):** Journey routes (`/builder/...`) require the user to have adequate permissions within the targeted workspace to perform the journey's actions.

## States

- **Empty State:** A journey might start empty. The UI must provide clear, guided onboarding within the first step, explicitly telling the user what is needed to proceed.
- **Blocked State:** If a user lacks authorization for a specific step or the entire journey, they are presented with a contextual "Access Restricted" view. The fallback action routes them safely away from the journey without trapping them.
- **Demo State:** In a demo environment (`environmentMode: 'demo'`), the journey proceeds simulating real interactions but does not persist final changes to a live backend. Success transitions simulate completion.
- **Synthetic Data State:** In a synthetic environment (`environmentMode: 'synthetic'`), the journey functions with mock data. The global amber "Synthetic Mode" indicator remains visible to contextualize the session.
- **Real-Data State:** Journeys operate against live production/development data, subject to strict authorization and transaction commits.

## Acceptance Gates

- **Gate 1:** Journey initiation correctly creates a trackable context and routes the user to the first step.
- **Gate 2:** User can progress forward and backward between steps with state preservation and no data loss.
- **Gate 3:** Journey cancellation or completion correctly resolves to the appropriate fallback or success destination, clearing or committing the state respectively.
- **Gate 4:** Empty, blocked, demo, synthetic, and real-data states have distinct, tested user-facing outcomes.
- **Gate 5:** All navigation remains fully responsive and accessible on both desktop and mobile breakpoints.
