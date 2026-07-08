# Acceptance Criteria

- runtime.actions.ts has no db as any casts.
- RuntimeDb is used as the explicit boundary type for getRuntimeDb output.
- Mock workspaceId and userId constants remain unchanged.
- No auth, workspace isolation, DB schema, or UI behavior is introduced.
