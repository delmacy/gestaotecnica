"use client";

import React, { useCallback, useEffect, useState } from 'react';
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
import { Zap, Bell, Globe, BrainCircuit, Code, MessageSquare, ShieldAlert, Save, Loader2, Search, Plus } from "lucide-react";
import { executeKernelAction, getPlatformDiscoveryData } from "@/platform/actions/remote-actions";

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
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<FlowNodeData>>(
    [],
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [discovery, setDiscovery] = useState<{ actions: any[]; events: any[] }>({
    actions: [],
    events: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string>("draft");

  useEffect(() => {
    getPlatformDiscoveryData().then(setDiscovery);
  }, []);

  useEffect(() => {
    const loadFlow = async () => {
      const result = await executeKernelAction("flows.get_definition", {
        key: activeItem.id,
      });
      if (result.success && result.data) {
        const flow = result.data as any;
        if (flow.definition?.nodes) {
          setNodes(flow.definition.nodes);
          setEdges(flow.definition.edges || []);
        }
        setStatus(flow.status || "draft");
      } else {
        setNodes(initialNodes);
        setEdges(initialEdges);
        setStatus("draft");
      }
    };
    loadFlow();
  }, [activeItem.id, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await executeKernelAction("flows.save_definition", {
        workspaceId: "workspace-acme-prod",
        key: activeItem.id,
        name: activeItem.label,
        definition: { nodes, edges },
      });
      if (result.success) {
        alert("Fluxo de automação salvo e registrado no Kernel!");
        setStatus("draft");
      }
    } catch (e) {
      alert("Falha ao salvar fluxo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const result = await executeKernelAction("flows.publish", {
        workspaceId: "workspace-acme-prod",
        key: activeItem.id,
      });
      if (result.success) {
        alert("Fluxo publicado com sucesso!");
        setStatus("published");
      }
    } catch (e) {
      alert("Falha ao publicar fluxo.");
    } finally {
      setIsPublishing(false);
    }
  };

  const addDiscoveryNode = (item: any, type: "action" | "event") => {
    const id = `node-${Date.now()}`;
    const newNode: Node<FlowNodeData> = {
      id,
      type: 'flow',
      position: { x: 100, y: 100 },
      data: { label: item.key, type }
    };
    setNodes(nds => nds.concat(newNode));
  };

  const filteredActions = discovery.actions.filter(a => a.key.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredEvents = discovery.events.filter(e => e.key.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex-1 h-full bg-[#1e1e20] pattern-dark flex overflow-hidden">
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <div
            className={cn(
              "px-3 py-2 rounded text-[10px] font-bold uppercase border flex items-center gap-2",
              status === "published"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                : "bg-amber-500/10 border-amber-500/20 text-amber-500",
            )}
          >
            <div
              className={cn(
                "size-1.5 rounded-full",
                status === "published" ? "bg-emerald-500" : "bg-amber-500",
              )}
            />
            {status}
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-white/10 text-white border border-white/20 text-xs font-bold py-2 px-4 rounded shadow-sm hover:bg-white/20 flex items-center gap-2"
            data-testid="btn-save-flow"
          >
            {isSaving ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Save className="size-3" />
            )}
            Save
          </button>

          <button
            onClick={handlePublish}
            disabled={isPublishing || status === "published"}
            className={cn(
              "text-xs font-bold py-2 px-4 rounded shadow-sm flex items-center gap-2 transition-all",
              status === "published"
                ? "bg-emerald-600/50 text-white/50 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-500",
            )}
          >
            {isPublishing ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Zap className="size-3" />
            )}
            Publish
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

          <Panel position="top-left" className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded text-emerald-500">
             <div className="flex items-center gap-2">
               <Zap className="size-3 animate-pulse" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Logic & Automation Builder</span>
             </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Discovery Catalog Sidebar (Right side of canvas) */}
      <aside className="w-80 bg-[#0f1115] border-l border-white/10 flex flex-col shrink-0 overflow-hidden">
         <div className="p-4 border-b border-white/10">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Platform Discovery</h3>
            <div className="relative">
               <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-white/40" />
               <input
                 type="text"
                 placeholder="Search events or actions..."
                 className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-8 pr-2 text-xs text-white outline-none focus:border-primary"
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <section>
               <h4 className="text-[10px] font-bold text-white/40 uppercase mb-3 flex items-center gap-2">
                 <Zap className="size-3 text-amber-500" /> Emitted Events
               </h4>
               <div className="space-y-2">
                  {filteredEvents.map(event => (
                    <div
                      key={event.key}
                      onClick={() => addDiscoveryNode(event, 'event')}
                      className="p-2 bg-white/5 border border-white/5 rounded hover:border-amber-500/50 hover:bg-amber-500/5 transition-all cursor-pointer group"
                    >
                       <div className="text-[11px] font-bold text-white group-hover:text-amber-500 transition-colors">{event.key}</div>
                       <div className="text-[9px] text-white/40 truncate">{event.description || 'No description'}</div>
                    </div>
                  ))}
               </div>
            </section>

            <section>
               <h4 className="text-[10px] font-bold text-white/40 uppercase mb-3 flex items-center gap-2">
                 <Plus className="size-3 text-emerald-500" /> Available Actions
               </h4>
               <div className="space-y-2">
                  {filteredActions.map(action => (
                    <div
                      key={action.key}
                      onClick={() => addDiscoveryNode(action, 'action')}
                      className="p-2 bg-white/5 border border-white/5 rounded hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer group"
                    >
                       <div className="text-[11px] font-bold text-white group-hover:text-emerald-500 transition-colors">{action.key}</div>
                       <div className="text-[9px] text-white/40 truncate">{action.description || 'No description'}</div>
                    </div>
                  ))}
               </div>
            </section>
         </div>
      </aside>

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
