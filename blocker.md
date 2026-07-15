I attempted to consolidate CanonicalEventSchema into a single source of truth by standardizing on `src/platform/events/types/canonical-event.ts`.

Steps taken:
1. Moved `types/canonical-event.ts` to `src/platform/events/canonical-event.ts`.
2. Converted `canonical-contract.ts` to simply export `{ CanonicalEventSchema } from './canonical-event'`.
3. Updated all imports in tests and other platform contracts.

However, the shapes of the two schemas diverge. `canonical-contract.ts` exports `CanonicalEvent` with fields like `id`, `entityId`, and `actorId`. The detailed envelope in `canonical-event.ts` uses `eventId`, `subjectId`, and `actor`.

When I applied the re-export approach, `src/platform/events/event-writer.ts` (and its corresponding tests like `tests/platform/events/event-writer-idempotency.test.ts`) failed to compile because they explicitly rely on the older `id`/`entityId` field names.

Per the Governor instructions: "If the re-export approach doesn't compile because the types diverge in shape, stop and file a blocker — do not attempt a migration of field names within this PR."

Therefore, I am stopping here. I have restored the working tree to a clean state. The tests and checks passed on the baseline code. I will now submit the task as a no-op due to this blocker.
