import { WorkflowNode } from "./workflow-builder-types";

export function WorkflowNodeDetailPanel({ node }: { node: WorkflowNode }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase">ID</label>
        <div className="text-sm font-mono mt-1">{node.id}</div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase">Type</label>
        <div className="text-sm mt-1">{node.type}</div>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase">Label</label>
        <input
          type="text"
          className="w-full mt-1 px-3 py-2 border rounded-md text-sm bg-muted/30"
          value={node.label}
          readOnly
        />
      </div>
    </div>
  );
}
