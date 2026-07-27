Base SHA: 91e1f116b3e1766edd40d6586559dbfbf28f80e1

## User Journey
- **Where the user came from:** The user initiated a multi-step journey via an explicit primary action, or was routed via a deep link.
- **What they do here:** The user progresses through sequenced steps. The system validates input, preserves context between steps, and ensures the user is authorized.
- **Where they go next:** Depending on the resolution: Successful Completion routes to the logical Success Next-Step Destination; Saved Draft routes to Dashboard/List view with confirmation; Discarded routes back to origin.
- **How they return:** During the journey, users can use Return Paths (Back, Cancel). After completion/pause, standard structural navigation is available.

## Constraints
- Pipeline discipline is respected, running focused playwright test `tests/e2e/journey-logic-ui.spec.ts` bypassing layout due to unseeded database in test env.
- Node.js 24 is used for type checking and testing.
