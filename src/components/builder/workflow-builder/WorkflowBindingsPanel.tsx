import { WorkflowNode } from "./workflow-builder-types";

export function WorkflowBindingsPanel({ node }: { node: WorkflowNode }) {
  if (node.bindings.length === 0) {
    return <div className="text-sm text-muted-foreground">No bindings attached.</div>;
  }

  const grouped = node.bindings.reduce((acc, curr) => {
    if (!acc[curr.type]) acc[curr.type] = [];
    acc[curr.type].push(curr);
    return acc;
  }, {} as Record<string, typeof node.bindings>);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([type, bindings]) => (
        <div key={type}>
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">{type} Bindings</h4>
          <ul className="space-y-2">
            {bindings.map(b => (
              <li key={b.id} className="text-sm p-2 border rounded bg-muted/10 flex justify-between">
                <span>{b.targetName}</span>
                <span className="text-xs font-mono text-muted-foreground">{b.targetId}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
