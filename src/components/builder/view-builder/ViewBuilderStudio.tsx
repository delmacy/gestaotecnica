"use client";

import { useState, useEffect } from "react";
import { VIEW_BLUEPRINTS } from "./view-builder-data";
import { ViewBlueprint, ViewType } from "./view-builder-types";

// Components
import { ViewBlueprintList } from "./ViewBlueprintList";
import { ViewTypeSelector } from "./ViewTypeSelector";
import { ViewCanvas } from "./ViewCanvas";
import { ViewFieldPalette } from "./ViewFieldPalette";
import { ViewFiltersPanel } from "./ViewFiltersPanel";
import { ViewSortingPanel } from "./ViewSortingPanel";
import { ViewActionsPanel } from "./ViewActionsPanel";
import { ViewBindingsPanel } from "./ViewBindingsPanel";
import { ViewGovernancePanel } from "./ViewGovernancePanel";

type ActiveTab = "fields" | "filters" | "sorting" | "actions" | "bindings" | "governance";

export function ViewBuilderStudio() {
  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("fields");

  // Simulated local state for the current session
  const [simulatedType, setSimulatedType] = useState<ViewType | null>(null);
  const [simulatedFields, setSimulatedFields] = useState<Record<string, boolean>>({});

  const activeBlueprint = VIEW_BLUEPRINTS.find(b => b.id === selectedBlueprintId) || null;

  // Reset simulated state when a new blueprint is selected
  useEffect(() => {
    if (activeBlueprint) {
      setSimulatedType(activeBlueprint.view_type);
      setSimulatedFields({}); // Clear overrides
    }
  }, [activeBlueprint]);

  const handleToggleField = (fieldId: string) => {
    if (!activeBlueprint) return;
    const field = activeBlueprint.fields.find(f => f.id === fieldId);
    if (!field) return;

    setSimulatedFields(prev => {
      const currentState = prev[fieldId] !== undefined ? prev[fieldId] : field.visible;
      return { ...prev, [fieldId]: !currentState };
    });
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* Left Sidebar - Blueprints */}
      <ViewBlueprintList
        blueprints={VIEW_BLUEPRINTS}
        selectedBlueprintId={selectedBlueprintId}
        onSelect={setSelectedBlueprintId}
      />

      {/* Main Content Area */}
      {activeBlueprint && simulatedType ? (
        <div className="flex-1 flex flex-col min-w-0">

          {/* View Type Selector / Toolbar */}
          <ViewTypeSelector
            currentType={simulatedType}
            onChange={setSimulatedType}
          />

          <div className="flex-1 flex overflow-hidden">
            {/* Center Canvas */}
            <ViewCanvas
              blueprint={activeBlueprint}
              simulatedType={simulatedType}
              simulatedFields={simulatedFields}
            />

            {/* Right Sidebar - Properties */}
            <div className="w-80 border-l bg-white flex flex-col shrink-0">
              {/* Tabs */}
              <div className="flex border-b text-xs overflow-x-auto bg-gray-50/50">
                {(["fields", "filters", "sorting", "actions", "bindings", "governance"] as ActiveTab[]).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-2.5 font-medium whitespace-nowrap capitalize transition-colors ${
                      activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/30"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-hidden relative">
                {activeTab === "fields" && (
                  <ViewFieldPalette
                    fields={activeBlueprint.fields}
                    simulatedFields={simulatedFields}
                    onToggleVisibility={handleToggleField}
                  />
                )}
                {activeTab === "filters" && <ViewFiltersPanel blueprint={activeBlueprint} />}
                {activeTab === "sorting" && <ViewSortingPanel blueprint={activeBlueprint} />}
                {activeTab === "actions" && <ViewActionsPanel blueprint={activeBlueprint} />}
                {activeTab === "bindings" && <ViewBindingsPanel blueprint={activeBlueprint} />}
                {activeTab === "governance" && <ViewGovernancePanel blueprint={activeBlueprint} />}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-400">
           <div className="text-center">
             <div className="text-4xl mb-2">📐</div>
             <p>Select a view blueprint to begin simulation</p>
           </div>
        </div>
      )}
    </div>
  );
}
