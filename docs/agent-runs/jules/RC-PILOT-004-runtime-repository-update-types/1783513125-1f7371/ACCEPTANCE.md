# Acceptance Criteria

- No updateData: any remains in runtime.repository.ts.
- updateActionExecutionStatus still conditionally sets outputPayload, error, and finishedAt only when provided.
- No query where clauses are changed.
- No schema/migration files are changed.
