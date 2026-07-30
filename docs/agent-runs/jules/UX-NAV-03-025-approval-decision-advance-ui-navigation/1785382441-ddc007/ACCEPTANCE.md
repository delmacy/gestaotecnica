# Acceptance Criteria

- This task advances the full-stack product slice: Approval decision advances real workflow.
- Stage outcome: UI navigation surface. User can see where they came from, what to do, where to go next, and how to return.
- The PR evidence names the route/screen affected and the persisted data path used or honestly blocked.
- Empty, blocked, demo, synthetic, and real-data states remain distinct in user-facing outcomes.
- User-facing language is commercial/product oriented, not implementation-training oriented.
- No fake assertions, no hidden mock fallback, and no unlabeled synthetic data.
- Builder-originated evidence identifies organization, selected workspace, working mode, destination, and return path.
- Persisted reads and mutations use the selected workspace context; UI may not silently fall back to sala-tecnica, demo, or synthetic data.
