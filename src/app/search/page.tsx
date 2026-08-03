import Link from "next/link";
import { SearchResults } from "@/modules/global-search/search-results";
import { searchEverything } from "@/modules/global-search/queries";
import { getRecoverableDrafts } from "@/modules/queues/queries";
import { recoverQueueItem } from "@/modules/queues/actions";
import { QueueActivityReceipt } from "@/modules/queues/queue-activity-receipt";
import { requireAccessProfile } from "@/modules/auth/authorization";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

function DraftRecoverySection({
  draftResponse,
}: {
  draftResponse: Awaited<ReturnType<typeof getRecoverableDrafts>>;
}) {
  if (draftResponse.state === "empty") {
    return (
      <section id="drafts" className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
        <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-[#111510]">
            Nenhum rascunho para recuperar
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#5b6655]">
            Rascunhos de demandas aparecem aqui quando estiverem em estado de rascunho.
          </p>
        </div>
      </section>
    );
  }

  if (draftResponse.state === "blocked") {
    return (
      <section id="drafts" className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
        <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-[#111510]">
            Recuperação de rascunhos indisponível
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#5b6655]">
            {draftResponse.message ?? "Serviço temporariamente indisponível."}
          </p>
        </div>
      </section>
    );
  }

  if (draftResponse.state === "demo") {
    return (
      <section id="drafts" className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
        <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-[#111510]">
            Demonstração — Rascunhos
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#5b6655]">
            {draftResponse.message ?? "Dados de demonstração."}
          </p>
        </div>
      </section>
    );
  }

  if (draftResponse.state === "synthetic") {
    return (
      <section id="drafts" className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
        <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-[#111510]">
            Rascunhos — {draftResponse.label}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#5b6655]">
            Dados sintéticos para validação.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="drafts" className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
      <div className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Rascunhos Recuperáveis</h2>
        <div className="mt-4 space-y-3">
          {draftResponse.drafts.map((draft) => (
            <form key={draft.id} action={recoverQueueItem} className="flex items-center justify-between border border-[#e0e5d9] bg-[#fbfcf8] p-4">
              <div>
                <p className="font-semibold text-[#182017]">{draft.title}</p>
                <p className="mt-1 text-sm text-[#5b6655]">
                  {draft.entityType} — atualizado em {new Date(draft.updatedAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <Button type="submit" variant="default" size="sm">
                <input type="hidden" name="id" value={draft.id} />
                Recuperar
              </Button>
            </form>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  await requireAccessProfile(["admin", "operador", "builder"]);
  const { q = "" } = await searchParams;
  const searchResponse = await searchEverything(q);
  const draftResponse = await getRecoverableDrafts();

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#65705f]">
                Localizacao rapida
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-[#111510]">
                Busca Global
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4d5848]">
                Encontre demandas, OS, ativos e tecnicos em uma unica consulta.
              </p>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]"
              href="/admin/queues"
            >
              Filas/SLA
            </Link>
            <Link
              className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]"
              href="/"
            >
              Voltar ao painel
            </Link>
          </div>

          <form className="flex flex-col gap-3 sm:flex-row" action="/search">
            <input
              className="h-12 flex-1 border border-[#c8d0bf] bg-white px-4 text-sm outline-none focus:border-[#6b7d5d]"
              defaultValue={q}
              name="q"
              placeholder="Buscar por OS, ativo, demanda ou tecnico"
            />
            <button
              className="h-12 bg-[#1f2a1c] px-6 text-sm font-semibold text-white transition hover:bg-[#31402d]"
              type="submit"
            >
              Buscar
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
        <SearchResults query={q} searchResponse={searchResponse} />
      </section>

      <DraftRecoverySection draftResponse={draftResponse} />

      <section className="mx-auto w-full max-w-7xl px-6 pb-8 lg:px-8">
        <QueueActivityReceipt />
      </section>
    </main>
  );
}
