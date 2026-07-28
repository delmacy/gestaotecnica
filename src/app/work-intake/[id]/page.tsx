import Link from "next/link";
import { notFound } from "next/navigation";
import { getIntakeRequestById, getIntakeHistory } from "@/modules/work-intake/queries";
import { IntakeDetail } from "@/modules/work-intake/components/IntakeDetail";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function IntakeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [request, history] = await Promise.all([
    getIntakeRequestById(id),
    getIntakeHistory(id),
  ]);

  if (!request) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/work-intake"
              className="text-sm font-bold uppercase tracking-wider text-[#65705f] hover:text-[#111510]"
            >
              ← Voltar para lista
            </Link>
          </div>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#65705f]">Detalhes da Solicitação</p>
              <h1 className="mt-2 text-4xl font-semibold text-[#111510]">{request.title}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
        <IntakeDetail request={request} history={history} />
      </section>
    </main>
  );
}
