"use client";

import React, { useState, useRef } from "react";
import type { BuilderEditorActions, BuilderEditorState } from "../state";
import { createDraftDownloadPayload, parseDraftJsonContent } from "./builder-draft-file";
import { clearBuilderDraftFromLocalStorage } from "../local-persistence";
import { useTransition } from "react";
import { startProcessInstanceAction, advanceStepAction } from "@/features/workflow/runtime/runtime.actions";

export type BuilderDraftActionsPanelProps = {
  state: BuilderEditorState;
  actions: BuilderEditorActions;
  onOfficialSave?: () => Promise<void> | void;
  onPublishOfficial?: () => Promise<void> | void;
};

export function BuilderDraftActionsPanel({ state, actions, onOfficialSave, onPublishOfficial }: BuilderDraftActionsPanelProps) {
  const [name, setName] = useState(state.draft.name);
  const [description, setDescription] = useState(state.draft.description ?? "");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal UI state when the external state replaces the draft entirely
  React.useEffect(() => {
    setName(state.draft.name);
    setDescription(state.draft.description ?? "");
  }, [state.draft.name, state.draft.description]);

  const handleApplyDetails = () => {
    actions.renameDraft({ name, description });
  };

  const handleExport = () => {
    const { filename, content } = createDraftDownloadPayload(state.draft);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (!file) return;

    file.text()
      .then((content) => {
        try {
          const importedDraft = parseDraftJsonContent(content);
          actions.replaceDraft(importedDraft);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Falha ao importar o arquivo.";
          setErrorMsg(message);
        }
      })
      .catch(() => {
        setErrorMsg("Falha ao ler o arquivo selecionado.");
      })
      .finally(() => {
        // Clear input to allow re-importing the same file
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      });
  };

  const handleReset = () => {
    const confirmed = window.confirm("Tem certeza? Isso apagará o processo atual e criará um novo em branco.");
    if (confirmed) {
      clearBuilderDraftFromLocalStorage();
      actions.resetDraft();
      actions.setLocalPersistenceStatus({
        message: "Rascunho local limpo.",
        lastSavedAt: undefined,
      });
      setErrorMsg(null);
    }
  };

  const [isPendingStart, startTransition] = useTransition();
  const [activeInstanceId, setActiveInstanceId] = useState<string | null>(null);

  const handleStartInstance = () => {
    if (!state.officialPersistence?.latestVersionId) return;

    const versionId = state.officialPersistence.latestVersionId;

    startTransition(async () => {
      const res = await startProcessInstanceAction(versionId);
      if ("ok" in res && res.ok === true) {
        setActiveInstanceId((res as any).data.id);
        alert("Instância iniciada com sucesso! ID: " + (res as any).data.id);
      } else {
        alert("Falha ao iniciar instância: " + (res as any).error?.message);
      }
    });
  };

  const handleAdvanceStep = () => {
    if (!activeInstanceId) return;

    startTransition(async () => {
      const res = await advanceStepAction(activeInstanceId);
      if ("ok" in res && res.ok === true) {
        const nextStatus = (res as any).data.status;
        alert(`Step avançado! Próximo estado da instância: ${nextStatus}`);
        if (nextStatus === "completed") {
           setActiveInstanceId(null);
        }
      } else {
        alert("Falha ao avançar: " + (res as any).error?.message);
      }
    });
  };

  const { lastSavedAt, message: persistenceMessage } = state.localPersistence || {};
  const {
    status: officialStatus,
    message: officialMessage,
    publicationStatus,
    processDefinitionId,
    latestVersionId
  } = state.officialPersistence || {};

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 shadow-sm z-10 relative">
      {/* Edit Details */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1">
          <input
            type="text"
            className="text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
            placeholder="Nome do processo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleApplyDetails}
          />
        </div>
        <div className="flex flex-col gap-1">
          <input
            type="text"
            className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleApplyDetails}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {officialStatus === "error" && officialMessage && (
          <span className="text-xs font-semibold text-red-600 max-w-xs truncate" title={officialMessage}>
            Erro: {officialMessage}
          </span>
        )}
        {officialStatus === "saved" && (
          <span className="text-xs font-semibold text-green-600 max-w-xs truncate">
            Salvo oficialmente
          </span>
        )}

        {onOfficialSave && (
          <button
            onClick={onOfficialSave}
            disabled={officialStatus === "saving" || publicationStatus === "publishing"}
            className="text-xs font-medium text-white px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors shadow-sm"
          >
            {officialStatus === "saving" ? "Salvando..." : "Salvar oficial"}
          </button>
        )}

        {onPublishOfficial && (
          <button
            onClick={onPublishOfficial}
            disabled={
              officialStatus === "saving" ||
              publicationStatus === "publishing" ||
              !processDefinitionId ||
              !latestVersionId
            }
            className={`text-xs font-medium px-4 py-1.5 rounded transition-colors shadow-sm ${
              publicationStatus === "published"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
            }`}
          >
            {publicationStatus === "publishing"
              ? "Publicando..."
              : publicationStatus === "published"
              ? "Publicado"
              : "Publicar"}
          </button>
        )}

        {publicationStatus === "published" && latestVersionId && !activeInstanceId && (
          <button
            onClick={handleStartInstance}
            disabled={isPendingStart}
            className="text-xs font-medium text-white px-4 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors shadow-sm ml-2"
          >
            {isPendingStart ? "Instanciando..." : "Instanciar"}
          </button>
        )}

        {activeInstanceId && (
          <button
            onClick={handleAdvanceStep}
            disabled={isPendingStart}
            className="text-xs font-medium text-white px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors shadow-sm ml-2"
          >
            {isPendingStart ? "Avançando..." : "Avançar Step"}
          </button>
        )}

        <div className="w-px h-4 bg-slate-300 mx-2"></div>

        {(errorMsg || persistenceMessage) && officialStatus !== "error" && (
          <span
            className={`text-xs font-semibold max-w-xs truncate ${errorMsg ? "text-red-600" : "text-slate-500"}`}
            title={errorMsg || persistenceMessage}
          >
            {errorMsg ? `Erro: ${errorMsg}` : persistenceMessage}
          </span>
        )}

        {lastSavedAt && (
          <span className="text-[10px] text-slate-400 whitespace-nowrap">
            Salvo: {new Date(lastSavedAt).toLocaleTimeString()}
          </span>
        )}

        <button
          onClick={handleExport}
          className="text-xs font-medium text-slate-600 hover:text-slate-800 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition-colors"
        >
          Exportar JSON
        </button>

        <label className="text-xs font-medium text-slate-600 hover:text-slate-800 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition-colors cursor-pointer">
          Importar JSON
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImport}
          />
        </label>

        <div className="w-px h-4 bg-slate-300 mx-1"></div>

        <button
          onClick={handleReset}
          className="text-xs font-medium text-red-600 hover:text-red-700 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors"
        >
          Resetar
        </button>
      </div>
    </div>
  );
}
