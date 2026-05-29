import Link from "next/link";
import { PlanningBoard } from "@/modules/planning/planning-board";
import { TechnicianLoadList } from "@/modules/planning/technician-load-list";
import {
  getPlanningBoard,
  getPlanningTechnicianLoad,
} from "@/modules/planning/queries";

export const dynamic = "force-dynamic";

export default async function PlanningPage() {
  const [board, technicians] = await Promise.all([
    getPlanningBoard(),
    getPlanningTechnicianLoad(),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#65705f]">
                Planejamento operacional
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-[#111510]">
                Planejamento
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4d5848]">
                Visao de backlog, execucao planejadas, execucao, revisao e carga
                operacional para orientar proximas acoes.
              </p>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]"
              href="/"
            >
              Voltar ao painel
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl space-y-6 px-6 py-8 lg:px-8">
        <PlanningBoard
          backlog={board.backlog}
          executionOrders={board.executionOrders}
          plannedOrders={board.plannedOrders}
          reviewOrders={board.reviewOrders}
        />
        <TechnicianLoadList technicians={technicians} />
      </section>
    </main>
  );
}
