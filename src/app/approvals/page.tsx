import Link from "next/link";
import { ApprovalQueueTable } from "@/modules/approvals/approval-queue-table";
import {
  getApprovalQueue,
  getApprovalSummary,
} from "@/modules/approvals/queries";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const [items, summary] = await Promise.all([
    getApprovalQueue(),
    getApprovalSummary(),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#65705f]">
                Governanca operacional
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-[#111510]">
                Fila de aprovacoes
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4d5848]">
                Modulo universal de aprovacoes. Gerencie solicitacoes de diversos tipos de objetos em um so lugar.
              </p>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]"
              href="/"
            >
              Voltar ao painel
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {summary.map((item: any) => (
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
        <ApprovalQueueTable items={items} />
      </section>
    </main>
  );
}
