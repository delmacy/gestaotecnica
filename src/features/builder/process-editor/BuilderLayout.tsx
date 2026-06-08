import React from "react";

export type BuilderLayoutProps = {
  blockLibrary: React.ReactNode;
  canvas: React.ReactNode;
  inspector: React.ReactNode;
  validation?: React.ReactNode;
  draftActions?: React.ReactNode;
  savedProcesses?: React.ReactNode;
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

export function BuilderLayout({ blockLibrary, canvas, inspector, validation, draftActions, savedProcesses, preview, mode = "builder", onModeChange, headerInfo }: BuilderLayoutProps) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-16 flex-none shrink-0 items-center justify-between border-b border-border/80 bg-card/95 px-6 shadow-sm backdrop-blur">
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate text-sm font-bold leading-tight tracking-tight text-foreground">System Builder</h1>
          <span className="text-[10px] font-medium uppercase leading-tight tracking-[0.22em] text-muted-foreground">
            Construtor visual de processos
          </span>
        </div>

        <div className="flex items-center gap-4">
          {onModeChange && (
            <div className="flex items-center rounded-xl border border-border bg-muted/70 p-1">
              <button
                type="button"
                onClick={() => onModeChange("builder")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  mode === "builder" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Builder
              </button>
              <button
                type="button"
                onClick={() => onModeChange("preview")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  mode === "preview" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Preview
              </button>
            </div>
          )}

          {headerInfo && (
            <div className="hidden items-center gap-4 text-xs md:flex">
              <div className="flex min-w-0 items-center gap-2">
                <span className="max-w-56 truncate font-semibold text-foreground">{headerInfo.name}</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
                  {headerInfo.status}
                </span>
                {headerInfo.isDirty && (
                  <span className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
                    Não salvo
                  </span>
                )}
              </div>
              <div className="h-5 w-px bg-border" />
              <div className="flex gap-3 font-medium text-muted-foreground">
                <span>Nós: {headerInfo.nodeCount}</span>
                <span>Conexões: {headerInfo.edgeCount}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {draftActions && (
        <div className="z-20 flex-none">
          {draftActions}
        </div>
      )}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {mode === "builder" ? (
          <>
            <aside className="flex h-full shrink-0 flex-col overflow-hidden border-r border-border/60 bg-sidebar/50">
              {savedProcesses}
              {blockLibrary}
            </aside>

            <main className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-muted/25">
              <div className="relative min-h-0 flex-1">
                {canvas}
              </div>
              {validation}
            </main>

            <aside className="h-full shrink-0 overflow-hidden border-l border-border/60 bg-card/80">
              {inspector}
            </aside>
          </>
        ) : (
          <main className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-muted/25">
            <div className="relative min-h-0 flex-1">
              {preview}
            </div>
            {validation}
          </main>
        )}
      </div>
    </div>
  );
}
