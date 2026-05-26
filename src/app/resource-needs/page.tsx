import { ResourceNeedForm } from "@/modules/resource-needs/resource-need-form";
import { ResourceNeedsList } from "@/modules/resource-needs/resource-needs-list";
import {
  getResourceNeedOptions,
  getResourceNeeds,
  getResourceNeedsSummary,
} from "@/modules/resource-needs/queries";

export const dynamic = "force-dynamic";

export default async function ResourceNeedsPage() {
  const [needs, summary, options] = await Promise.all([
    getResourceNeeds(),
    getResourceNeedsSummary(),
    getResourceNeedOptions(),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-6 py-8 text-[#1c211b] lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 xl:grid-cols-[380px_1fr]">
        <aside className="space-y-5">
          <header>
            <p className="font-mono text-xs uppercase text-[#65705f]">Recursos</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#111510]">Necessidades de recursos</h1>
            <p className="mt-2 text-sm leading-6 text-[#5b6655]">
              Demanda estruturada de pessoas, materiais, ferramentas e apoio para execucao tecnica.
            </p>
          </header>
          <section className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {summary.map((metric) => (
              <div className="border border-[#d7dccf] bg-white p-4 shadow-sm" key={metric.label}>
                <p className="font-mono text-xs text-[#6e7a66]">{metric.label}</p>
                <p className="mt-2 text-3xl font-semibold text-[#111510]">{metric.value}</p>
              </div>
            ))}
          </section>
          <ResourceNeedForm options={options} />
        </aside>
        <section>
          <h2 className="mb-4 text-xl font-semibold text-[#111510]">Fila de necessidades</h2>
          <ResourceNeedsList needs={needs} />
        </section>
      </div>
    </main>
  );
}
