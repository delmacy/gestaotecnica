# UX-NAV-03-028-approval-decision-advance-integration-binding - Approval decision advances real workflow - End-to-end binding

        Implement the end-to-end binding stage for `Approval decision advances real workflow` in UX-NAV-03.

This is a vertical product-slice task, not an isolated internal cleanup. Preserve the through-line from persisted data and domain rules to the visible user journey. If this stage does not need one layer, record why in the PR evidence and point to the adjacent stage that owns it.

Stage objective: Connect database, domain, contract, use case, and UI so the screen no longer relies on isolated logic or hidden mock fallback.

Required product proof:
- Identify the route/screen/menu/button affected.
- Identify the database/persistence object, domain object, contract, use case/API path, or validation evidence touched by this stage.
- Explain how the user reaches the screen, what they do, where they go next, and how they return.
- Record real-data proof or a precise blocker instead of substituting fake demo success.
