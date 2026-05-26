import { updateResourceNeedStatus } from "./actions";
import {
  getPriorityLabel,
  getResourceNeedStatusLabel,
  resourceNeedStatuses,
} from "./constants";

type ResourceNeed = Awaited<ReturnType<typeof import("./queries").getResourceNeeds>>[number];

function StatusForm({ id, current }: { id: string; current: string }) {
  return (
    <form action={updateResourceNeedStatus} className="flex gap-2">
      <input name="id" type="hidden" value={id} />
      <select className="h-10 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue={current}>
        {resourceNeedStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
      </select>
      <button className="h-10 bg-[#1f2a1c] px-4 text-sm font-semibold text-white" type="submit">Atualizar</button>
    </form>
  );
}

export function ResourceNeedsList({ needs }: { needs: ResourceNeed[] }) {
  if (needs.length === 0) return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhuma necessidade de recurso registrada.</div>;
  return (
    <div className="space-y-3">
      {needs.map((need) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={need.id}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#111510]">{need.title}</h2>
              <p className="mt-1 text-sm text-[#5b6655]">{getResourceNeedStatusLabel(need.status)} | {getPriorityLabel(need.priority)} | Qtd {need.quantity}</p>
            </div>
            <StatusForm id={need.id} current={need.status} />
          </div>
          {need.justification ? <p className="mt-3 text-sm leading-6 text-[#4d5848]">{need.justification}</p> : null}
          <p className="mt-3 text-sm text-[#5b6655]">Categoria: {need.category ?? "Nao informada"} | Equipe: {need.teamName ?? "Nao definida"}</p>
          <p className="mt-1 text-sm text-[#5b6655]">Ativo: {need.assetName ? `${need.assetCode} - ${need.assetName}` : "Nao vinculado"} | Projeto: {need.projectTitle ?? "Nao vinculado"} | Aquisicao: {need.acquisitionTitle ?? "Nao vinculada"}</p>
        </article>
      ))}
    </div>
  );
}
