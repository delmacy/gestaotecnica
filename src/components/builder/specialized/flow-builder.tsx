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
import { Zap, Bell, Globe, BrainCircuit, Code, MessageSquare, ShieldAlert, Save, Loader2 } from "lucide-react";
import { executeKernelAction } from "@/platform/actions/remote-actions";

type FlowNodeData = {
  label: string;
  type: "event" | "condition" | "action" | "integration" | "notification" | "ai" | "script";
};

const FlowNode = ({ data, selected }: NodeProps<Node<FlowNodeData>>) => {
  const type = data.type;
  return (
    <div className={cn(
      "min-w-40 bg-[#0f1115] border-2 rounded-lg shadow-xl p-3 flex flex-col justify-between transition-all group text-white",
      selected ? "border-primary shadow-primary/20" : "border-white/10 hover:border-white/30",
    )}>
      <Handle type="target" position={Position.Left} className="!size-2 !bg-primary/50" />

      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          "size-7 rounded flex items-center justify-center",
          type === 'event' ? "bg-amber-500/20 text-amber-500" :
          type === 'condition' ? "bg-blue-500/20 text-blue-500" :
          type === 'action' ? "bg-emerald-500/20 text-emerald-500" :
          type === 'ai' ? "bg-purple-500/20 text-purple-500" :
          "bg-white/10 text-white/50"
        )}>
          {type === 'event' ? <Zap className="size-4" /> :
           type === 'notification' ? <Bell className="size-4" /> :
           type === 'integration' ? <Globe className="size-4" /> :
           type === 'ai' ? <BrainCircuit className="size-4" /> :
           type === 'script' ? <Code className="size-4" /> :
           <Zap className="size-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[8px] font-mono text-white/40 uppercase tracking-widest">{type}</div>
          <div className="text-[11px] font-bold truncate leading-tight">{data.label}</div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!size-2 !bg-primary/50" />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  flow: FlowNode,
};

const initialNodes: Node<FlowNodeData>[] = [
  { id: '1', type: 'flow', position: { x: 50, y: 150 }, data: { label: 'work_item.created', type: 'event' } },
  { id: '2', type: 'flow', position: { x: 300, y: 150 }, data: { label: 'Prioridade Alta?', type: 'condition' } },
  { id: '3', type: 'flow', position: { x: 550, y: 50 }, data: { label: 'Send Slack Alert', type: 'notification' } },
  { id: '4', type: 'flow', position: { x: 550, y: 250 }, data: { label: 'AI: Classify Request', type: 'ai' } },
  { id: '5', type: 'flow', position: { x: 800, y: 250 }, data: { label: 'service_orders.create', type: 'action' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', label: 'True', labelStyle: { fill: '#fff', fontSize: 10 } },
  { id: 'e2-4', source: '2', target: '4', label: 'False' },
  { id: 'e4-5', source: '4', target: '5' },
];

export function FlowBuilder({ activeItem }: { activeItem: any }) {
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
      const result = await executeKernelAction("flows.save_definition", {
        workspaceId: "workspace-acme-prod", // Mocked
        key: activeItem.id,
        name: activeItem.label,
        definition: { nodes, edges }
      });
      if (result.success) alert("Fluxo de automação salvo e registrado no Kernel!");
    } catch (e) {
      alert("Falha ao salvar fluxo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 h-full bg-[#1e1e20] pattern-dark">
      <div className="absolute top-4 right-4 z-20">
         <button
           onClick={handleSave}
           disabled={isSaving}
           className="bg-white/10 text-white border border-white/20 text-xs font-bold py-2 px-4 rounded shadow-sm hover:bg-white/20 flex items-center gap-2"
           data-testid="btn-save-flow"
         >
           {isSaving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
           Save Automation
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
        <Background variant={BackgroundVariant.Lines} gap={30} size={1} color="#333" />
        <Controls className="fill-white" />

        <Panel position="top-right" className="bg-[#0f1115] p-3 border border-white/10 rounded-md shadow-2xl flex flex-col gap-2 w-48 mt-12">
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-tighter mb-1">Automation Nodes</p>
          <button className="text-[10px] p-2 bg-white/5 hover:bg-white/10 text-white rounded text-left flex items-center gap-2">
            <Zap className="size-3 text-amber-500" /> + Add Event
          </button>
          <button className="text-[10px] p-2 bg-white/5 hover:bg-white/10 text-white rounded text-left flex items-center gap-2">
            <BrainCircuit className="size-3 text-purple-500" /> + AI Task
          </button>
          <button className="text-[10px] p-2 bg-white/5 hover:bg-white/10 text-white rounded text-left flex items-center gap-2">
            <Globe className="size-3 text-blue-500" /> + Webhook
          </button>
        </Panel>

        <Panel position="top-left" className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded text-emerald-500">
           <div className="flex items-center gap-2">
             <Zap className="size-3 animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Logic & Automation Builder</span>
           </div>
        </Panel>
      </ReactFlow>

      <style jsx global>{`
        .pattern-dark {
          background-image: radial-gradient(#2c2e33 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .react-flow__edge-path {
          stroke: #444;
          stroke-width: 2;
        }
        .react-flow__controls button {
          background: #0f1115;
          border-bottom: 1px solid #333;
          color: white;
        }
        .react-flow__controls button:hover {
          background: #1a1c20;
        }
      `}</style>
    </div>
  );
}
