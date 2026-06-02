"use client";

import React from "react";
import { useBuilderEditorState } from "../state/use-builder-editor-state";
import { BuilderLayout } from "./BuilderLayout";
import { BlockLibraryPanel } from "../block-library/BlockLibraryPanel";
import { InspectorPanel } from "../inspector-panel/InspectorPanel";
import { BuilderCanvas } from "../canvas/BuilderCanvas";
import { BuilderValidationPanel } from "../validation/BuilderValidationPanel";
import { BuilderDraftActionsPanel } from "../draft-actions";
import { loadBuilderDraftFromLocalStorage, useBuilderLocalAutosave } from "../local-persistence";

export function BuilderPage() {
  const editor = useBuilderEditorState();

  React.useEffect(() => {
    // Only attempt to restore if we haven't already done so
    if (editor.state.localPersistence?.restored) return;

    const result = loadBuilderDraftFromLocalStorage();

    if (result.ok) {
      editor.actions.replaceDraft(result.draft);
      editor.actions.setLocalPersistenceStatus({
        restored: true,
        message: "Rascunho local restaurado.",
      });
    } else {
      editor.actions.setLocalPersistenceStatus({
        restored: true,
        message: result.reason,
      });
    }
  }, [editor.actions, editor.state.localPersistence?.restored]);

  useBuilderLocalAutosave({
    draft: editor.state.draft,
    enabled: editor.state.localPersistence?.restored === true,
    onSaved: () => {
      editor.actions.setLocalPersistenceStatus({
        lastSavedAt: new Date().toISOString(),
        message: "Salvo localmente.",
      });
    },
    onError: (message) => {
      editor.actions.setLocalPersistenceStatus({
        message: `Falha no autosave: ${message}`,
      });
    },
  });

  return (
    <BuilderLayout
      blockLibrary={<BlockLibraryPanel onAddNode={editor.actions.addNode} />}
      canvas={<BuilderCanvas state={editor.state} actions={editor.actions} />}
      inspector={<InspectorPanel state={editor.state} actions={editor.actions} />}
      validation={<BuilderValidationPanel draft={editor.state.draft} />}
      draftActions={<BuilderDraftActionsPanel state={editor.state} actions={editor.actions} />}
      headerInfo={{
        name: editor.state.draft.name,
        status: editor.state.draft.status,
        isDirty: editor.state.dirty,
        nodeCount: editor.state.draft.nodes.length,
        edgeCount: editor.state.draft.edges.length,
      }}
    />
  );
}
