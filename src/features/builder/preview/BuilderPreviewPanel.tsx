import React, { useMemo } from "react";
import type { BuilderEditorActions, BuilderEditorState } from "../state";
import { buildPreviewFlowModel, getNextPreviewNodeId, getPreviousPreviewNodeId } from "./preview-flow";
import { PreviewNodeRenderer } from "./PreviewNodeRenderer";
import { validateBuilderDraft } from "../process-editor/validate-builder-draft";

export type BuilderPreviewPanelProps = {
  state: BuilderEditorState;
  actions: BuilderEditorActions;
};

export function BuilderPreviewPanel({ state, actions }: BuilderPreviewPanelProps) {
  const { draft, preview } = state;
  const activeNodeId = preview?.activeNodeId;
  const completedNodeIds = preview?.completedNodeIds || [];

  const flowModel = useMemo(() => {
    return buildPreviewFlowModel(draft, activeNodeId, completedNodeIds);
  }, [draft, activeNodeId, completedNodeIds]);

  const hasNodes = draft.nodes.length > 0;
  const validation = useMemo(() => validateBuilderDraft(draft), [draft]);
  const isValid = validation.valid;
  const activeStep = flowModel.steps.find((s) => s.node.id === activeNodeId);
  const activeNode = activeStep?.node;

  // Initialize preview on first load if missing
  React.useEffect(() => {
    if (hasNodes && !activeNodeId) {
      const firstNodeId = getNextPreviewNodeId(draft);
      if (firstNodeId) actions.setPreviewActiveNode(firstNodeId);
    }
  }, [hasNodes, activeNodeId, draft, actions]);

  const handleNext = () => {
    if (!activeNodeId) return;
    const nextNodeId = getNextPreviewNodeId(draft, activeNodeId);
    if (nextNodeId) {
      actions.setPreviewActiveNode(nextNodeId);
    }
  };

  const handlePrevious = () => {
    if (!activeNodeId) return;
    const prevNodeId = getPreviousPreviewNodeId(draft, activeNodeId);
    if (prevNodeId) {
      actions.setPreviewActiveNode(prevNodeId);
    }
  };

  const handleCompleteAndNext = () => {
    if (!activeNodeId) return;
    actions.completePreviewStep(activeNodeId);
    handleNext();
  };

  const handleReset = () => {
    actions.resetPreview();
    const firstNodeId = getNextPreviewNodeId(draft);
    if (firstNodeId) actions.setPreviewActiveNode(firstNodeId);
  };

  if (!hasNodes) {
    return (
      <div className="w-full h-full bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-md shadow-sm text-center flex flex-col gap-2">
          <h3 className="text-lg font-bold text-slate-800">Preview Indisponível</h3>
          <p className="text-sm text-slate-500">
            Adicione blocos e conecte-os no modo Builder antes de visualizar a experiência do usuário.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-50 flex">
      {/* Sidebar - Process Timeline / Steps */}
      <div className="w-[320px] bg-white border-r border-slate-200 h-full flex flex-col shrink-0">
        {!isValid && (
          <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 font-medium">
            ⚠️ Atenção: O processo possui erros de validação. A simulação pode estar incompleta ou apresentar falhas.
          </div>
        )}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Etapas do Processo</h2>
          <button
            onClick={handleReset}
            className="text-xs text-blue-600 hover:text-blue-800 underline font-medium"
          >
            Reiniciar
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {flowModel.steps.map((step) => {
            const isCompleted = step.status === "completed";
            const isActive = step.status === "active";

            return (
              <button
                key={step.node.id}
                onClick={() => actions.setPreviewActiveNode(step.node.id)}
                className={`text-left p-3 rounded-lg border text-sm transition-all relative ${
                  isActive
                    ? "border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500/20"
                    : isCompleted
                    ? "border-green-200 bg-green-50/30 text-green-900"
                    : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${
                    isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-slate-400"
                  }`}>
                    {step.node.type}
                  </span>
                  {isCompleted && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="font-semibold line-clamp-1">{step.node.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col bg-slate-100">
        <div className="flex-1 p-8 max-w-4xl mx-auto w-full flex flex-col items-center justify-center">
          {activeNode ? (
            <div className="w-full">
              <PreviewNodeRenderer node={activeNode} />
            </div>
          ) : (
            <div className="text-slate-500 italic text-sm">Selecione uma etapa para visualizar.</div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="bg-white border-t border-slate-200 p-4 shrink-0 flex items-center justify-between max-w-4xl mx-auto w-full rounded-t-xl shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.05)]">
          <button
            onClick={handlePrevious}
            disabled={!getPreviousPreviewNodeId(draft, activeNodeId)}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Voltar
          </button>

          <div className="flex items-center gap-3">
            {activeNode?.type !== "end" && (
              <button
                onClick={handleCompleteAndNext}
                disabled={!activeNode}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Concluir Etapa
              </button>
            )}

            {activeNode?.type === "end" && (
              <button
                onClick={handleReset}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded shadow-sm transition-all"
              >
                Finalizar Processo (Resetar Preview)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
