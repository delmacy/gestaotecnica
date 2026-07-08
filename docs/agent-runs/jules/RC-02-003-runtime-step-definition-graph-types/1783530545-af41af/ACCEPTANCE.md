# Acceptance Criteria

- extractNodesAndEdges no longer accepts definitionJson: any.
- No edges.filter((e: any) => ...) or nodes.find((n: any) => ...) remains in runtime-step.service.ts.
- New tests cover root-level nodes/edges, draft.nodes/draft.edges, and missing graph fallback to empty arrays.
- advanceStep public behavior is preserved.
