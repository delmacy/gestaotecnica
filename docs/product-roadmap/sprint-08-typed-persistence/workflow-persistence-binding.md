# CL-03-005 Workflow Persistence Binding

This task completes the persistence layer binding for workflow (process) definitions and versions by:
1. Creating `WorkflowPersistencePort` interface under `src/platform/workflows/persistence/ports/`.
2. Implementing `InMemoryWorkflowRepository` for in-memory operations under `src/platform/workflows/persistence/repositories/`.
3. Creating the production `WorkflowRepository` under `src/platform/workflows/infra/` mapping to `processDefinitions` and `processVersions` in Drizzle.
4. Adding `tests/unit/platform/workflows/persistence/repositories/workflow-repository.test.ts` to assert that DB operations are strictly isolated by `workspaceId`.

Allowed files modified/created:
- `src/platform/workflows/persistence/ports/workflow-persistence.port.ts`
- `src/platform/workflows/persistence/repositories/in-memory-workflow.repository.ts`
- `src/platform/workflows/infra/workflow.repository.ts`
- `tests/unit/platform/workflows/persistence/repositories/workflow-repository.test.ts`
