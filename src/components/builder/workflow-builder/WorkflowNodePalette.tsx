export function WorkflowNodePalette() {
  const nodeTypes = ["Trigger", "Action", "Condition", "Gateway", "End"];

  return (
    <div className="p-4 border-t bg-background">
      <div className="text-sm font-medium mb-3">Palette</div>
      <div className="flex flex-wrap gap-2">
        {nodeTypes.map(type => (
          <div
            key={type}
            className="px-3 py-2 bg-muted/50 border rounded text-xs cursor-not-allowed opacity-60"
            title="Design-only mode: drag and drop not enabled"
          >
            {type}
          </div>
        ))}
      </div>
    </div>
  );
}
