import { WorkflowNode } from "./workflow-builder-types";
import { AlertCircle } from "lucide-react";

interface Props {
  node: WorkflowNode;
  isSelected: boolean;
  onClick: () => void;
}

export function WorkflowNodeCard({ node, isSelected, onClick }: Props) {
  const hasErrors = node.warnings.some(w => w.severity === "error");
  const hasWarnings = node.warnings.some(w => w.severity === "warning");

  let borderColor = isSelected ? "border-primary" : "border-border";
  if (hasErrors && !isSelected) borderColor = "border-destructive";
  else if (hasWarnings && !isSelected) borderColor = "border-amber-500";

  return (
    <div
      onClick={onClick}
      className={`absolute w-[200px] bg-background border-2 rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md ${borderColor} ${isSelected ? 'ring-2 ring-primary ring-opacity-50' : ''}`}
      style={{ left: node.x, top: node.y }}
    >
      <div className="p-3 border-b bg-muted/30 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase text-muted-foreground">{node.type}</span>
        {(hasErrors || hasWarnings) && (
          <div title="Has warnings">
            <AlertCircle className={`w-4 h-4 ${hasErrors ? 'text-destructive' : 'text-amber-500'}`} />
          </div>
        )}
      </div>
      <div className="p-4 text-sm font-medium">
        {node.label}
      </div>
      <div className="px-4 pb-3 flex gap-2">
        <span className="text-[10px] bg-muted px-2 py-1 rounded">B: {node.bindings.length}</span>
        <span className="text-[10px] bg-muted px-2 py-1 rounded">A: {node.actions.length}</span>
      </div>
    </div>
  );
}
