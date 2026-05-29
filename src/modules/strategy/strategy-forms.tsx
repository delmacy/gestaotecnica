import { createAcquisitionNeed, createMaintenancePlan, createTechnicalProject } from "./actions";
import { acquisitionStatuses, planningStatuses, priorities } from "./constants";

type Options = Awaited<ReturnType<typeof import("./queries").getStrategyOptions>>;

function Selects({ options }: { options: Options }) {
  return {
    asset: (
      <select className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="assetId" defaultValue="">
        <option value="">Sem ativo</option>
        {options.assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.code} - {asset.name}</option>)}
      </select>
    ),
  };
}

export function MaintenancePlanForm({ options }: { options: Options }) {
  const selects = Selects({ options });
  return (
    <form action={createMaintenancePlan} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Novo plano</h2>
      <div className="mt-4 space-y-4">
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="title" placeholder="Titulo" required />
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue="draft">{planningStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="priority" defaultValue="medium">{priorities.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}</select>
        </div>
        <label className="block"><span className="text-sm font-medium text-[#273025]">Ativo</span>{selects.asset}</label>
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="ownerTeamId" defaultValue=""><option value="">Sem equipe dona</option>{options.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="periodStart" type="date" />
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="periodEnd" type="date" />
        </div>
        <textarea className="min-h-24 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="objective" placeholder="Objetivo" />
        <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Criar plano</button>
      </div>
    </form>
  );
}

export function TechnicalProjectForm({ options }: { options: Options }) {
  const selects = Selects({ options });
  return (
    <form action={createTechnicalProject} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Novo projeto</h2>
      <div className="mt-4 space-y-4">
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="title" placeholder="Titulo" required />
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="sponsor" placeholder="Patrocinador" />
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue="draft">{planningStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="priority" defaultValue="medium">{priorities.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}</select>
        </div>
        <label className="block"><span className="text-sm font-medium text-[#273025]">Ativo</span>{selects.asset}</label>
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="workItemId" defaultValue=""><option value="">Sem demanda</option>{options.workItems.map((w) => <option key={w.id} value={w.id}>{w.title}</option>)}</select>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="startsAt" type="date" />
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="targetEndsAt" type="date" />
        </div>
        <textarea className="min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="objective" placeholder="Objetivo" />
        <textarea className="min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="scope" placeholder="Escopo" />
        <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Criar projeto</button>
      </div>
    </form>
  );
}

export function AcquisitionNeedForm({ options }: { options: Options }) {
  const selects = Selects({ options });
  return (
    <form action={createAcquisitionNeed} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Nova necessidade</h2>
      <div className="mt-4 space-y-4">
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="title" placeholder="Item ou necessidade" required />
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue="identified">{acquisitionStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="priority" defaultValue="medium">{priorities.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}</select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="quantity" type="number" min="1" defaultValue="1" />
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="estimatedCost" type="number" min="0" placeholder="Custo estimado" />
        </div>
        <label className="block"><span className="text-sm font-medium text-[#273025]">Ativo</span>{selects.asset}</label>
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="serviceOrderId" defaultValue=""><option value="">Sem execucao</option>{options.serviceOrders.map((o) => <option key={o.id} value={o.id}>{o.code} - {o.title}</option>)}</select>
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="projectId" defaultValue=""><option value="">Sem projeto</option>{options.projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}</select>
        <textarea className="min-h-24 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="justification" placeholder="Justificativa" />
        <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Criar necessidade</button>
      </div>
    </form>
  );
}
