### Base SHA
`494dea0eb0bb019b941df7ca5d0b9ebd277380e3`

### Work done
* Established the Workspace and Client Context Switching Contract documentation at `docs/ui/surfaces/navigation/WORKSPACE_SWITCHING_CONTRACT.md` correctly answering required acceptance criteria.
* Stored backend typescript resolution functions for the schema under `src/app/api/builder/navigation/workspace-switching-contract`.
* Added basic unit test at `tests/platform/builder/contracts/workspace-switching.test.ts` to verify typescript typing and contract expectations.

### Testing commands run
* `npm run check:architecture`
* `npm run check:no-explicit-any`
* `npm run test tests/platform/builder/contracts/workspace-switching.test.ts`
* `npx playwright test`

### Blockers
* No blockers encountered.
