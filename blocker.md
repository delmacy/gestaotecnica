# Blocker: CanonicalEventSchema Divergence

The task requests consolidating `CanonicalEventSchema` into a single source of truth under `src/platform/events/` and removing duplicate contract definitions.

However, the two existing schemas diverge significantly in shape and cannot be consolidated via re-export without changing runtime behavior or causing compilation errors.

## Evidence

`src/platform/events/canonical-contract.ts` defines properties such as `id`, `entityType`, `entityId`, and `actorId`.

`src/platform/events/types/canonical-event.ts` defines completely different properties, including `eventId`, `eventVersion`, `subjectType`, `subjectId`, `source`, and `actor`.

Following the operational memory guideline: *"When tasked with consolidating schemas or contracts (e.g., via re-export), if the types diverge in shape and cause compilation errors, do NOT attempt to manually merge fields or migrate field names to bypass the errors. Revert the code changes, restore a clean working tree, and file a blocker document (e.g., `blocker.md`) explaining the divergence, committing only the blocker documentation."*

I am halting consolidation and filing this blocker document.
