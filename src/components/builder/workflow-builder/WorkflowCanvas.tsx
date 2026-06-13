import { WorkflowBlueprint } from "./workflow-builder-types";
import { WorkflowNodeCard } from "./WorkflowNodeCard";

interface Props {
  blueprint: WorkflowBlueprint | null;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
}

export function WorkflowCanvas({ blueprint, selectedNodeId, onSelectNode }: Props) {
  if (!blueprint) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <div className="text-center">
          <h3 className="text-lg font-medium text-muted-foreground">No Blueprint Selected</h3>
          <p className="text-sm text-muted-foreground mt-1">Select a blueprint from the sidebar to view its workflow.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative bg-slate-50 overflow-auto">
      <div className="absolute inset-0 p-8 min-w-[1200px] min-h-[800px]">
        {blueprint.nodes.map(node => (
          <WorkflowNodeCard
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onClick={() => onSelectNode(node.id)}
          />
        ))}

        {/* Mocking SVG transitions just as simple lines for the static mock */}
        <svg className="absolute inset-0 pointer-events-none" style={{ minWidth: 1200, minHeight: 800 }}>
          {blueprint.transitions.map(t => {
            const source = blueprint.nodes.find(n => n.id === t.sourceId);
            const target = blueprint.nodes.find(n => n.id === t.targetId);
            if (!source || !target) return null;

            // Simple straight line from center to center (approx)
            return (
              <line
                key={t.id}
                x1={source.x + 100}
                y1={source.y + 40}
                x2={target.x + 100}
                y2={target.y + 40}
                stroke="#cbd5e1"
                strokeWidth={2}
                markerEnd="url(#arrowhead)"
              />
            );
          })}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
}
