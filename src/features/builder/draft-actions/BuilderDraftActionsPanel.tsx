"use client";

import React, { useState, useRef } from "react";
import type { BuilderEditorActions, BuilderEditorState } from "../state";
import { createDraftDownloadPayload, parseDraftJsonContent } from "./builder-draft-file";

export type BuilderDraftActionsPanelProps = {
  state: BuilderEditorState;
  actions: BuilderEditorActions;
};

export function BuilderDraftActionsPanel({ state, actions }: BuilderDraftActionsPanelProps) {
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
        } catch (err: any) {
          setErrorMsg(err.message || "Falha ao importar o arquivo.");
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
      actions.resetDraft();
      setErrorMsg(null);
    }
  };

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
        {errorMsg && (
          <span className="text-xs font-semibold text-red-600 max-w-xs truncate" title={errorMsg}>
            Erro: {errorMsg}
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
