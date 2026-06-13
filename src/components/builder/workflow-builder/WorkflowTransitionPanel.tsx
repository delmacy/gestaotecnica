import { WorkflowTransition } from "./workflow-builder-types";

export function WorkflowTransitionPanel({ transitions, sourceNodeId }: { transitions: WorkflowTransition[], sourceNodeId: string }) {
  const outgoing = transitions.filter(t => t.sourceId === sourceNodeId);
  const incoming = transitions.filter(t => t.targetId === sourceNodeId);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold mb-2">Outgoing Transitions</h4>
        {outgoing.length === 0 ? (
          <p className="text-xs text-muted-foreground">None</p>
        ) : (
          <ul className="space-y-2">
            {outgoing.map(t => (
              <li key={t.id} className="text-xs border p-2 rounded bg-muted/20">
                To: <span className="font-mono">{t.targetId}</span>
                {t.label && <div className="mt-1 text-muted-foreground">{t.label}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-2">Incoming Transitions</h4>
        {incoming.length === 0 ? (
          <p className="text-xs text-muted-foreground">None</p>
        ) : (
          <ul className="space-y-2">
            {incoming.map(t => (
              <li key={t.id} className="text-xs border p-2 rounded bg-muted/20">
                From: <span className="font-mono">{t.sourceId}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
