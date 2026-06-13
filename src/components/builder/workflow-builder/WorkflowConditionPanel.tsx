import { WorkflowNode } from "./workflow-builder-types";

export function WorkflowConditionPanel({ node }: { node: WorkflowNode }) {
  if (node.conditions.length === 0) {
    return <div className="text-sm text-muted-foreground">No conditions defined.</div>;
  }

  return (
    <div className="space-y-3">
      {node.conditions.map(c => (
        <div key={c.id} className="p-3 border rounded-md text-sm bg-slate-50">
          <div className="font-mono text-xs text-primary">{c.expression}</div>
        </div>
      ))}
      <button className="w-full py-2 border border-dashed rounded text-xs mt-4 text-muted-foreground hover:bg-muted/50 cursor-not-allowed">
        + Add Condition (Mock)
      </button>
    </div>
  );
}
