1. **Understand Goal**: Adopt safe JSON for datasets by updating `ProcessPayload` and `ActionExecution` schemas to use `SafeJsonRecordSchema` instead of `UnknownRecordSchema`.
2. **Review Context**: The issue requests safe JSON validation to prevent parsing inconsistent payloads.
3. **Execution Steps**:
   - `UnknownRecordSchema` was updated to use `SafeJsonRecordSchema` in `src/platform/workflows/runtime/types/process-payload.ts` and `src/platform/workflows/runtime/types/action-execution.ts`.
   - Update `UnknownRecordSchema` imports to include `SafeJsonRecordSchema` in the respective files.
   - Run build and unit tests to ensure no regressions. The failing tests in `tests/unit/agent-work-*` are expected environment constraints and not related to the changes made.
4. **Complete Pre-commit Steps**:
   - Run `pre_commit_instructions` and fulfill requirements.
5. **Submit Change**:
   - Commit the changes and open a PR with a description referencing #244.
