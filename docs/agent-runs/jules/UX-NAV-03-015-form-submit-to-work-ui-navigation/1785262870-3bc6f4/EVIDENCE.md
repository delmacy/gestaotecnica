# Evidence for UX-NAV-03-015: Form submit creates and returns work status - UI Navigation

## Implementation Notes
- Blocker Encountered: The current codebase scope restricts edits to `src/app/**`, `src/components/**`, `src/lib/**`, `tests/**`, and `docs/**`. To properly integrate the `WorkStatus` navigation contract into an actual form's submission handler, we must modify the server actions that process the forms. However, the server actions for form processing are located in `src/modules/work-items/actions.ts` and `src/modules/work-intake/actions.ts`.
- Since `src/modules/**` is explicitly out of the allowed scope for this task slice, we cannot wire the completed `/api/builder/work-status` API behavior (created in the previous step) to the actual product UI's persistence action.
- The UI hook (`useWorkStatus` or the server-side proxy `resolveWorkStatusViaApi`) belongs in `src/components/builder/shared/...`, which we can create. However, a standalone test page is not acceptable product evidence, and without the ability to edit the form action, we cannot attach the hook to real data.
- Recommended Next Step: Expand the scope of this slice to include `src/modules/work-items/actions.ts` and `src/modules/work-intake/actions.ts` so that the form actions can be updated to compute the `WorkStatusResolution` upon successful insertion and redirect using the contracted rules.
