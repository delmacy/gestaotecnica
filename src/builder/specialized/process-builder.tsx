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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from "@/lib/utils";
import { Circle, Play, Box, Database, Save, CheckCircle2, AlertCircle, Clock, Loader2, Trash2 } from "lucide-react";
import { executeKernelAction } from "@/platform/actions/remote-actions";

type ProcessNodeData = {
  label: string;
  type: "start" | "task" | "approval" | "decision" | "end";
};

const ProcessNode = ({ data, selected }: NodeProps<Node<ProcessNodeData>>) => {
  const type = data.type;
  return (
    <div className={cn(
      "size-44 bg-white border-2 rounded-lg shadow-sm p-4 flex flex-col justify-between transition-all group",
      selected ? "border-primary ring-4 ring-primary/10" : "hover:border-primary/50",
      type === 'start' && "border-green-200 bg-green-50/20",
      type === 'end' && "border-red-200 bg-red-50/20",
      type === 'approval' && "border-amber-200 bg-amber-50/20",
      type === 'decision' && "border-blue-200 bg-blue-50/20 rotate-45 flex items-center justify-center"
    )}>
      <div className={cn(type === 'decision' && "-rotate-45")}>
        <Handle type="target" position={Position.Left} className="!size-2 !bg-primary/30" />

        <div className="flex items-start justify-between mb-2">
          <div className={cn(
            "size-8 rounded-full flex items-center justify-center",
            type === 'start' ? "bg-green-100 text-green-700" :
            type === 'end' ? "bg-red-100 text-red-700" :
            type === 'approval' ? "bg-amber-100 text-amber-700" :
            type === 'decision' ? "bg-blue-100 text-blue-700" :
            "bg-muted text-muted-foreground"
          )}>
            {type === 'start' ? <Play className="size-4" /> :
             type === 'end' ? <CheckCircle2 className="size-4" /> :
             type === 'approval' ? <AlertCircle className="size-4" /> :
             type === 'decision' ? <Clock className="size-4" /> :
             <Box className="size-4" />}
          </div>
        </div>

        <div>
          <div className="text-[9px] font-mono text-muted-foreground uppercase">{type}</div>
          <div className="text-xs font-bold text-foreground leading-tight mt-0.5">{data.label}</div>
        </div>

        <Handle type="source" position={Position.Right} className="!size-2 !bg-primary/30" />
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  process: ProcessNode,
};

const initialNodes: Node<ProcessNodeData>[] = [
  { id: '1', type: 'process', position: { x: 50, y: 150 }, data: { label: 'Receber Demanda', type: 'start' } },
  { id: '2', type: 'process', position: { x: 300, y: 150 }, data: { label: 'Triagem Operacional', type: 'task' } },
  { id: '3', type: 'process', position: { x: 550, y: 150 }, data: { label: 'Execução Técnica', type: 'task' } },
  { id: '4', type: 'process', position: { x: 800, y: 150 }, data: { label: 'Validação Cliente', type: 'approval' } },
  { id: '5', type: 'process', position: { x: 1050, y: 150 }, data: { label: 'Encerramento', type: 'end' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
];

export function ProcessBuilder({ activeItem }: { activeItem: any }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSaving, setIsSaving] = React.useState(false);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await executeKernelAction("processes.save_definition", {
        workspaceId: "workspace-acme-prod", // Mocked for demo
        key: activeItem.id,
        name: activeItem.label,
        definition: { nodes, edges }
      });
      if (result.success) alert("Processo de negócio salvo no banco de dados!");
    } catch (e) {
      alert("Falha ao salvar processo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 h-full bg-[#fafafa]">
      <div className="absolute top-4 right-4 z-20 flex gap-2">
         <button
           onClick={handleSave}
           disabled={isSaving}
           className="bg-white border text-xs font-bold py-2 px-4 rounded shadow-sm hover:bg-muted flex items-center gap-2"
           data-testid="btn-save-process"
         >
           {isSaving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
           Save Process
         </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls />
        <Panel position="top-right" className="bg-white p-2 border rounded-md shadow-sm flex flex-col gap-1 mt-12">
          <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 mb-1">Process Elements</p>
          <button className="text-[10px] p-2 hover:bg-muted rounded text-left">+ Add Task</button>
          <button className="text-[10px] p-2 hover:bg-muted rounded text-left">+ Add Decision</button>
          <button className="text-[10px] p-2 hover:bg-muted rounded text-left">+ Add Approval</button>
        </Panel>
        <Panel position="top-left" className="bg-white/80 p-2 border rounded shadow-sm">
           <div className="flex items-center gap-2">
             <div className="size-2 rounded-full bg-blue-500 animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-tight">Process Modeler (BPM)</span>
           </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
