"use client";

import React, { useState } from "react";
import { FormBlueprintList } from "./FormBlueprintList";
import { FormFieldPalette } from "./FormFieldPalette";
import { FormCanvas } from "./FormCanvas";
import { FormPreviewPanel } from "./FormPreviewPanel";
import { FormFieldDetailPanel } from "./FormFieldDetailPanel";
import { FormValidationPanel } from "./FormValidationPanel";
import { FormBindingsPanel } from "./FormBindingsPanel";
import { FormGovernancePanel } from "./FormGovernancePanel";
import { MOCK_FORM_BUILDER_DATA } from "./form-builder-data";
import { FormField, FormBlueprint } from "./form-builder-types";
import { Brush, Eye, LayoutTemplate, AlertTriangle } from "lucide-react";

export function FormBuilderStudio() {
  const blueprints = MOCK_FORM_BUILDER_DATA.blueprints;

  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string | null>(
    blueprints.length > 0 ? blueprints[0].id : null
  );

  const activeBlueprint: FormBlueprint | undefined = blueprints.find(b => b.id === selectedBlueprintId);

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  // Tabs states
  const [centerTab, setCenterTab] = useState<"design" | "preview">("design");
  const [rightTab, setRightTab] = useState<"palette" | "properties" | "validation" | "bindings" | "governance">("properties");

  // Local state to simulate properties editing without actually saving
  const [mockedFieldsState, setMockedFieldsState] = useState<Record<string, FormField>>({});

  const handleSelectBlueprint = (id: string) => {
    setSelectedBlueprintId(id);
    setSelectedFieldId(null);
    setMockedFieldsState({}); // Reset local edits on change
  };

  const handleSelectField = (id: string) => {
    setSelectedFieldId(id);
    setRightTab("properties");
  };

  const handleUpdateMockField = (updatedField: FormField) => {
    setMockedFieldsState(prev => ({ ...prev, [updatedField.id]: updatedField }));
  };

  const activeFieldRaw = activeBlueprint?.fields.find(f => f.id === selectedFieldId);
  const activeField = activeFieldRaw ? (mockedFieldsState[activeFieldRaw.id] || activeFieldRaw) : null;
  const activeFieldGovWarnings = activeBlueprint && activeField ? activeBlueprint.governance_warnings.filter(w => w.field_key === activeField.key) : [];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">

      {/* Top Warning Banner */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-2 flex items-center justify-center gap-3 text-yellow-800 dark:text-yellow-500 text-sm mb-4 rounded-lg shrink-0">
        <div title="Warning"><AlertTriangle className="h-4 w-4" /></div>
        <p>
          <strong>Design-only Mode:</strong> Formulários desenhados aqui não são persistidos nem geram rotas de backend nesta fase do projeto.
        </p>
      </div>

      <div className="flex h-full gap-4 overflow-hidden">

        {/* LEFT COLUMN: Blueprints */}
        <div className="w-64 shrink-0 flex flex-col border rounded-xl bg-background shadow-sm overflow-hidden">
          <div className="p-3 border-b bg-muted/20 font-semibold text-sm">
            Form Blueprints
          </div>
          <div className="flex-1 overflow-hidden">
            <FormBlueprintList
              blueprints={blueprints}
              selectedId={selectedBlueprintId}
              onSelect={handleSelectBlueprint}
            />
          </div>
        </div>

        {/* CENTER COLUMN: Canvas or Preview */}
        <div className="flex-1 flex flex-col min-w-0 border rounded-xl bg-background shadow-sm overflow-hidden">
          {/* Header Switcher */}
          <div className="p-2 border-b bg-muted/20 flex justify-center gap-2">
            <button
              onClick={() => setCenterTab("design")}
              className={`flex items-center gap-2 px-6 py-1.5 text-sm font-medium rounded-md transition-all ${
                centerTab === "design"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <div title="Design"><Brush className="h-4 w-4" /></div>
              Canvas
            </button>
            <button
              onClick={() => setCenterTab("preview")}
              className={`flex items-center gap-2 px-6 py-1.5 text-sm font-medium rounded-md transition-all ${
                centerTab === "preview"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <div title="Preview"><Eye className="h-4 w-4" /></div>
              Preview
            </button>
          </div>

          {/* Center Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeBlueprint ? (
              centerTab === "design" ? (
                <FormCanvas
                  blueprint={activeBlueprint}
                  selectedFieldId={selectedFieldId}
                  onSelectField={handleSelectField}
                  mockedFieldsState={mockedFieldsState}
                />
              ) : (
                <FormPreviewPanel
                  blueprint={activeBlueprint}
                  mockedFieldsState={mockedFieldsState}
                />
              )
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                <div title="Layout"><LayoutTemplate className="h-12 w-12 mb-4 opacity-20" /></div>
                <p>Nenhum Blueprint Selecionado</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Inspector / Palette */}
        <div className="w-80 shrink-0 flex flex-col border rounded-xl bg-background shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex flex-wrap bg-muted/20 p-1 border-b">
            {[
              { id: "palette", label: "Add" },
              { id: "properties", label: "Props" },
              { id: "validation", label: "Rules" },
              { id: "bindings", label: "Bind" },
              { id: "governance", label: "Gov" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRightTab(tab.id as any)}
                className={`flex-1 min-w-[50px] px-1 py-1.5 text-[11px] font-medium rounded transition-all ${
                  rightTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Content */}
          <div className="flex-1 overflow-hidden">
            {rightTab === "palette" && <FormFieldPalette />}

            {rightTab !== "palette" && !activeField && (
               <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center">
                 <div title="Select"><LayoutTemplate className="h-8 w-8 mb-2 opacity-20" /></div>
                 Selecione um campo no Canvas para inspecionar.
               </div>
            )}

            {rightTab === "properties" && activeField && (
              <FormFieldDetailPanel field={activeField} onUpdateMock={handleUpdateMockField} />
            )}

            {rightTab === "validation" && activeField && (
              <FormValidationPanel field={activeField} />
            )}

            {rightTab === "bindings" && activeField && (
              <FormBindingsPanel field={activeField} />
            )}

            {rightTab === "governance" && activeField && (
              <FormGovernancePanel warnings={activeFieldGovWarnings} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
