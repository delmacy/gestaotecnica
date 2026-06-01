import React from "react";
import type { BuilderEditorActions, BuilderEditorState } from "../state";

export type BuilderCanvasPlaceholderProps = {
  state: BuilderEditorState;
  actions: BuilderEditorActions;
};

export function BuilderCanvasPlaceholder({ state, actions }: BuilderCanvasPlaceholderProps) {
  const { nodes, edges } = state.draft;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur border border-slate-200 rounded-md px-3 py-1.5 flex gap-4 text-xs font-medium text-slate-600 shadow-sm">
        <span>Blocos: {nodes.length}</span>
        <span>Conexões: {edges.length}</span>
        {state.dirty && <span className="text-amber-600">Não salvo</span>}
      </div>

      <div className="flex-1 overflow-auto p-12 relative flex items-start justify-start flex-wrap gap-4 content-start">
        {nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white/50 backdrop-blur p-8 rounded-lg border border-slate-200 shadow-sm max-w-md">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Canvas Vazio</h3>
              <p className="text-sm text-slate-500">
                Adicione blocos pela biblioteca à esquerda para começar.
              </p>
            </div>
          </div>
        ) : (
          nodes.map((node) => {
            const isSelected = state.selectedNodeId === node.id;
            return (
              <div
                key={node.id}
                role="button"
                tabIndex={0}
                className={`flex flex-col bg-white border-2 rounded-lg p-4 w-64 shadow-sm transition-all cursor-pointer ${
                  isSelected ? "border-blue-500 shadow-md ring-4 ring-blue-500/20" : "border-slate-200 hover:border-slate-300"
                }`}
                onClick={() => actions.selectNode(node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    actions.selectNode(node.id);
                  }
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                    {node.type}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{node.label}</h4>
                {node.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{node.description}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
