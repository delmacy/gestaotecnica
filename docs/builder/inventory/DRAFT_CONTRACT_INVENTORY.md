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

## Save/Load/Conflict/Delete Draft Boundaries

The boundaries for operational actions on drafts are defined by typed envelopes in the Builder domain. These envelopes explicitly define intent and outcomes (including successes, validation failures, conflicts, and access errors) without tightly coupling to persistence layers.

- `DraftSaveEnvelope`: Defines boundaries for saving drafts, handling validation and optimistic concurrency conflicts (`src/features/builder/draft-save/draft-save-envelope.types.ts`).
- `DraftLoadEnvelope`: Defines boundaries for loading drafts, handling not found, forbidden, or invalid outcomes (`src/features/builder/draft-load/draft-load-envelope.types.ts`).
- `DraftDeleteEnvelope`: Defines boundaries for deleting drafts, explicitly prohibiting deletion of published drafts (`src/features/builder/draft-delete/draft-delete-envelope.types.ts`).
- `DraftRollbackEnvelope`: Defines boundaries for rolling back drafts to previous versions (`src/features/builder/draft-delete/draft-delete-envelope.types.ts`).

## Unimplemented Features

- **Persisted Draft Support**: The system does not claim or support persisted draft support yet. While there are in-memory states and local storage autosave mechanisms, official backend persistence for drafts remains unimplemented until corresponding repository tasks are created and fulfilled.
