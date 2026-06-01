import React from "react";
import type { BuilderDraft, BuilderValidationIssue } from "../types";
import { validateBuilderDraft } from "../process-editor/validate-builder-draft";
import { summarizeBuilderValidation } from "./builder-validation-summary";

export type BuilderValidationPanelProps = {
  draft: BuilderDraft;
};

function IssueList({ issues }: { issues: BuilderValidationIssue[] }) {
  if (issues.length === 0) return null;

  return (
    <ul className="flex flex-col gap-1 mt-2">
      {issues.map((issue, idx) => (
        <li key={`${issue.code}-${idx}`} className="text-xs text-slate-700 flex flex-col">
          <span className="font-semibold text-slate-800">
            {issue.code}
            {issue.path && <span className="text-slate-500 font-mono font-normal ml-1">({issue.path})</span>}
          </span>
          <span className="text-slate-600">{issue.message}</span>
        </li>
      ))}
    </ul>
  );
}

export function BuilderValidationPanel({ draft }: BuilderValidationPanelProps) {
  const result = validateBuilderDraft(draft);
  const summary = summarizeBuilderValidation(result);

  if (summary.valid && summary.warningCount === 0) {
    return (
      <div className="bg-white border-t border-slate-200 px-4 py-3 shrink-0 flex items-center justify-between shadow-[0_-2px_10px_-5px_rgba(0,0,0,0.1)] z-20">
        <div>
          <h4 className="text-sm font-semibold text-green-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Processo válido
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">Nenhum problema encontrado.</p>
        </div>
      </div>
    );
  }

  if (summary.valid && summary.warningCount > 0) {
    return (
      <div className="bg-amber-50 border-t border-amber-200 px-4 py-3 shrink-0 max-h-48 overflow-y-auto shadow-[0_-2px_10px_-5px_rgba(0,0,0,0.1)] z-20">
        <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span> Processo com avisos ({summary.warningCount})
        </h4>
        <IssueList issues={summary.warnings} />
      </div>
    );
  }

  return (
    <div className="bg-red-50 border-t border-red-200 px-4 py-3 shrink-0 max-h-64 overflow-y-auto shadow-[0_-2px_10px_-5px_rgba(0,0,0,0.1)] z-20">
      <h4 className="text-sm font-semibold text-red-800 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-500"></span> Processo inválido ({summary.errorCount} erros)
      </h4>

      {summary.errors.length > 0 && (
        <div className="mt-2">
          <h5 className="text-xs font-bold text-red-900 uppercase">Erros</h5>
          <IssueList issues={summary.errors} />
        </div>
      )}

      {summary.warnings.length > 0 && (
        <div className="mt-3 pt-2 border-t border-red-200/50">
          <h5 className="text-xs font-bold text-amber-800 uppercase">Avisos ({summary.warningCount})</h5>
          <IssueList issues={summary.warnings} />
        </div>
      )}
    </div>
  );
}
