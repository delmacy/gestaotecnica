import { createComplianceAudit, createComplianceFinding } from "./actions";
import { auditStatuses, findingSeverities, findingStatuses, priorities } from "./constants";
import type { ComplianceOptions } from "./queries";

export function ComplianceAuditForm({ options }: { options: ComplianceOptions }) {
  return (
    <form action={createComplianceAudit} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Nova auditoria</h2>
      <div className="mt-4 space-y-4">
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="title" placeholder="Titulo" required />
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="area" placeholder="Area" />
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue="planned">{auditStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="priority" defaultValue="medium">{priorities.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}</select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="ownerTeamId" defaultValue=""><option value="">Sem equipe dona</option>{options.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="assetId" defaultValue=""><option value="">Sem ativo</option>{options.assets.map((a) => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}</select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="plannedAt" type="date" />
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="completedAt" type="date" />
        </div>
        <textarea className="min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="summary" placeholder="Resumo" />
        <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Criar auditoria</button>
      </div>
    </form>
  );
}

export function ComplianceFindingForm({ options }: { options: ComplianceOptions }) {
  return (
    <form action={createComplianceFinding} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Novo achado</h2>
      <div className="mt-4 space-y-4">
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="title" placeholder="Titulo" required />
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="auditId" required defaultValue=""><option value="">Selecione a auditoria</option>{options.audits.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}</select>
        <div className="grid gap-3 sm:grid-cols-3">
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="severity" defaultValue="medium">{findingSeverities.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue="open">{findingStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="dueAt" type="date" />
        </div>
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="responsibleTeamId" defaultValue=""><option value="">Sem equipe responsavel</option>{options.teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
        <textarea className="min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="description" placeholder="Descricao" />
        <textarea className="min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="correctiveAction" placeholder="Acao corretiva" />
        <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Criar achado</button>
      </div>
    </form>
  );
}
