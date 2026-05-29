"use client";

import { cn } from "@/lib/utils";
import { Circle, Play, ArrowRight, Database, Box } from "lucide-react";

type Node = {
  id: string;
  label: string;
  type: "state" | "trigger" | "action";
  x: number;
  y: number;
};

type Edge = {
  from: string;
  to: string;
  label: string;
};

const MOCK_FLOW: { nodes: Node[]; edges: Edge[] } = {
  nodes: [
    { id: "start", label: "Trigger: Nova Demanda", type: "trigger", x: 50, y: 50 },
    { id: "draft", label: "Rascunho", type: "state", x: 250, y: 50 },
    { id: "review", label: "Em Revisão", type: "state", x: 450, y: 50 },
    { id: "active", label: "Ativa", type: "state", x: 650, y: 50 },
    { id: "complete", label: "Concluída", type: "state", x: 650, y: 200 },
  ],
  edges: [
    { from: "start", to: "draft", label: "Initialize" },
    { from: "draft", to: "review", label: "Submit" },
    { from: "review", to: "active", label: "Approve" },
    { from: "review", to: "draft", label: "Reject" },
    { from: "active", to: "complete", label: "Finish" },
  ]
};

export function BuilderCanvas({ activeItem }: { activeItem: any }) {
  if (!activeItem || (activeItem.type !== 'process' && activeItem.type !== 'capability' && activeItem.type !== 'catalog_item')) {
    return (
      <div className="flex-1 bg-[#f8f9fa] relative overflow-hidden flex flex-col items-center justify-center text-center p-12">
        <div className="size-24 rounded-full bg-white border shadow-sm flex items-center justify-center mb-6">
          <Box className="size-10 text-muted-foreground/30" />
        </div>
        <h2 className="text-xl font-semibold text-foreground/80">Architecture Canvas</h2>
        <p className="text-muted-foreground max-w-md mt-2">
          Selecione um processo ou capacidade no Explorer para visualizar sua estrutura organizacional e fluxos operacionais.
        </p>

        {/* Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
             style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f8f9fa] relative overflow-hidden flex flex-col">
      <div className="h-10 flex items-center justify-between px-6 border-b bg-white shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Editor:</span>
          <span className="text-xs font-bold text-foreground uppercase tracking-tight">{activeItem.label}</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground">Preview</button>
          <button className="text-[10px] font-bold uppercase text-primary">Publish</button>
        </div>
      </div>

      <div className="flex-1 relative p-12 overflow-auto">
        {/* Canvas Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
             style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative min-w-[800px] min-h-[500px]">
          {MOCK_FLOW.nodes.map(node => (
            <div
              key={node.id}
              className={cn(
                "absolute size-40 bg-white border-2 rounded-xl shadow-sm p-4 flex flex-col justify-between hover:border-primary transition-colors cursor-pointer group",
                node.type === 'trigger' && "border-amber-200 bg-amber-50/30",
                node.type === 'state' && "border-blue-100"
              )}
              style={{ left: node.x, top: node.y }}
            >
              <div className="flex items-start justify-between">
                <div className={cn(
                  "size-8 rounded-lg flex items-center justify-center",
                  node.type === 'trigger' ? "bg-amber-100 text-amber-700" : "bg-blue-50 text-blue-600"
                )}>
                  {node.type === 'trigger' ? <Play className="size-4" /> : <Circle className="size-4" />}
                </div>
                <div className="size-5 rounded-full border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="size-3 text-muted-foreground" />
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase">{node.type}</div>
                <div className="text-sm font-bold text-foreground leading-tight mt-0.5">{node.label}</div>
              </div>
            </div>
          ))}

          {/* Connectors (Simulated) */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            {/* Very crude simulated lines */}
            <svg className="w-full h-full">
               <path d="M 210 130 L 250 130" stroke="currentColor" strokeWidth="2" fill="none" />
               <path d="M 410 130 L 450 130" stroke="currentColor" strokeWidth="2" fill="none" />
               <path d="M 610 130 L 650 130" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      </div>

      <div className="h-8 border-t bg-white flex items-center px-4 shrink-0 text-[10px] text-muted-foreground font-mono gap-4">
        <div className="flex items-center gap-1.5">
          <Database className="size-3" />
          CONNECTED
        </div>
        <div>X: 1240 Y: 450</div>
        <div>ZOOM: 100%</div>
      </div>
    </div>
  );
}
