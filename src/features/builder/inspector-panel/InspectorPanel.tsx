import React from "react";
import type { BuilderEditorActions, BuilderEditorState } from "../state";
import { NodeConfigPanel } from "./NodeConfigPanel";

export type InspectorPanelProps = {
  state: BuilderEditorState;
  actions: BuilderEditorActions;
};

export function InspectorPanel({ state, actions }: InspectorPanelProps) {
  const selectedNode = state.selectedNodeId
    ? state.draft.nodes.find((n) => n.id === state.selectedNodeId)
    : undefined;

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 overflow-y-auto w-[360px]">
      <div className="p-4 border-b border-slate-200 sticky top-0 z-10 bg-white flex justify-between items-center">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Inspetor de Propriedades</h2>
          <p className="text-xs text-slate-500 mt-1">Configurações do bloco selecionado</p>
        </div>
        {selectedNode && (
          <button
            onClick={() => actions.clearSelection()}
            className="text-xs text-slate-500 hover:text-slate-800 underline"
          >
            Limpar seleção
          </button>
        )}
      </div>

      <div className="p-4 flex flex-col gap-4">
        {!selectedNode ? (
          <div className="text-sm text-slate-500 italic text-center p-8 bg-slate-50 rounded border border-dashed border-slate-300">
            Selecione um bloco para editar suas propriedades.
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">ID do Bloco</label>
              <div className="text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
                {selectedNode.id}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Tipo</label>
              <div className="text-sm text-slate-800">
                <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  {selectedNode.type}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="node-label" className="text-xs font-semibold text-slate-700">
                Rótulo (Label)
              </label>
              <input
                id="node-label"
                type="text"
                className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedNode.label}
                onChange={(e) => actions.updateSelectedNode({ label: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="node-description" className="text-xs font-semibold text-slate-700">
                Descrição
              </label>
              <textarea
                id="node-description"
                rows={3}
                className="text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                value={selectedNode.description ?? ""}
                onChange={(e) => actions.updateSelectedNode({ description: e.target.value })}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                Configurações Específicas
              </h3>
              <NodeConfigPanel node={selectedNode} actions={actions} />
            </div>

            <div className="flex flex-col gap-1.5 mt-6 pt-4 border-t border-slate-200">
              <label className="text-xs font-semibold text-slate-700">Configuração (Debug JSON)</label>
              <textarea
                readOnly
                rows={6}
                className="text-[10px] font-mono p-3 border border-slate-300 rounded bg-slate-50 text-slate-500 resize-none focus:outline-none"
                value={JSON.stringify(selectedNode.config, null, 2)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
