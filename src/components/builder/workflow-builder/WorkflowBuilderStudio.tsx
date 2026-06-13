"use client";

import { useState } from "react";
import { mockBlueprints } from "./workflow-builder-data";
import { WorkflowBlueprintList } from "./WorkflowBlueprintList";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { WorkflowNodePalette } from "./WorkflowNodePalette";
import { WorkflowNodeDetailPanel } from "./WorkflowNodeDetailPanel";
import { WorkflowTransitionPanel } from "./WorkflowTransitionPanel";
import { WorkflowBindingsPanel } from "./WorkflowBindingsPanel";
import { WorkflowActionPanel } from "./WorkflowActionPanel";
import { WorkflowConditionPanel } from "./WorkflowConditionPanel";
import { WorkflowGovernancePanel } from "./WorkflowGovernancePanel";

export function WorkflowBuilderStudio() {
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "transitions" | "bindings" | "actions" | "conditions" | "governance">("details");

  const blueprint = mockBlueprints.find(bp => bp.id === selectedBlueprintId) || null;
  const selectedNode = blueprint?.nodes.find(n => n.id === selectedNodeId) || null;

  const handleSelectBlueprint = (id: string) => {
    setSelectedBlueprintId(id);
    setSelectedNodeId(null);
  };

  return (
    <div className="flex h-[calc(100vh-100px)] border rounded-lg overflow-hidden bg-background">
      {/* Left Sidebar */}
      <WorkflowBlueprintList
        blueprints={mockBlueprints}
        selectedId={selectedBlueprintId}
        onSelect={handleSelectBlueprint}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        <div className="p-3 bg-muted/30 border-b flex items-center justify-between">
          <div className="font-semibold text-sm">
            {blueprint ? blueprint.name : "Select a Blueprint"}
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">Design-only / Mock Mode</span>
            <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded">Not a runtime workflow</span>
          </div>
        </div>

        <WorkflowCanvas
          blueprint={blueprint}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
        />

        {blueprint && <WorkflowNodePalette />}
      </div>

      {/* Right Sidebar */}
      {blueprint && selectedNode && (
        <div className="w-80 border-l bg-background flex flex-col h-full">
          <div className="p-4 border-b">
            <h3 className="font-semibold">{selectedNode.label}</h3>
            <p className="text-xs text-muted-foreground uppercase mt-1">{selectedNode.type} Node</p>
          </div>

          <div className="flex border-b overflow-x-auto text-xs scrollbar-hide">
            {["details", "transitions", "bindings", "actions", "conditions", "governance"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-3 capitalize whitespace-nowrap border-b-2 font-medium ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-4">
            {activeTab === "details" && <WorkflowNodeDetailPanel node={selectedNode} />}
            {activeTab === "transitions" && <WorkflowTransitionPanel transitions={blueprint.transitions} sourceNodeId={selectedNode.id} />}
            {activeTab === "bindings" && <WorkflowBindingsPanel node={selectedNode} />}
            {activeTab === "actions" && <WorkflowActionPanel node={selectedNode} />}
            {activeTab === "conditions" && <WorkflowConditionPanel node={selectedNode} />}
            {activeTab === "governance" && <WorkflowGovernancePanel node={selectedNode} />}
          </div>
        </div>
      )}

      {blueprint && !selectedNode && (
        <div className="w-80 border-l bg-background flex items-center justify-center p-6 text-center text-muted-foreground">
          Select a node on the canvas to view details and properties.
        </div>
      )}
    </div>
  );
}
