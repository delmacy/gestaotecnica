# Acceptance Criteria

- `getTimelineForInstanceAction` has an explicit `Promise<RuntimeResult<EventRecord[]>>`-compatible return type.
- Success returns `{ ok: true, data: events }`.
- Internal failures still return `INTERNAL_ERROR`.
