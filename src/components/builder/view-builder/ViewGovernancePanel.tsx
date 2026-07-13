"use client";

import { ViewBlueprint } from "./view-builder-types";
import { ShieldAlert, Info, AlertTriangle, XOctagon } from "lucide-react";

interface ViewGovernancePanelProps {
  blueprint: ViewBlueprint;
}

export function ViewGovernancePanel({ blueprint }: ViewGovernancePanelProps) {
  if (!blueprint || !blueprint.governance_warnings) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-gray-500 p-4 text-center">
        <div className="text-2xl mb-2">⚠️</div>
        <h3 className="text-sm font-medium mb-1">Invalid Model</h3>
        <p className="text-xs">Cannot render governance warnings for an invalid view model.</p>
      </div>
    );
  }

  const getIconForSeverity = (severity: string) => {
    switch (severity) {
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XOctagon className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getStyleForSeverity = (severity: string) => {
    switch (severity) {
      case 'info': return 'border-blue-200 bg-blue-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-gray-50 text-sm font-medium flex justify-between items-center">
        <span>Governance & Readiness</span>
        <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold ${
          blueprint.readiness_status === 'ready_for_demo' ? 'bg-green-100 text-green-700' :
          blueprint.readiness_status === 'blocked_runtime' ? 'bg-red-100 text-red-700' :
          'bg-gray-200 text-gray-700'
        }`}>
          {blueprint.readiness_status.replace(/_/g, ' ')}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {blueprint.governance_warnings.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-8">
            <ShieldAlert className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            No governance warnings
          </div>
        ) : (
          blueprint.governance_warnings.map((warning) => (
            <div key={warning.id} className={`border rounded-md p-3 text-sm flex gap-3 items-start ${getStyleForSeverity(warning.severity)}`}>
               <div className="mt-0.5">{getIconForSeverity(warning.severity)}</div>
               <div className="flex-1">
                 <p className="text-gray-800 text-xs leading-relaxed">{warning.message}</p>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
