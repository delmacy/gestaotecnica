import { WorkflowBlueprint } from "./workflow-builder-types";

interface Props {
  blueprints: WorkflowBlueprint[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function WorkflowBlueprintList({ blueprints, selectedId, onSelect }: Props) {
  return (
    <div className="w-64 border-r bg-muted/20 flex flex-col h-full">
      <div className="p-4 border-b font-semibold">
        Blueprints
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {blueprints.map(bp => (
          <button
            key={bp.id}
            onClick={() => onSelect(bp.id)}
            className={`w-full text-left p-3 rounded-md text-sm border transition-colors ${selectedId === bp.id ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"}`}
          >
            <div className="font-medium truncate">{bp.name}</div>
            <div className="text-xs opacity-70 mt-1 uppercase">{bp.readinessStatus}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
