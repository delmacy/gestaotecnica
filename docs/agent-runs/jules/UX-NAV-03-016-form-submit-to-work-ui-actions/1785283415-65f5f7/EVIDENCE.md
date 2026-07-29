# Evidence for UX-NAV-03-016: Form submit creates and returns work status - UI Actions

## Implementation Notes
- **Blocker Encountered**: The required product evidence mandates that we modify forms, buttons, and loading states for the actual user journey of submitting work. These are found in \`src/modules/work-intake/components/IntakeCaptureForm.tsx\` and \`src/modules/work-items/work-item-form.tsx\`. Their corresponding server actions are in \`src/modules/work-intake/actions.ts\` and \`src/modules/work-items/actions.ts\`.
- However, the constraints and the Governor's explicit review comments **strictly forbid** editing any file outside of \`src/app/**\`, \`src/components/**\`, \`src/lib/**\`, \`tests/**\`, and \`docs/**\`.
- **Blocker Impact**: It is impossible to complete this task (wiring the primary/secondary actions, loading states, and honestly blocking/redirecting real behavior with the \`useWorkStatus\` hook) because the target files are in \`src/modules/**\`, which is strictly outside the allowed scope.
- We have created the \`useWorkStatus\` hook in \`src/components/builder/shared/hooks/useWorkStatus.ts\`, but it cannot be consumed by the UI without breaking the scope constraints.
- We are submitting this PR with only the newly created hook and this \`EVIDENCE.md\` file detailing the blocker.

## Required Product Evidence
- **Route/screen**: \`/work-intake\` (\`IntakeCaptureForm\`) and \`/work-items\` (\`WorkItemForm\`).
- **Persistence path**: \`POST /api/builder/work-status\` and the respective \`createWorkItem\` / \`captureIntakeAction\` server actions.
- **User journey**: User reaches \`/work-intake\` or \`/work-items\`, submits the form, sees a loading/disabled state, and upon success, is routed via \`useWorkStatus\` to the corresponding detail page based on the \`WorkStatusResolution\`.
- **Real-data proof or blocker**: **BLOCKED**: The components and actions that need to be wired (\`src/modules/work-intake/**\` and \`src/modules/work-items/**\`) are outside the allowed file scope (`src/app/**`, `src/components/**`, `src/lib/**`, `tests/**`, `docs/**`).
- **Base SHA**: 5076df5380e71a57a9b56937faa6b86b6b7c4aa5
