import React from "react";
import { listBuilderBlockDefinitions } from "./block-catalog";
import type { BuilderBlockType } from "../types";

export type BlockLibraryPanelProps = {
  onAddNode: (input: { type: BuilderBlockType }) => void;
};

export function BlockLibraryPanel({ onAddNode }: BlockLibraryPanelProps) {
  const blocks = listBuilderBlockDefinitions();

  return (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200 overflow-y-auto w-[280px]">
      <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <h2 className="text-sm font-semibold text-slate-800">Biblioteca de Blocos</h2>
        <p className="text-xs text-slate-500 mt-1">Clique para adicionar ao processo</p>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {blocks.map((block) => (
          <div
            key={block.type}
            role="button"
            tabIndex={0}
            className="flex flex-col bg-white border border-slate-200 rounded-md p-3 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer text-left"
            onClick={() => onAddNode({ type: block.type })}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onAddNode({ type: block.type });
              }
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                {block.category}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-800">{block.label}</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{block.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
