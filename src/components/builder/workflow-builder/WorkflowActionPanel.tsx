import { WorkflowNode } from "./workflow-builder-types";
import { Play } from "lucide-react";

export function WorkflowActionPanel({ node }: { node: WorkflowNode }) {
  if (node.actions.length === 0) {
    return <div className="text-sm text-muted-foreground">No actions defined.</div>;
  }

  return (
    <div className="space-y-3">
      {node.actions.map(a => (
        <div key={a.id} className="flex items-center justify-between p-3 border rounded-md text-sm bg-slate-50">
          <div className="font-medium">{a.name}</div>
          <Play className="w-4 h-4 text-muted-foreground cursor-not-allowed" />
        </div>
      ))}
      <button className="w-full py-2 border border-dashed rounded text-xs mt-4 text-muted-foreground hover:bg-muted/50 cursor-not-allowed">
        + Add Action Placeholder
      </button>
    </div>
  );
}
