# Acceptance Criteria

- Action validates input before calling `getTimelineForInstance`.
- Invalid input returns `{ ok: false, error: { code: "INVALID_INPUT", ... } }`.
- No DB call is made before successful validation.
