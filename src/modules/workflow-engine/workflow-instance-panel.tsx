import { startWorkflowInstanceAction, transitionWorkflowInstanceAction } from "./actions";

type Instance = Awaited<ReturnType<typeof import("./queries").getWorkflowInstancesForTarget>>[number];

type Snapshot = {
  states?: string[];
};

function getStates(snapshot: unknown) {
  const states = (snapshot as Snapshot | null)?.states;
  return Array.isArray(states) ? states.map(String).filter(Boolean) : [];
}

function formatDate(date: Date | null) {
  if (!date) return "Em andamento";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function WorkflowInstancePanel({
  instances,
  targetId,
  targetType,
  returnTo,
}: {
  instances: Instance[];
  targetId: string;
  targetType: string;
  returnTo: string;
}) {
  return (
    <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#111510]">Workflow</h2>
          <p className="mt-1 text-sm text-[#5b6655]">
            Instancia auditavel do fluxo configurado para este registro.
          </p>
        </div>
        <form action={startWorkflowInstanceAction}>
          <input name="targetType" type="hidden" value={targetType} />
          <input name="targetId" type="hidden" value={targetId} />
          <input name="returnTo" type="hidden" value={returnTo} />
          <button className="h-10 bg-[#1f2a1c] px-4 text-sm font-semibold text-white" type="submit">
            Iniciar workflow
          </button>
        </form>
      </div>

      <div className="mt-4 space-y-3">
        {instances.length === 0 ? (
          <p className="text-sm text-[#5b6655]">Nenhuma instancia iniciada.</p>
        ) : (
          instances.map((instance: any) => {
            const states = getStates(instance.snapshot);
            return (
              <article className="border border-[#e1e5db] bg-[#fbfcf8] p-4" key={instance.id}>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="font-medium text-[#111510]">{instance.templateLabel}</p>
                    <p className="mt-1 text-sm text-[#5b6655]">
                      Estado atual: {instance.currentState} | {instance.status} | {formatDate(instance.completedAt)}
                    </p>
                  </div>
                  {instance.status === "active" ? (
                    <form action={transitionWorkflowInstanceAction} className="flex flex-col gap-2 sm:flex-row">
                      <input name="workflowInstanceId" type="hidden" value={instance.id} />
                      <input name="returnTo" type="hidden" value={returnTo} />
                      <select className="h-10 border border-[#c8d0bf] bg-white px-3 text-sm" name="toState" defaultValue={instance.currentState}>
                        {states.map((state: any) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      <input className="h-10 border border-[#c8d0bf] bg-white px-3 text-sm" name="note" placeholder="Nota" />
                      <button className="h-10 bg-[#1f2a1c] px-4 text-sm font-semibold text-white" type="submit">
                        Avancar
                      </button>
                    </form>
                  ) : null}
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
