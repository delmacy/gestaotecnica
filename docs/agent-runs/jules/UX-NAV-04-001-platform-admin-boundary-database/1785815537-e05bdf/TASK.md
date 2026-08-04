# UX-NAV-04-001-platform-admin-boundary-database - Builder identity, organization portfolio, and durable workspace selection - Database/persistence foundation

        Implement the database/persistence foundation stage for `Platform admin boundary with real tenant state` in UX-NAV-04.

This is a vertical product-slice task, not an isolated internal cleanup. Preserve the through-line from persisted data and domain rules to the visible user journey. If this stage does not need one layer, record why in the PR evidence and point to the adjacent stage that owns it.

Stage objective: Create or bind the persistent storage needed for this product slice: tables, migrations, repositories, seed/read fixtures, least-privilege access checks, and rollback-safe notes.

Required product proof:
- Identify the route/screen/menu/button affected.
- Identify the database/persistence object, domain object, contract, use case/API path, or validation evidence touched by this stage.
- Explain how the user reaches the screen, what they do, where they go next, and how they return.
- Record real-data proof or a precise blocker instead of substituting fake demo success.
