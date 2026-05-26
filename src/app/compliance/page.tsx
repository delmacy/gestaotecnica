import { ComplianceAuditForm, ComplianceFindingForm } from "@/modules/compliance/compliance-forms";
import { ComplianceAuditsList, ComplianceFindingsList } from "@/modules/compliance/compliance-lists";
import {
  getComplianceAudits,
  getComplianceFindings,
  getComplianceOptions,
  getComplianceSummary,
} from "@/modules/compliance/queries";

export const dynamic = "force-dynamic";

export default async function CompliancePage() {
  const [audits, findings, summary, options] = await Promise.all([
    getComplianceAudits(),
    getComplianceFindings(),
    getComplianceSummary(),
    getComplianceOptions(),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-6 py-8 text-[#1c211b] lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header>
          <p className="font-mono text-xs uppercase text-[#65705f]">Risco e qualidade</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#111510]">Conformidade e auditorias</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5b6655]">Auditorias, achados, severidade e acoes corretivas com rastreabilidade operacional.</p>
        </header>
        <section className="grid gap-3 sm:grid-cols-3">
          {summary.map((metric) => (
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm" key={metric.label}>
              <p className="font-mono text-xs text-[#6e7a66]">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold text-[#111510]">{metric.value}</p>
            </div>
          ))}
        </section>
        <section className="grid gap-5 xl:grid-cols-2">
          <ComplianceAuditForm options={options} />
          <ComplianceFindingForm options={options} />
        </section>
        <section className="grid gap-6 xl:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-[#111510]">Auditorias</h2>
            <ComplianceAuditsList audits={audits} />
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold text-[#111510]">Achados</h2>
            <ComplianceFindingsList findings={findings} />
          </div>
        </section>
      </div>
    </main>
  );
}
