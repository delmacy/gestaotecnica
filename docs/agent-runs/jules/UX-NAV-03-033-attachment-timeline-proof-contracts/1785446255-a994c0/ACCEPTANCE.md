# Acceptance Criteria

- This task advances the full-stack product slice: Attachments and timeline show proof of work.
- Stage outcome: Contracts and DTOs. Contract is explicit, reusable, type-safe, and prevents synthetic data from being presented as real.
- The PR evidence names the route/screen affected and the persisted data path used or honestly blocked.
- Empty, blocked, demo, synthetic, and real-data states remain distinct in user-facing outcomes.
- User-facing language is commercial/product oriented, not implementation-training oriented.
- No fake assertions, no hidden mock fallback, and no unlabeled synthetic data.
- Builder-originated evidence identifies organization, selected workspace, working mode, destination, and return path.
- Persisted reads and mutations use the selected workspace context; UI may not silently fall back to sala-tecnica, demo, or synthetic data.
