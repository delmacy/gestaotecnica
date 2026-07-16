# Blocker: CanonicalEventSchema Divergence

The task requires re-exporting or moving `CanonicalEventSchema`, `ActionExecutionSchema`, and `ProcessInstanceSchema` into the platform/workflow contract boundary, and strictly states: "no duplicate schema source is introduced".

However, there is an unresolvable structural divergence between the two existing `CanonicalEventSchema` definitions in the codebase:

1. `src/platform/events/canonical-contract.ts` defines:
   - `id`
   - `entityType`
   - `entityId`
   - `actorId`

2. `src/platform/events/types/canonical-event.ts` defines:
   - `eventId`
   - `subjectType`
   - `subjectId`
   - `actor`

Attempting to consolidate these schemas or map their fields manually to resolve the duplicate schema sources causes compilation errors and broad regressions, which is forbidden. Therefore, I am filing this blocker and aborting code modifications for this task.
