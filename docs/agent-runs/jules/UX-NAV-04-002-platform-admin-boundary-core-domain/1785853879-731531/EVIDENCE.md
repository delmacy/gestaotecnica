# Product Proof

- **Route/screen/menu/button affected:** The workspace selection dropdown in the Topbar (managed by `WorkspaceSwitcher` at `src/components/builder/shell/WorkspaceSwitcher.tsx`), and the underlying Next.js API route paths: `GET /api/builder/navigation/workspace-switching` and `POST /api/builder/navigation/workspace-switching`.
- **Database/persistence object touched:** We removed the dummy hardcoded workspace arrays in `resolveWorkspaceList` and implemented domain resolution that reads from `builderWorkspaceSelections`, `organizations`, `workspaces`, and `workspaceMembers` via `resolveBuilderPortfolio` and `persistWorkspaceSelection` within `src/lib/builder-persistence.ts`.
- **User journey:**
  1. The user authenticates and enters `/builder`.
  2. The `WorkspaceSwitcher` frontend component sends a `GET /api/builder/navigation/workspace-switching` request to list workspaces.
  3. Instead of returning dummy fixtures, the backend calls `resolveBuilderPortfolio(userId)`, which accurately groups user-assigned workspaces by their organization from true runtime database membership records.
  4. The user clicks a different workspace in the dropdown menu.
  5. The `WorkspaceSwitcher` component sends a `POST /api/builder/navigation/workspace-switching` request to persist the choice.
  6. The backend explicitly calls `persistWorkspaceSelection(userId, targetWorkspaceId)` saving the state durably server-side into `builderWorkspaceSelections`.
  7. The frontend sets the local `x-workspace-id` cookie and redirects seamlessly to the target route, restoring real persistence across environments.
- **Real-data proof:** Integrated actual `resolveBuilderPortfolio` and `persistWorkspaceSelection` calls in `src/app/api/builder/navigation/workspace-switching-contract/resolve-workspace-switching.ts` removing prior hardcoded synthetic success data.

# Environment

- Node.js version: v24.19.0
- Base SHA: 7a9c457ba90395452f555dae0661c0bd4d971190