import React from "react";

export type BuilderLayoutProps = {
  blockLibrary: React.ReactNode;
  canvas: React.ReactNode;
  inspector: React.ReactNode;
};

export function BuilderLayout({ blockLibrary, canvas, inspector }: BuilderLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden">
      <header className="flex-none h-14 bg-white border-b border-slate-200 flex items-center px-6 shrink-0">
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-slate-800 leading-tight">System Builder</h1>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium leading-tight">
            Construtor visual de processos
          </span>
        </div>
      </header>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <aside className="shrink-0 h-full overflow-hidden">
          {blockLibrary}
        </aside>

        <main className="flex-1 h-full overflow-hidden relative min-w-0">
          {canvas}
        </main>

        <aside className="shrink-0 h-full overflow-hidden">
          {inspector}
        </aside>
      </div>
    </div>
  );
}
