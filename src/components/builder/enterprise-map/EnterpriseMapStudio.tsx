/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo } from 'react';
import { ReactFlow, Controls, Background, MiniMap, useNodesState, useEdgesState, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { mockBlueprints } from './enterprise-map-data';
import { EnterpriseMapNode } from './EnterpriseMapNode';
import { PerspectiveType, EnterpriseMapNode as MyNode, EnterpriseMapEdge as MyEdge } from './enterprise-map-types';

const nodeTypes = {
  customNode: EnterpriseMapNode,
};

export function EnterpriseMapStudio() {
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>(mockBlueprints[0].id);
  const [perspective, setPerspective] = useState<PerspectiveType>('process');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const currentBlueprint = useMemo(() => {
    return mockBlueprints.find(b => b.id === selectedBlueprintId) || mockBlueprints[0];
  }, [selectedBlueprintId]);

  // Transform our types to ReactFlow types
  const initialNodes: Node[] = currentBlueprint.nodes.map(n => ({
    id: n.id,
    type: n.type,
    position: n.position,
    data: n.data as any
  }));

  const initialEdges: Edge[] = currentBlueprint.edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    animated: e.animated,
    data: e.data as any
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Apply filters based on perspective
  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
      const type = (n.data as any).type;
      switch (perspective) {
        case 'process':
          return ['domain', 'capability', 'process', 'process_step'].includes(type as string);
        case 'capability':
          return ['domain', 'capability', 'system', 'application'].includes(type as string);
        case 'systems':
          return ['system', 'application', 'integration_placeholder', 'data_object'].includes(type as string);
        case 'data':
          return ['process', 'data_object', 'document'].includes(type as string);
        case 'people':
          return ['process', 'actor_role', 'owner_placeholder'].includes(type as string);
        case 'risk_gap':
          return ['process', 'system', 'risk', 'gap'].includes(type as string);
        case 'evidence':
          return ['process', 'evidence', 'governance_rule'].includes(type as string);
        case 'value_stream':
        default:
          return true; // Show all for now if unmapped
      }
    });
  }, [nodes, perspective]);

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = useMemo(() => {
    return edges.filter(e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target));
  }, [edges, filteredNodeIds]);

  const selectedNodeData = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodes.find(n => n.id === selectedNodeId)?.data;
  }, [nodes, selectedNodeId]);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header / Top bar specific to Enterprise Map */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Enterprise Map</h1>
          <div className="flex items-center gap-2 text-sm text-amber-600 font-medium">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700">!</span>
            Synthetic / Design-only Map. No real data is persisted.
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label className="text-xs text-slate-500 font-semibold mb-1">Blueprint</label>
            <select
              value={selectedBlueprintId}
              onChange={(e) => {
                setSelectedBlueprintId(e.target.value);
                const newBp = mockBlueprints.find(b => b.id === e.target.value);
                if (newBp) {
                  setNodes(newBp.nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: n.data as any })));
                  setEdges(newBp.edges.map(e => ({ id: e.id, source: e.source, target: e.target, animated: e.animated, data: e.data as any })));
                  setSelectedNodeId(null);
                }
              }}
              className="text-sm border border-slate-300 rounded px-2 py-1 bg-white"
            >
              {mockBlueprints.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-slate-500 font-semibold mb-1">Perspective</label>
            <select
              value={perspective}
              onChange={(e) => setPerspective(e.target.value as PerspectiveType)}
              className="text-sm border border-slate-300 rounded px-2 py-1 bg-white"
            >
              <option value="process">Process View</option>
              <option value="capability">Capability View</option>
              <option value="value_stream">Value Stream View</option>
              <option value="systems">Systems View</option>
              <option value="data">Data View</option>
              <option value="people">People/Roles View</option>
              <option value="risk_gap">Risk & Gap View</option>
              <option value="evidence">Evidence View</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 relative border-r border-slate-200 bg-slate-50/50">
          <ReactFlow
            nodes={filteredNodes}
            edges={filteredEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
          >
            <Background color="#ccc" gap={16} />
            <Controls />
            <MiniMap
              nodeColor={(n) => {
                const data = n.data as any;
                if (data.type === 'domain') return '#e0e7ff';
                if (data.type === 'capability') return '#dbeafe';
                if (data.type === 'process') return '#d1fae5';
                if (data.type === 'system') return '#ffedd5';
                return '#f1f5f9';
              }}
            />
          </ReactFlow>

          <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow border border-slate-200 text-xs backdrop-blur">
            <h4 className="font-bold mb-2">Legend</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-100 border border-indigo-300 rounded"></div> Domain</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div> Capability</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded"></div> Process</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div> System</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-cyan-100 border border-cyan-300 rounded"></div> Data/Doc</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div> Role</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div> Risk/Gap</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div> Evidence</div>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="w-80 bg-white p-4 overflow-y-auto">
          {selectedNodeData ? (
            <div>
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {(selectedNodeData as any).type.replace('_', ' ')}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-2">{(selectedNodeData as any).label}</h3>
                {(selectedNodeData as any).synthetic && (
                  <span className="text-xs text-amber-600 italic">Synthetic Data</span>
                )}
              </div>
              <div className="text-sm text-slate-600 mb-6">
                {(selectedNodeData as any).description}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-2 border-b pb-1">Details</h4>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li><span className="font-medium">Data Source:</span> {(selectedNodeData as any).dataSourceMode}</li>
                    <li><span className="font-medium">Readiness:</span> {(selectedNodeData as any).readinessStatus}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-2 border-b pb-1">Relationships</h4>
                  <ul className="text-xs text-slate-600 space-y-2">
                    {edges.filter(e => e.source === selectedNodeId || e.target === selectedNodeId).map(e => {
                      const isSource = e.source === selectedNodeId;
                      const relatedNodeId = isSource ? e.target : e.source;
                      const relatedNode = nodes.find(n => n.id === relatedNodeId);
                      const relData = e.data as any;
                      return (
                        <li key={e.id} className="bg-slate-50 p-2 rounded border border-slate-100">
                          <span className="font-medium text-blue-600">
                            {isSource ? (relData?.type || 'connects to') : `is ${(relData?.type || 'connected')} by`}
                          </span>
                          {' '}{(relatedNode?.data as any)?.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 mt-10">
              <div className="text-4xl mb-2">👈</div>
              <p className="text-sm">Select a node in the map to view its details.</p>
              <div className="mt-8 text-left bg-slate-50 p-3 rounded text-xs border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-2">Blueprint Summary</h4>
                <ul className="space-y-1 text-slate-600">
                  <li><span className="font-medium">Total Nodes:</span> {filteredNodes.length}</li>
                  <li><span className="font-medium">Total Relationships:</span> {filteredEdges.length}</li>
                  <li><span className="font-medium">Scope:</span> {currentBlueprint.mapScope}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
