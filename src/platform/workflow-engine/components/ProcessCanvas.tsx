"use client";

import React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface ProcessCanvasProps {
  states: { key: string; name: string }[];
  transitions: { key: string; from: string; to: string; name: string }[];
}

export function ProcessCanvas({ states, transitions }: ProcessCanvasProps) {
  const nodes: Node[] = states.map((state, index) => ({
    id: state.key,
    data: { label: state.name },
    position: { x: index * 200, y: 100 },
    style: {
      background: "#fff",
      color: "#000",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "10px",
      fontSize: "12px",
      fontWeight: "600",
      textAlign: "center" as const,
      width: 150
    },
  }));

  const edges: Edge[] = transitions.map((t) => ({
    id: t.key,
    source: t.from,
    target: t.to,
    label: t.name,
    animated: true,
    style: { stroke: "#888" },
  }));

  return (
    <div style={{ height: 400, width: "100%", background: "#f9f9f9", border: "1px solid #eee", borderRadius: "8px" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
