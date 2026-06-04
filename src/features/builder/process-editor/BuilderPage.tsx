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
import { BuilderPreviewPanel } from "../preview";
import { validateBuilderDraft } from "./validate-builder-draft";
import { saveBuilderDraftOfficially } from "../persistence/builder-save.client";

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

  const handleOfficialSave = async () => {
    // 1. Validate internal structures
    const validation = validateBuilderDraft(editor.state.draft);
    if (!validation.valid) {
      editor.actions.setOfficialPersistenceStatus({
        status: "error",
        message: "Erro de validação: Corrija os problemas no fluxo antes de salvar.",
      });
      return;
    }

    // 2. Optimistic "Saving..." UI state
    editor.actions.setOfficialPersistenceStatus({
      status: "saving",
      message: undefined,
    });

    // TODO: Phase X -> fetch proper workspaceId from session context.
    const TEMPORARY_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

    const result = await saveBuilderDraftOfficially({
      workspaceId: TEMPORARY_WORKSPACE_ID,
      draft: editor.state.draft,
      createdBy: "system",
    });

    if (result.ok) {
      editor.actions.setOfficialPersistenceStatus({
        processDefinitionId: result.data.processDefinitionId,
        latestVersionId: result.data.versionId,
        lastSavedAt: result.data.savedAt,
        status: "saved",
        message: "Salvo oficialmente",
      });
      // Optionally clean dirty flag to prevent nagging
      editor.actions.markClean();
    } else {
      editor.actions.setOfficialPersistenceStatus({
        status: "error",
        message: result.error.message,
      });
    }
  };

  return (
    <BuilderLayout
      mode={editor.state.mode}
      onModeChange={editor.actions.setMode}
      preview={<BuilderPreviewPanel state={editor.state} actions={editor.actions} />}
      blockLibrary={<BlockLibraryPanel onAddNode={editor.actions.addNode} />}
      canvas={<BuilderCanvas state={editor.state} actions={editor.actions} />}
      inspector={<InspectorPanel state={editor.state} actions={editor.actions} />}
      validation={<BuilderValidationPanel draft={editor.state.draft} />}
      draftActions={<BuilderDraftActionsPanel state={editor.state} actions={editor.actions} onOfficialSave={handleOfficialSave} />}
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
