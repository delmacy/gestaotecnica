# Draft Contract Inventory

## Current Draft-Like Types/Actions

- `BuilderDraft`: Represents the in-memory state of a builder draft (`src/features/builder/types/builder-draft.types.ts`).
- `SerializedBuilderDraft`: Represents the serialized format of a draft for local storage or JSON export.
- `BuilderDraftSummary`: Summarized version of a draft.
- `DraftToPublishedTransitionContext`: Output of checking a boundary condition for a draft-to-published transition (`src/features/builder/candidates/boundary/draft-to-published-boundary.ts`).
- Local Storage Autosave: Drafts are saved automatically to the browser's `localStorage` (`src/features/builder/local-persistence/builder-local-storage.ts`).
- State Management: Uses `useBuilderEditorState` which holds `BuilderDraft` and provides functions like `resetDraft`, `replaceDraft`, etc.
- UI Draft Actions: A set of React components (`src/features/builder/draft-actions/BuilderDraftActionsPanel.tsx`) that manage UI operations on drafts (import, export, validate, clear).

## Canonical Draft Boundary

The canonical draft boundary in this system is `src/features/builder/candidates/boundary/draft-to-published-boundary.ts` which exports `checkDraftToPublishedBoundary`.
This file serves as the explicit contract marker deciding when a draft can be transitioned to a published state (acting as a pure helper without persisting state).
