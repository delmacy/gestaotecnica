import Link from "next/link";
import { MaintenancePlanForm } from "@/modules/strategy/strategy-forms";
import { MaintenancePlansList } from "@/modules/strategy/strategy-tables";
import { getMaintenancePlans, getMaintenancePlanSummary, getStrategyOptions } from "@/modules/strategy/queries";

export const dynamic = "force-dynamic";

export default async function MaintenancePlansPage() {
  const [plans, summary, options] = await Promise.all([getMaintenancePlans(), getMaintenancePlanSummary(), getStrategyOptions()]);
  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]"><div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-xs uppercase text-[#65705f]">Fase 3</p><h1 className="mt-2 text-4xl font-semibold text-[#111510]">Planos de Manutencao</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#4d5848]">Planejamento preventivo por ativo, periodo, equipe e prioridade.</p></div><Link className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025]" href="/">Voltar ao painel</Link></div><div className="grid gap-3 sm:grid-cols-3">{summary.map((item) => <div className="border border-[#d7dccf] bg-white p-4 shadow-sm" key={item.label}><p className="font-mono text-xs text-[#6e7a66]">{item.label}</p><p className="mt-2 text-3xl font-semibold text-[#111510]">{item.value}</p></div>)}</div></div></section>
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_420px] lg:px-8"><MaintenancePlansList plans={plans} /><aside><MaintenancePlanForm options={options} /></aside></section>
    </main>
  );
}
