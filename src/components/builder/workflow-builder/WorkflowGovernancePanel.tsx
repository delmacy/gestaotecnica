import { WorkflowNode } from "./workflow-builder-types";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

export function WorkflowGovernancePanel({ node }: { node: WorkflowNode }) {
  if (node.warnings.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 text-sm text-green-600 bg-green-50 rounded border border-green-100">
        All governance checks passed. Ready for execution.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {node.warnings.map(w => {
        let Icon = Info;
        let colorClass = "text-blue-500 bg-blue-50 border-blue-200";

        if (w.severity === "error") {
          Icon = AlertCircle;
          colorClass = "text-destructive bg-destructive/10 border-destructive/20";
        } else if (w.severity === "warning") {
          Icon = AlertTriangle;
          colorClass = "text-amber-600 bg-amber-50 border-amber-200";
        }

        return (
          <div key={w.id} className={`p-3 border rounded-md flex gap-3 ${colorClass}`}>
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold uppercase mb-1">{w.type.replace('_', ' ')}</div>
              <div className="text-sm leading-tight">{w.message}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
