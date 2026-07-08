# Acceptance Criteria

- mapProcessInstanceRow, mapProcessPayloadRow, and mapActionExecutionRow no longer accept row: any.
- Null row handling remains compatible with existing tests.
- Repository query semantics are unchanged.
- No schema/migration files are changed.
