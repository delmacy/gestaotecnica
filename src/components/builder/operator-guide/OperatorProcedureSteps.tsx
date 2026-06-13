"use client";

import { OperatorProcedureStep } from "./operator-guide-types";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function OperatorProcedureSteps({
  steps,
  expectedResult,
}: {
  steps: OperatorProcedureStep[];
  expectedResult?: string;
}) {
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (id: string) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real implementation, you might show a toast here.
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-slate-800 mb-4">Procedimentos</h3>
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-start gap-3 p-3 border rounded-md transition-colors ${
              checkedSteps[step.id] ? "bg-slate-50 border-slate-200" : "bg-white border-slate-200"
            }`}
          >
            <div className="pt-1">
              <button
                onClick={() => toggleStep(step.id)}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  checkedSteps[step.id]
                    ? "bg-slate-800 border-slate-800 text-white"
                    : "border-slate-300 hover:border-slate-400 bg-white"
                }`}
                aria-label={checkedSteps[step.id] ? "Desmarcar passo" : "Marcar passo"}
              >
                {checkedSteps[step.id] && (
                  <div title="Passo concluído">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            </div>
            <div className="flex-1">
              <h4
                className={`font-medium ${
                  checkedSteps[step.id] ? "text-slate-500 line-through" : "text-slate-800"
                }`}
              >
                {step.order}. {step.title}
                {step.is_optional && (
                  <span className="ml-2 text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded no-underline">
                    Opcional
                  </span>
                )}
              </h4>
              <p
                className={`mt-1 text-sm ${
                  checkedSteps[step.id] ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {step.description}
              </p>

              {step.command_text_placeholder && (
                <div className="mt-3 flex items-center gap-2 bg-slate-900 rounded-md p-2 overflow-hidden">
                  <code className="text-sm text-green-400 font-mono whitespace-nowrap overflow-x-auto flex-1 px-2 py-1 scrollbar-hide">
                    {step.command_text_placeholder}
                  </code>
                  <button
                    onClick={() => copyToClipboard(step.command_text_placeholder!)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors flex-shrink-0"
                    title="Copiar comando"
                  >
                    <div title="Copiar">
                      <Copy className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              )}

              {step.expected_result && (
                <div className="mt-2 text-sm bg-slate-50 text-slate-600 p-2 rounded border border-slate-100">
                  <span className="font-medium text-slate-700">Resultado esperado:</span>{" "}
                  {step.expected_result}
                </div>
              )}

              {step.related_route && (
                <div className="mt-2">
                  <Link
                    href={step.related_route}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    Abrir Rota Relacionada &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {expectedResult && (
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-md p-4">
          <h4 className="text-sm font-semibold text-slate-800 mb-1">Resultado Final Esperado</h4>
          <p className="text-sm text-slate-600">{expectedResult}</p>
        </div>
      )}
    </div>
  );
}
