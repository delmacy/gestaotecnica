import Link from "next/link";
import {
  acquisitionStatuses,
  getAcquisitionStatusLabel,
  getPlanningStatusLabel,
  getPriorityLabel,
  planningStatuses,
} from "./constants";
import {
  updateAcquisitionNeedStatus,
  updateMaintenancePlanStatus,
  updateTechnicalProjectStatus,
} from "./actions";

type Plan = Awaited<ReturnType<typeof import("./queries").getMaintenancePlans>>[number];
type Project = Awaited<ReturnType<typeof import("./queries").getTechnicalProjects>>[number];
type Acquisition = Awaited<ReturnType<typeof import("./queries").getAcquisitionNeeds>>[number];

function formatMoney(cents: number | null) {
  if (!cents) return "Nao estimado";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function StatusForm({ id, current, kind }: { id: string; current: string; kind: "plan" | "project" | "acquisition" }) {
  const action = kind === "plan" ? updateMaintenancePlanStatus : kind === "project" ? updateTechnicalProjectStatus : updateAcquisitionNeedStatus;
  const statuses = kind === "acquisition" ? acquisitionStatuses : planningStatuses;
  return (
    <form action={action} className="flex gap-2">
      <input name="id" type="hidden" value={id} />
      <select className="h-10 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue={current}>
        {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
      </select>
      <button className="h-10 bg-[#1f2a1c] px-4 text-sm font-semibold text-white" type="submit">Atualizar</button>
    </form>
  );
}

export function MaintenancePlansList({ plans }: { plans: Plan[] }) {
  if (plans.length === 0) return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhum plano registrado.</div>;
  return (
    <div className="space-y-3">
      {plans.map((plan: any) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={plan.id}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#111510]">{plan.title}</h2>
              <p className="mt-1 text-sm text-[#5b6655]">{getPlanningStatusLabel(plan.status)} | {getPriorityLabel(plan.priority)}</p>
            </div>
            <StatusForm id={plan.id} current={plan.status} kind="plan" />
          </div>
          {plan.objective ? <p className="mt-3 text-sm leading-6 text-[#4d5848]">{plan.objective}</p> : null}
          <p className="mt-3 text-sm text-[#5b6655]">Ativo: {plan.assetName ? `${plan.assetCode} - ${plan.assetName}` : "Nao vinculado"} | Equipe: {plan.teamName ?? "Nao definida"}</p>
        </article>
      ))}
    </div>
  );
}

export function TechnicalProjectsList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhum projeto registrado.</div>;
  return (
    <div className="space-y-3">
      {projects.map((project: any) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={project.id}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#111510]">{project.title}</h2>
              <p className="mt-1 text-sm text-[#5b6655]">{getPlanningStatusLabel(project.status)} | {getPriorityLabel(project.priority)}</p>
            </div>
            <StatusForm id={project.id} current={project.status} kind="project" />
          </div>
          {project.objective ? <p className="mt-3 text-sm leading-6 text-[#4d5848]">{project.objective}</p> : null}
          {project.workItemId && project.workItemTitle ? (
            <Link className="mt-3 block text-sm underline-offset-4 hover:underline" href={`/work-items/${project.workItemId}`}>Demanda: {project.workItemTitle}</Link>
          ) : null}
          <p className="mt-2 text-sm text-[#5b6655]">Ativo: {project.assetName ? `${project.assetCode} - ${project.assetName}` : "Nao vinculado"} | Patrocinador: {project.sponsor ?? "Nao informado"}</p>
        </article>
      ))}
    </div>
  );
}

export function AcquisitionNeedsList({ needs }: { needs: Acquisition[] }) {
  if (needs.length === 0) return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhuma necessidade registrada.</div>;
  return (
    <div className="space-y-3">
      {needs.map((need: any) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={need.id}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#111510]">{need.title}</h2>
              <p className="mt-1 text-sm text-[#5b6655]">{getAcquisitionStatusLabel(need.status)} | {getPriorityLabel(need.priority)}</p>
            </div>
            <StatusForm id={need.id} current={need.status} kind="acquisition" />
          </div>
          {need.justification ? <p className="mt-3 text-sm leading-6 text-[#4d5848]">{need.justification}</p> : null}
          <p className="mt-3 text-sm text-[#5b6655]">Qtd: {need.quantity} | Estimativa: {formatMoney(need.estimatedCostCents)}</p>
          <p className="mt-1 text-sm text-[#5b6655]">Ativo: {need.assetName ? `${need.assetCode} - ${need.assetName}` : "Nao vinculado"} | Projeto: {need.projectTitle ?? "Nao vinculado"}</p>
        </article>
      ))}
    </div>
  );
}
