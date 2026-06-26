import Link from "next/link";
import { notFound } from "next/navigation";
import { getApprovalById, getApprovalHistory } from "@/modules/approvals/queries";
import { ApprovalDetail } from "@/modules/approvals/components/ApprovalDetail";

export const dynamic = "force-dynamic";

export default async function ApprovalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [approval, history] = await Promise.all([
    getApprovalById(id),
    getApprovalHistory(id),
  ]);

  if (!approval) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#65705f]">
                Detalhes da solicitacao
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-[#111510]">
                REQ-{id.substring(0, 8).toUpperCase()}
              </h1>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]"
              href="/approvals"
            >
              Voltar para a fila
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
        <ApprovalDetail approval={approval} history={history} />
      </section>
    </main>
  );
}
