"use client";

import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  type NodeProps,
  type Edge,
  type Node,
  Panel,
  BackgroundVariant,
  type NodeTypes,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from "@/lib/utils";
import { Circle, Play, Box, Database, Save, Zap } from "lucide-react";

// --- Custom Node Types ---

type BuilderNodeData = {
  label: string;
  type: "state" | "trigger" | "action";
};

const BuilderNode = ({ data, selected }: NodeProps<Node<BuilderNodeData>>) => {
  const type = data.type;
  return (
    <div className={cn(
      "size-40 bg-white border-2 rounded-xl shadow-sm p-4 flex flex-col justify-between transition-all group",
      selected ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50",
      type === 'trigger' && "border-amber-200 bg-amber-50/30",
      type === 'state' && "border-blue-100",
      type === 'action' && "border-emerald-100 bg-emerald-50/10"
    )}>
      <Handle type="target" position={Position.Left} className="!size-2 !bg-primary/30" />

      <div className="flex items-start justify-between">
        <div className={cn(
          "size-8 rounded-lg flex items-center justify-center",
          type === 'trigger' ? "bg-amber-100 text-amber-700" :
          type === 'action' ? "bg-emerald-100 text-emerald-700" :
          "bg-blue-50 text-blue-600"
        )}>
          {type === 'trigger' ? <Play className="size-4" /> : type === 'action' ? <Zap className="size-4" /> : <Circle className="size-4" />}
        </div>
      </div>

      <div>
        <div className="text-[10px] font-mono text-muted-foreground uppercase">{type}</div>
        <div className="text-sm font-bold text-foreground leading-tight mt-0.5">{data.label}</div>
      </div>

      <Handle type="source" position={Position.Right} className="!size-2 !bg-primary/30" />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  builder: BuilderNode,
};

// --- Mock Data ---

const initialNodes: Node<BuilderNodeData>[] = [
  { id: 'start', type: 'builder', position: { x: 50, y: 50 }, data: { label: 'Trigger: Nova Demanda', type: 'trigger' } },
  { id: 'draft', type: 'builder', position: { x: 300, y: 50 }, data: { label: 'Rascunho', type: 'state' } },
  { id: 'review', type: 'builder', position: { x: 550, y: 50 }, data: { label: 'Em Revisão', type: 'state' } },
  { id: 'active', type: 'builder', position: { x: 800, y: 50 }, data: { label: 'Ativa', type: 'state' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'start', target: 'draft', animated: true },
  { id: 'e2-3', source: 'draft', target: 'review' },
  { id: 'e3-4', source: 'review', target: 'active' },
];

function FlowCanvas({ activeItem }: { activeItem: any }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onSave = () => {
    // In a real system, this would call an API to persist the architecture
    const architecturalBlueprint = {
      workspaceId: activeItem.id,
      nodes,
      edges,
      version: '1.0.0-draft',
      timestamp: new Date().toISOString(),
    };

    console.log('--- ARCHITECTURAL BLUEPRINT SAVED ---');
    console.log(JSON.stringify(architecturalBlueprint, null, 2));

    alert(`Arquitetura do componente "${activeItem.label}" salva com sucesso!\n\n${nodes.length} nós e ${edges.length} conexões registradas.`);
  };

  const addNode = (type: "state" | "trigger" | "action") => {
    const id = `node-${Date.now()}`;
    const newNode: Node<BuilderNodeData> = {
      id,
      type: 'builder',
      position: { x: 400 + (Math.random() * 100), y: 200 + (Math.random() * 100) },
      data: {
        label: type === 'trigger' ? 'Novo Gatilho' : type === 'action' ? 'Nova Ação' : 'Novo Estado',
        type
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className="flex-1 bg-[#f8f9fa] relative overflow-hidden flex flex-col">
      <div className="h-10 flex items-center justify-between px-6 border-b bg-white shrink-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Editor:</span>
          <span className="text-xs font-bold text-foreground uppercase tracking-tight">{activeItem.label}</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onSave}
            className="text-[10px] font-bold uppercase text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
            data-testid="btn-save-architecture"
          >
            <Save className="size-3" />
            Save Architecture
          </button>
          <button className="text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground transition-colors">Preview</button>
          <button className="text-[10px] font-bold uppercase text-primary transition-all hover:scale-105">Publish</button>
        </div>
      </div>

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-muted/5"
        >
          <Background variant={BackgroundVariant.Lines} gap={40} size={1} color="#e5e7eb" />
          <Controls position="bottom-right" />
          <MiniMap position="bottom-left" zoomable pannable />

          <Panel position="top-right" className="bg-white/90 backdrop-blur-sm border rounded-lg p-2 flex flex-col gap-1 shadow-md">
             <button
               onClick={() => addNode('trigger')}
               className="text-[10px] font-bold uppercase px-3 py-1.5 hover:bg-amber-50 hover:text-amber-700 rounded text-left flex items-center gap-2 transition-colors"
               data-testid="btn-add-trigger"
             >
               <Play className="size-3" />
               + Add Trigger
             </button>
             <button
               onClick={() => addNode('state')}
               className="text-[10px] font-bold uppercase px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 rounded text-left flex items-center gap-2 transition-colors"
               data-testid="btn-add-state"
             >
               <Circle className="size-3" />
               + Add State
             </button>
             <button
               onClick={() => addNode('action')}
               className="text-[10px] font-bold uppercase px-3 py-1.5 hover:bg-emerald-50 hover:text-emerald-700 rounded text-left flex items-center gap-2 transition-colors"
               data-testid="btn-add-action"
             >
               <Zap className="size-3" />
               + Add Action
             </button>
          </Panel>
        </ReactFlow>
      </div>

      <div className="h-8 border-t bg-white flex items-center px-4 shrink-0 text-[10px] text-muted-foreground font-mono gap-4 z-10">
        <div className="flex items-center gap-1.5">
          <Database className="size-3" />
          SYSTEM_BUILDER_MODE: ACTIVE
        </div>
        <div>NODES: {nodes.length}</div>
        <div>EDGES: {edges.length}</div>
        <div className="ml-auto text-primary animate-pulse">ARCHITECTURE V1.0.4</div>
      </div>
    </div>
  );
}

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
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
             style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <FlowCanvas activeItem={activeItem} />
    </ReactFlowProvider>
  );
}
