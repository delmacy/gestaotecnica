# Acceptance Criteria

- A pure helper covers next-step planning without requiring RuntimeDb.
- Tests cover no outgoing edge, target end node, normal next action node, and missing target node.
- advanceStep still returns the same RuntimeResult shapes for those branches.
- No repository query semantics are changed.
