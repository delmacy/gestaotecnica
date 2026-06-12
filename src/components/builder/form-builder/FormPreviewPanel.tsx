"use client";

import React from "react";
import { FormBlueprint, FormSection, FormField } from "./form-builder-types";

interface Props {
  blueprint: FormBlueprint;
  mockedFieldsState: Record<string, FormField>;
}

export function FormPreviewPanel({ blueprint, mockedFieldsState }: Props) {

  const sortedSections = [...blueprint.sections].sort((a, b) => a.order - b.order);

  const renderFieldInput = (field: FormField) => {
    const baseClasses = "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    switch (field.field_type) {
      case 'textarea':
        return <textarea className={`${baseClasses} min-h-[100px] resize-none`} placeholder={field.placeholder} disabled />;
      case 'select':
        return (
          <select className={baseClasses} disabled>
            <option>{field.placeholder || "Select..."}</option>
            {field.options?.map((o, i) => <option key={i} value={o.value}>{o.label}</option>)}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2 h-10">
            <input type="checkbox" id={field.id} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" disabled />
            <label htmlFor={field.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
               {field.help_text || "Confirmar"}
            </label>
          </div>
        );
      case 'radio':
         return (
           <div className="flex gap-4 pt-2">
             {field.options?.map((o, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <input type="radio" id={`${field.id}-${i}`} name={field.key} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" disabled />
                  <label htmlFor={`${field.id}-${i}`} className="text-sm font-medium">{o.label}</label>
                </div>
             ))}
           </div>
         );
      case 'photo_placeholder':
      case 'file_placeholder':
      case 'signature_placeholder':
         return (
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
               <span className="text-sm font-medium">{field.field_type.replace('_placeholder', '').toUpperCase()} COMPONENT</span>
               <span className="text-xs mt-1">Widget will be injected at runtime.</span>
            </div>
         );
      default:
        return <input type={field.field_type === 'number' ? 'number' : 'text'} className={`${baseClasses} h-10`} placeholder={field.placeholder} disabled />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:px-12 bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto space-y-12 pb-24 border rounded-xl p-8 shadow-sm">

        <div className="space-y-2 border-b pb-6">
          <h1 className="text-2xl font-bold">{blueprint.name}</h1>
          <p className="text-muted-foreground text-sm">{blueprint.description}</p>
        </div>

        <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
          {sortedSections.map((section: FormSection) => {
            const sectionFields = blueprint.fields.filter(f => f.section_id === section.id).map(f => mockedFieldsState[f.id] || f);

            return (
              <div key={section.id} className="space-y-6">
                <div className="border-b pb-2">
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                  {section.description && <p className="text-sm text-muted-foreground mt-1">{section.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sectionFields.map((field) => (
                    <div
                      key={field.id}
                      className={`flex flex-col gap-1.5 ${field.layout?.gridSpan === 2 ? "col-span-1 md:col-span-2" : "col-span-1"}`}
                    >
                      <label className="text-sm font-medium leading-none">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.field_type !== 'checkbox' && field.help_text && (
                        <p className="text-[11px] text-muted-foreground">{field.help_text}</p>
                      )}
                      {renderFieldInput(field)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="pt-6 flex justify-end">
            <button disabled className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium opacity-50 cursor-not-allowed">
              Submit (Disabled in Preview)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
