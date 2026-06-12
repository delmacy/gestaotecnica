"use client";

import React from "react";
import { FormBlueprint, FormSection, FormField } from "./form-builder-types";
import { FormFieldCard } from "./FormFieldCard";

interface Props {
  blueprint: FormBlueprint;
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  mockedFieldsState: Record<string, FormField>; // State that holds localized mock edits
}

export function FormCanvas({ blueprint, selectedFieldId, onSelectField, mockedFieldsState }: Props) {

  if (blueprint.sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
        <p>No sections defined for this blueprint.</p>
      </div>
    );
  }

  // Sort sections by order
  const sortedSections = [...blueprint.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:px-12 bg-slate-50/50 dark:bg-black/20">
      <div className="max-w-3xl mx-auto space-y-12 pb-24">

        {/* Form Title & Header */}
        <div className="text-center space-y-2 border-b pb-6">
          <h1 className="text-3xl font-bold">{blueprint.name}</h1>
          <p className="text-muted-foreground">{blueprint.description}</p>
        </div>

        {/* Render Sections */}
        {sortedSections.map((section: FormSection) => {
          // Find fields for this section, prefer mocked state if edited, else raw
          const sectionFields = blueprint.fields.filter(f => f.section_id === section.id).map(f => mockedFieldsState[f.id] || f);

          return (
            <div key={section.id} className="space-y-6">
              <div className="border-b pb-2">
                <h2 className="text-xl font-semibold">{section.title}</h2>
                {section.description && <p className="text-sm text-muted-foreground mt-1">{section.description}</p>}
              </div>

              {sectionFields.length === 0 ? (
                <div className="p-6 border border-dashed rounded-lg text-center text-sm text-muted-foreground">
                  Section empty. Drag fields here. (Simulated)
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sectionFields.map((field) => {
                    const hasGovWarning = blueprint.governance_warnings.some(w => w.field_key === field.key);
                    const isSelected = field.id === selectedFieldId;

                    return (
                      <div
                        key={field.id}
                        className={field.layout?.gridSpan === 2 ? "col-span-1 md:col-span-2" : "col-span-1"}
                      >
                        <FormFieldCard
                          field={field}
                          isSelected={isSelected}
                          onSelect={() => onSelectField(field.id)}
                          hasGovernanceWarning={hasGovWarning}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
