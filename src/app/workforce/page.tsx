import Link from "next/link";
import { TeamForm } from "@/modules/workforce/team-form";
import { TeamsList } from "@/modules/workforce/teams-list";
import { TechnicianForm } from "@/modules/workforce/technician-form";
import { TechniciansTable } from "@/modules/workforce/technicians-table";
import {
  getTeams,
  getTechnicians,
  getWorkforceSummary,
} from "@/modules/workforce/queries";

export const dynamic = "force-dynamic";

export default async function WorkforcePage() {
  const [teams, technicians, summary] = await Promise.all([
    getTeams(),
    getTechnicians(),
    getWorkforceSummary(),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#65705f]">
                Modulo operacional
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-[#111510]">
                Workforce
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4d5848]">
                Equipes, perfis tecnicos, especialidades e disponibilidade para
                transformar OS abertas em execucao atribuida.
              </p>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]"
              href="/"
            >
              Voltar ao painel
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {summary.map((item) => (
              <div
                className="border border-[#d7dccf] bg-white p-4 shadow-sm"
                key={item.label}
              >
                <p className="font-mono text-xs text-[#6e7a66]">{item.label}</p>
                <p className="mt-2 text-3xl font-semibold text-[#111510]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="space-y-8">
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-[#111510]">
                Tecnicos cadastrados
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#5b6655]">
                Listagem dos perfis tecnicos disponiveis para assumir ordens de
                servico.
              </p>
            </div>
            <TechniciansTable technicians={technicians} />
          </div>

          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-[#111510]">Equipes</h2>
              <p className="mt-1 text-sm leading-6 text-[#5b6655]">
                Times operacionais usados para organizar responsabilidade e
                cobertura tecnica.
              </p>
            </div>
            <TeamsList teams={teams} />
          </div>
        </div>

        <aside className="space-y-6">
          <TechnicianForm teams={teams} />
          <TeamForm />
        </aside>
      </section>
    </main>
  );
}
