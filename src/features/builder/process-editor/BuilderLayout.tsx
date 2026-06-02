import React from "react";

export type BuilderLayoutProps = {
  blockLibrary: React.ReactNode;
  canvas: React.ReactNode;
  inspector: React.ReactNode;
  validation?: React.ReactNode;
  draftActions?: React.ReactNode;
  preview?: React.ReactNode;
  mode?: "builder" | "preview";
  onModeChange?: (mode: "builder" | "preview") => void;
  headerInfo?: {
    name: string;
    status: string;
    isDirty: boolean;
    nodeCount: number;
    edgeCount: number;
  };
};

export function BuilderLayout({ blockLibrary, canvas, inspector, validation, draftActions, preview, mode = "builder", onModeChange, headerInfo }: BuilderLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden">
      <header className="flex-none h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-slate-800 leading-tight">System Builder</h1>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium leading-tight">
            Construtor visual de processos
          </span>
        </div>

        <div className="flex items-center gap-6">
          {onModeChange && (
            <div className="flex items-center bg-slate-100 rounded-md p-1 border border-slate-200">
              <button
                onClick={() => onModeChange("builder")}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                  mode === "builder" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Builder
              </button>
              <button
                onClick={() => onModeChange("preview")}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                  mode === "preview" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Preview
              </button>
            </div>
          )}

          {headerInfo && (
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">{headerInfo.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                {headerInfo.status}
              </span>
              {headerInfo.isDirty && (
                <span className="px-2 py-0.5 rounded text-amber-600 bg-amber-50 border border-amber-200 font-medium">
                  Não salvo
                </span>
              )}
            </div>
            <div className="h-4 w-px bg-slate-300"></div>
              <div className="flex gap-3 text-slate-500 font-medium">
                <span>Nós: {headerInfo.nodeCount}</span>
                <span>Conexões: {headerInfo.edgeCount}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {draftActions && (
        <div className="flex-none z-20">
          {draftActions}
        </div>
      )}

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {mode === "builder" ? (
          <>
            <aside className="shrink-0 h-full overflow-hidden">
              {blockLibrary}
            </aside>

            <main className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
              <div className="flex-1 relative min-h-0">
                {canvas}
              </div>
              {validation}
            </main>

            <aside className="shrink-0 h-full overflow-hidden">
              {inspector}
            </aside>
          </>
        ) : (
          <main className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
            <div className="flex-1 relative min-h-0">
              {preview}
            </div>
            {validation}
          </main>
        )}
      </div>
    </div>
  );
}
