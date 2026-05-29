import Link from "next/link";
import { TechnicalProjectForm } from "@/modules/technical-projects/technical-project-form";
import { TechnicalProjectsList } from "@/modules/technical-projects/technical-projects-list";
import {
  getTechnicalProjectOptions,
  getTechnicalProjectSummary,
  getTechnicalProjects,
} from "@/modules/technical-projects/queries";

export const dynamic = "force-dynamic";

export default async function TechnicalProjectsPage() {
  const [projects, summary, options] = await Promise.all([getTechnicalProjects(), getTechnicalProjectSummary(), getTechnicalProjectOptions()]);
  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]"><div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-xs uppercase text-[#65705f]">Fase 3</p><h1 className="mt-2 text-4xl font-semibold text-[#111510]">Projetos Responsavels</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-[#4d5848]">Projetos de melhoria, substituicao, modernizacao e implantacao operacional.</p></div><Link className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025]" href="/">Voltar ao painel</Link></div><div className="grid gap-3 sm:grid-cols-3">{summary.map((item) => <div className="border border-[#d7dccf] bg-white p-4 shadow-sm" key={item.label}><p className="font-mono text-xs text-[#6e7a66]">{item.label}</p><p className="mt-2 text-3xl font-semibold text-[#111510]">{item.value}</p></div>)}</div></div></section>
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_420px] lg:px-8"><TechnicalProjectsList projects={projects} /><aside><TechnicalProjectForm options={options} /></aside></section>
    </main>
  );
}
