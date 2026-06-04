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
import { listSavedProcesses, loadSavedProcess } from "../persistence/builder-load.client";
import { SavedProcessesPanel } from "../saved-processes/SavedProcessesPanel";
import type { SavedProcessListItem } from "../persistence/builder-load.types";

export function BuilderPage() {
  const editor = useBuilderEditorState();

  const [savedProcesses, setSavedProcesses] = React.useState<SavedProcessListItem[]>([]);
  const [savedProcessesLoading, setSavedProcessesLoading] = React.useState(false);
  const [savedProcessesError, setSavedProcessesError] = React.useState<string | undefined>();

  const TEMPORARY_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

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

    // Auto-refresh saved processes once restored
    handleRefreshSavedProcesses();
  }, [editor.actions, editor.state.localPersistence?.restored]);

  const handleRefreshSavedProcesses = React.useCallback(async () => {
    setSavedProcessesLoading(true);
    setSavedProcessesError(undefined);
    const result = await listSavedProcesses({ workspaceId: TEMPORARY_WORKSPACE_ID });
    if (result.ok) {
      setSavedProcesses(result.data.items);
    } else {
      setSavedProcessesError(result.error.message);
    }
    setSavedProcessesLoading(false);
  }, [TEMPORARY_WORKSPACE_ID]);

  const handleOpenSavedProcess = React.useCallback(async (processDefinitionId: string) => {
    if (editor.state.dirty) {
      const confirm = window.confirm("Existem alterações não salvas. Deseja substituí-las?");
      if (!confirm) return;
    }

    editor.actions.setOfficialPersistenceStatus({
      loadStatus: "loading",
      message: undefined,
    });

    const result = await loadSavedProcess({
      workspaceId: TEMPORARY_WORKSPACE_ID,
      processDefinitionId,
    });

    if (result.ok && result.data.draft) {
      editor.actions.setOfficialLoadedProcess({
        draft: result.data.draft,
        processDefinitionId: result.data.processDefinition.id,
        latestVersionId: result.data.latestVersion?.id,
        message: "Processo carregado com sucesso.",
      });
    } else {
      editor.actions.setOfficialPersistenceStatus({
        loadStatus: "error",
        message: result.ok ? "O processo não possui um draft salvo na última versão." : result.error.message,
      });
    }
  }, [editor.state.dirty, editor.actions, TEMPORARY_WORKSPACE_ID]);

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
      savedProcesses={
        <SavedProcessesPanel
          items={savedProcesses}
          loading={savedProcessesLoading}
          error={savedProcessesError}
          onRefresh={handleRefreshSavedProcesses}
          onOpen={handleOpenSavedProcess}
        />
      }
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
