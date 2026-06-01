import React from "react";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import type { BuilderFlowNode } from "./builder-flow-types";

export function BuilderFlowNodeComponent({ data }: NodeProps<BuilderFlowNode>) {
  const { builderNode, selected } = data;
  const isStart = builderNode.type === "start";
  const isEnd = builderNode.type === "end";
  const isDecision = builderNode.type === "decision";

  return (
    <div
      className={`flex flex-col bg-white border-2 rounded-lg p-4 w-64 shadow-sm transition-all ${
        selected ? "border-blue-500 shadow-md ring-4 ring-blue-500/20" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {!isStart && (
        <Handle
          type="target"
          position={Position.Top}
          id="previous"
          className="w-3 h-3 border-2 border-white bg-slate-400"
        />
      )}

      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
          {builderNode.type}
        </span>
      </div>
      <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{builderNode.label}</h4>
      {builderNode.description && (
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{builderNode.description}</p>
      )}

      {!isEnd && !isDecision && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="next"
          className="w-3 h-3 border-2 border-white bg-blue-500"
        />
      )}

      {isDecision && (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="w-3 h-3 border-2 border-white bg-green-500 translate-x-[-15px]"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="w-3 h-3 border-2 border-white bg-red-500 translate-x-[15px]"
          />
        </>
      )}
    </div>
  );
}
