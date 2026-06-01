"use client";

import React, { useCallback, useMemo } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Connection,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import type { BuilderEditorActions, BuilderEditorState } from "../state";
import { BuilderFlowNodeComponent } from "./builder-flow-node";
import {
  toBuilderFlowNodes,
  toBuilderFlowEdges,
  applyBuilderNodePositions,
  createBuilderEdgeFromConnection,
} from "./builder-flow-adapter";

type BuilderCanvasProps = {
  state: BuilderEditorState;
  actions: BuilderEditorActions;
};

const nodeTypes = {
  builderNode: BuilderFlowNodeComponent,
};

function BuilderCanvasInner({ state, actions }: BuilderCanvasProps) {
  // Sync canonical Builder domain model to internal React Flow states when state changes
  const initialNodes = useMemo(
    () => toBuilderFlowNodes(state.draft.nodes, state.selectedNodeId),
    [state.draft.nodes, state.selectedNodeId]
  );

  const initialEdges = useMemo(
    () => toBuilderFlowEdges(state.draft.edges),
    [state.draft.edges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // When parent state updates (like adding a node), reflect into ReactFlow
  React.useEffect(() => {
    setNodes(toBuilderFlowNodes(state.draft.nodes, state.selectedNodeId));
    setEdges(toBuilderFlowEdges(state.draft.edges));
  }, [state.draft.nodes, state.draft.edges, state.selectedNodeId, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      try {
        const canonicalEdge = createBuilderEdgeFromConnection({
          id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
        });
        actions.addEdge(canonicalEdge);
      } catch (error) {
        console.error("Failed to connect:", error);
      }
    },
    [actions]
  );

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, __: any, flowNodes: any[]) => {
      // XYFlow triggers this. We sync back to our canonical domain state.
      const canonicalNodes = applyBuilderNodePositions(state.draft.nodes, flowNodes);
      actions.updateNodePositions(canonicalNodes);
    },
    [actions, state.draft.nodes]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => {
      actions.selectNode(node.id);
    },
    [actions]
  );

  const onPaneClick = useCallback(() => {
    actions.clearSelection();
  }, [actions]);

  return (
    <div className="w-full h-full bg-slate-50 relative">
      {/* Top overlay bar */}
      <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur border border-slate-200 rounded-md px-3 py-1.5 flex gap-4 text-xs font-medium text-slate-600 shadow-sm pointer-events-none">
        <span>Blocos: {state.draft.nodes.length}</span>
        <span>Conexões: {state.draft.edges.length}</span>
        {state.dirty && <span className="text-amber-600">Não salvo</span>}
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export function BuilderCanvas(props: BuilderCanvasProps) {
  return (
    <ReactFlowProvider>
      <BuilderCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
