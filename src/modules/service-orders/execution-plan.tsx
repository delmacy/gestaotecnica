import {
  createServiceOrderStage,
  createServiceOrderTarget,
  createServiceOrderTask,
  updateServiceOrderStageStatus,
  updateServiceOrderTaskStatus,
} from "./actions";
import {
  getServiceOrderStageStatusLabel,
  getServiceOrderTargetTypeLabel,
  getServiceOrderTaskStatusLabel,
  serviceOrderStageStatuses,
  serviceOrderTargetTypes,
  serviceOrderTaskStatuses,
} from "./constants";

type Stage = Awaited<ReturnType<typeof import("./queries").getServiceOrderStages>>[number];
type Task = Awaited<ReturnType<typeof import("./queries").getServiceOrderTasks>>[number];
type Target = Awaited<ReturnType<typeof import("./queries").getServiceOrderTargets>>[number];
type Technician = Awaited<ReturnType<typeof import("@/modules/workforce/queries").getTechnicianOptions>>[number];

function formatDate(date: Date | null) {
  if (!date) return "Sem prazo";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(date);
}

export function ServiceOrderExecutionPlan({
  stages,
  targets,
  tasks,
}: {
  stages: Stage[];
  targets: Target[];
  tasks: Task[];
}) {
  return (
    <section className="space-y-4">
      <div className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Plano de execucao</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div>
            <p className="font-mono text-xs uppercase text-[#6e7a66]">Etapas</p>
            <div className="mt-3 space-y-2">
              {stages.length === 0 ? (
                <p className="text-sm text-[#5b6655]">Nenhuma etapa registrada.</p>
              ) : (
                stages.map((stage: any) => (
                  <article className="border border-[#e1e5db] bg-[#fbfcf8] p-3" key={stage.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-[#111510]">{stage.position}. {stage.title}</p>
                        <p className="mt-1 text-xs text-[#65705f]">{getServiceOrderStageStatusLabel(stage.status)}</p>
                      </div>
                      <form action={updateServiceOrderStageStatus} className="flex gap-2">
                        <input name="id" type="hidden" value={stage.id} />
                        <select className="h-8 border border-[#c8d0bf] bg-white px-2 text-xs" name="status" defaultValue={stage.status}>
                          {serviceOrderStageStatuses.map((status: any) => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                          ))}
                        </select>
                        <button className="h-8 bg-[#1f2a1c] px-3 text-xs font-semibold text-white" type="submit">OK</button>
                      </form>
                    </div>
                    {stage.notes ? <p className="mt-2 text-sm text-[#4d5848]">{stage.notes}</p> : null}
                  </article>
                ))
              )}
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase text-[#6e7a66]">Tarefas</p>
            <div className="mt-3 space-y-2">
              {tasks.length === 0 ? (
                <p className="text-sm text-[#5b6655]">Nenhuma tarefa registrada.</p>
              ) : (
                tasks.map((task: any) => (
                  <article className="border border-[#e1e5db] bg-[#fbfcf8] p-3" key={task.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-[#111510]">{task.title}</p>
                        <p className="mt-1 text-xs text-[#65705f]">
                          {getServiceOrderTaskStatusLabel(task.status)} | {formatDate(task.dueAt)}
                        </p>
                      </div>
                      <form action={updateServiceOrderTaskStatus} className="flex gap-2">
                        <input name="id" type="hidden" value={task.id} />
                        <select className="h-8 border border-[#c8d0bf] bg-white px-2 text-xs" name="status" defaultValue={task.status}>
                          {serviceOrderTaskStatuses.map((status: any) => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                          ))}
                        </select>
                        <button className="h-8 bg-[#1f2a1c] px-3 text-xs font-semibold text-white" type="submit">OK</button>
                      </form>
                    </div>
                    {task.description ? <p className="mt-2 text-sm text-[#4d5848]">{task.description}</p> : null}
                    {task.technicianName ? <p className="mt-2 text-xs text-[#65705f]">Responsavel: {task.technicianName}</p> : null}
                  </article>
                ))
              )}
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase text-[#6e7a66]">Alvos</p>
            <div className="mt-3 space-y-2">
              {targets.length === 0 ? (
                <p className="text-sm text-[#5b6655]">Nenhum alvo registrado.</p>
              ) : (
                targets.map((target: any) => (
                  <article className="border border-[#e1e5db] bg-[#fbfcf8] p-3" key={target.id}>
                    <p className="font-medium text-[#111510]">{target.title}</p>
                    <p className="mt-1 text-xs text-[#65705f]">{getServiceOrderTargetTypeLabel(target.targetType)}</p>
                    {target.assetName ? <p className="mt-2 text-sm text-[#4d5848]">{target.assetCode} - {target.assetName}</p> : null}
                    {target.workItemTitle ? <p className="mt-2 text-sm text-[#4d5848]">{target.workItemTitle}</p> : null}
                    {target.notes ? <p className="mt-2 text-sm text-[#4d5848]">{target.notes}</p> : null}
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceOrderExecutionPlanForms({
  serviceOrderId,
  stages,
  technicians,
}: {
  serviceOrderId: string;
  stages: Stage[];
  technicians: Technician[];
}) {
  return (
    <div className="space-y-6">
      <form action={createServiceOrderStage} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Adicionar etapa</h2>
        <input name="serviceOrderId" type="hidden" value={serviceOrderId} />
        <div className="mt-4 space-y-3">
          <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="title" placeholder="Nome da etapa" required />
          <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="position" placeholder="Ordem" type="number" defaultValue={stages.length + 1} />
          <textarea className="min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="notes" placeholder="Observacoes da etapa" />
          <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Criar etapa</button>
        </div>
      </form>

      <form action={createServiceOrderTask} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Adicionar tarefa</h2>
        <input name="serviceOrderId" type="hidden" value={serviceOrderId} />
        <div className="mt-4 space-y-3">
          <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="title" placeholder="Tarefa" required />
          <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="stageId" defaultValue="">
            <option value="">Sem etapa</option>
            {stages.map((stage) => <option key={stage.id} value={stage.id}>{stage.title}</option>)}
          </select>
          <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="assignedTechnicianProfileId" defaultValue="">
            <option value="">Sem responsavel</option>
            {technicians.map((technician) => <option key={technician.id} value={technician.id}>{technician.name}</option>)}
          </select>
          <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="dueAt" type="date" />
          <textarea className="min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="description" placeholder="Descricao ou criterio de aceite" />
          <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Criar tarefa</button>
        </div>
      </form>

      <form action={createServiceOrderTarget} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Adicionar alvo</h2>
        <input name="serviceOrderId" type="hidden" value={serviceOrderId} />
        <div className="mt-4 space-y-3">
          <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="targetType" defaultValue="other">
            {serviceOrderTargetTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
          <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="title" placeholder="Alvo, local, sistema ou componente" required />
          <textarea className="min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="notes" placeholder="Contexto do alvo" />
          <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Criar alvo</button>
        </div>
      </form>
    </div>
  );
}
