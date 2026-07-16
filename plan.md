1. **Create Identity Context Schema**: Create `src/platform/contracts/identity.ts` exporting `IdentityContextSchema` and `IdentityContext` type.
   - It should represent an identity context with `workspaceId`, `actor`, and optional `entityId`.
   - `workspaceId` should be an instance of `WorkspaceIdSchema`.
   - `actor` should be an instance of `ActorReferenceSchema`.
   - `entityId` should be an instance of `EntityIdSchema`.
   - Export this from `src/platform/contracts/index.ts`.
2. **Update tests**: Update `tests/fixtures/contracts/shared-contracts.fixtures.ts` to include valid and invalid instances of `IdentityContextSchema`.
3. **Update tests**: Update `tests/contracts/shared-contracts-audit.test.ts` to include testing for `IdentityContextSchema`.
4. **Run tests**: Run tests to ensure the changes are correct and that tests pass.
5. **Complete pre-commit steps**: Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
6. **Submit**: Create PR.
