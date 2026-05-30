import { createResourceNeed } from "./actions";
import { priorities, resourceNeedStatuses } from "./constants";
import type { ResourceNeedOptions } from "./queries";

export function ResourceNeedForm({ options }: { options: ResourceNeedOptions }) {
  return (
    <form action={createResourceNeed} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Nova necessidade de recurso</h2>
      <div className="mt-4 space-y-4">
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="title" placeholder="Titulo" required />
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="category" placeholder="Categoria" />
        <div className="grid gap-3 sm:grid-cols-3">
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue="identified">
            {resourceNeedStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
          </select>
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="priority" defaultValue="medium">
            {priorities.map((priority) => <option key={priority.value} value={priority.value}>{priority.label}</option>)}
          </select>
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="quantity" type="number" min="1" defaultValue="1" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="assetId" defaultValue="">
            <option value="">Sem ativo</option>
            {options.assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.code} - {asset.name}</option>)}
          </select>
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="ownerTeamId" defaultValue="">
            <option value="">Sem equipe dona</option>
            {options.teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="projectId" defaultValue="">
            <option value="">Sem projeto</option>
            {options.projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
          </select>
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="acquisitionNeedId" defaultValue="">
            <option value="">Sem aquisicao vinculada</option>
            {options.acquisitions.map((need) => <option key={need.id} value={need.id}>{need.title}</option>)}
          </select>
        </div>
        <textarea className="min-h-24 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="justification" placeholder="Justificativa" />
        <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Criar necessidade</button>
      </div>
    </form>
  );
}
