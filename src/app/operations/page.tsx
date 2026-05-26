import Link from "next/link";
import { OperationsBoard } from "@/modules/operations/operations-board";
import {
  getAvailableTechniciansForOperations,
  getOperationsQueues,
  getOperationsSummary,
} from "@/modules/operations/queries";

export const dynamic = "force-dynamic";

export default async function OperationsPage() {
  const [summary, queues, technicians] = await Promise.all([
    getOperationsSummary(),
    getOperationsQueues(),
    getAvailableTechniciansForOperations(),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#65705f]">
                Comando operacional
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-[#111510]">
                Centro Operacional
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4d5848]">
                Painel de filas, pendencias, tecnicos disponiveis e eventos
                recentes para acompanhamento em tempo real.
              </p>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]"
              href="/"
            >
              Voltar ao painel
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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

      <section className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
        <OperationsBoard
          activeOrders={queues.activeOrders}
          criticalWorkItems={queues.criticalWorkItems}
          pendingShiftEntries={queues.pendingShiftEntries}
          recentEvents={queues.recentEvents}
          technicians={technicians}
        />
      </section>
    </main>
  );
}
