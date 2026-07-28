# UX-NAV-03-011-form-submit-to-work-database - Form submit creates and returns work status - Database/persistence foundation

        Implement the database/persistence foundation stage for `Form submit creates and returns work status` in UX-NAV-03.

This is a vertical product-slice task, not an isolated internal cleanup. Preserve the through-line from persisted data and domain rules to the visible user journey. If this stage does not need one layer, record why in the PR evidence and point to the adjacent stage that owns it.

Stage objective: Create or bind the persistent storage needed for this product slice: tables, migrations, repositories, seed/read fixtures, least-privilege access checks, and rollback-safe notes.

Required product proof:
- Identify the route/screen/menu/button affected.
- Identify the database/persistence object, domain object, contract, use case/API path, or validation evidence touched by this stage.
- Explain how the user reaches the screen, what they do, where they go next, and how they return.
- Record real-data proof or a precise blocker instead of substituting fake demo success.
