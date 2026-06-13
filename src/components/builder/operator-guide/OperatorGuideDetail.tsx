"use client";

import { OperatorGuide } from "./operator-guide-types";
import { OperatorPrerequisites } from "./OperatorPrerequisites";
import { OperatorProcedureSteps } from "./OperatorProcedureSteps";
import { OperatorWarnings } from "./OperatorWarnings";
import { OperatorTroubleshooting } from "./OperatorTroubleshooting";
import { OperatorRelatedRoutes } from "./OperatorRelatedRoutes";
import { BookOpen, Users, Clock, Tag } from "lucide-react";

export function OperatorGuideDetail({ guide }: { guide: OperatorGuide | null }) {
  if (!guide) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50/50 rounded-lg border border-slate-200 border-dashed">
        <div title="Empty State">
          <BookOpen className="w-12 h-12 mb-4 opacity-30 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">Nenhum guia selecionado</p>
        <p className="text-sm mt-1 max-w-sm text-center">Selecione um guia na lista lateral para visualizar os procedimentos operacionais e checklists.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header do Guia */}
      <div className="border-b border-slate-200 p-6 bg-slate-50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium px-2 py-1 rounded bg-indigo-100 text-indigo-700 capitalize border border-indigo-200">
            {guide.category.replace("_", " ")}
          </span>
          {guide.synthetic && (
            <span className="text-xs font-medium px-2 py-1 rounded bg-slate-200 text-slate-600 border border-slate-300">
              Synthetic Mock
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{guide.title}</h2>
        <p className="text-slate-600 text-sm">{guide.description}</p>

        {/* Metadados */}
        <div className="flex flex-wrap gap-4 mt-5 pt-5 border-t border-slate-200">
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <div title="Audience"><Users className="w-4 h-4 text-slate-400" /></div>
            <span className="capitalize">{guide.audiences.join(", ").replace(/_/g, " ")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <div title="Difficulty"><Tag className="w-4 h-4 text-slate-400" /></div>
            <span className="capitalize">{guide.difficulty}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-600">
            <div title="Time"><Clock className="w-4 h-4 text-slate-400" /></div>
            <span>~5 min</span>
          </div>
        </div>
      </div>

      {/* Conteúdo Rolável */}
      <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
        <OperatorWarnings warnings={guide.warnings} />
        <OperatorPrerequisites prerequisites={guide.prerequisites} />
        <OperatorProcedureSteps steps={guide.procedures} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-100">
          <div>
            <OperatorTroubleshooting items={guide.troubleshooting} />
          </div>
          <div>
            <OperatorRelatedRoutes routes={guide.related_routes} />
          </div>
        </div>
      </div>
    </div>
  );
}
