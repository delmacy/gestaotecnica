import { updateComplianceAuditStatus } from "./actions";
import {
  auditStatuses,
  getAuditStatusLabel,
  getFindingSeverityLabel,
  getFindingStatusLabel,
  getPriorityLabel,
} from "./constants";

type Audit = Awaited<ReturnType<typeof import("./queries").getComplianceAudits>>[number];
type Finding = Awaited<ReturnType<typeof import("./queries").getComplianceFindings>>[number];

function formatDate(value: Date | null) {
  if (!value) return "Nao definida";
  return new Intl.DateTimeFormat("pt-BR").format(value);
}

function AuditStatusForm({ id, current }: { id: string; current: string }) {
  return (
    <form action={updateComplianceAuditStatus} className="flex gap-2">
      <input name="id" type="hidden" value={id} />
      <select className="h-10 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue={current}>
        {auditStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
      </select>
      <button className="h-10 bg-[#1f2a1c] px-4 text-sm font-semibold text-white" type="submit">Atualizar</button>
    </form>
  );
}

export function ComplianceAuditsList({ audits }: { audits: Audit[] }) {
  if (audits.length === 0) return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhuma auditoria registrada.</div>;
  return (
    <div className="space-y-3">
      {audits.map((audit) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={audit.id}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#111510]">{audit.title}</h2>
              <p className="mt-1 text-sm text-[#5b6655]">{getAuditStatusLabel(audit.status)} | {getPriorityLabel(audit.priority)} | {audit.area ?? "Sem area"}</p>
            </div>
            <AuditStatusForm id={audit.id} current={audit.status} />
          </div>
          <p className="mt-3 text-sm text-[#5b6655]">Equipe: {audit.teamName ?? "Nao definida"} | Ativo: {audit.assetName ? `${audit.assetCode} - ${audit.assetName}` : "Nao vinculado"}</p>
          <p className="mt-1 text-sm text-[#5b6655]">Planejada: {formatDate(audit.plannedAt)} | Concluida: {formatDate(audit.completedAt)}</p>
          {audit.summary ? <p className="mt-2 text-sm leading-6 text-[#4d5848]">{audit.summary}</p> : null}
        </article>
      ))}
    </div>
  );
}

export function ComplianceFindingsList({ findings }: { findings: Finding[] }) {
  if (findings.length === 0) return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhum achado registrado.</div>;
  return (
    <div className="space-y-3">
      {findings.map((finding) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={finding.id}>
          <h2 className="text-lg font-semibold text-[#111510]">{finding.title}</h2>
          <p className="mt-1 text-sm text-[#5b6655]">{getFindingSeverityLabel(finding.severity)} | {getFindingStatusLabel(finding.status)} | Auditoria: {finding.auditTitle}</p>
          <p className="mt-3 text-sm text-[#5b6655]">Responsavel: {finding.teamName ?? "Nao definido"} | Prazo: {formatDate(finding.dueAt)}</p>
          {finding.description ? <p className="mt-2 text-sm leading-6 text-[#4d5848]">{finding.description}</p> : null}
          {finding.correctiveAction ? <p className="mt-2 text-sm leading-6 text-[#4d5848]">Acao: {finding.correctiveAction}</p> : null}
        </article>
      ))}
    </div>
  );
}
