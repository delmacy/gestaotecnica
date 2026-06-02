import React from "react";
import type { NodePreviewProps } from "./index";

export function FormNodePreview({ node }: NodePreviewProps) {
  const config = node.config || {};
  const formName = (config.formName as string) || "Formulário Desconhecido";
  const submitLabel = (config.submitLabel as string) || "Enviar";
  const rawFields = (config.fieldsJson as string) || "[]";

  let fields: any = [];
  let isJsonValid = false;

  try {
    fields = JSON.parse(rawFields);
    isJsonValid = Array.isArray(fields);
  } catch {
    isJsonValid = false;
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-slate-800">{node.label}</h3>
      {node.description && <p className="text-sm text-slate-600">{node.description}</p>}

      <div className="bg-white p-5 rounded-md border border-slate-200 mt-2 shadow-sm">
        <h4 className="text-md font-medium text-slate-800 border-b border-slate-100 pb-2 mb-4">{formName}</h4>

        {isJsonValid && fields.length > 0 ? (
          <ul className="flex flex-col gap-3 mb-6">
            {fields.map((f: any, idx: number) => (
              <li key={idx} className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">{f.label || f.name || `Campo ${idx + 1}`}</label>
                <div className="h-8 bg-slate-50 border border-slate-200 rounded px-3 flex items-center text-slate-400 text-xs italic">
                  {f.type || "text"}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-slate-500 font-mono bg-slate-50 p-3 rounded border border-slate-200 mb-6 overflow-x-auto">
            {rawFields}
          </div>
        )}

        <div className="flex justify-end">
          <button disabled className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium opacity-50 cursor-not-allowed">
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
