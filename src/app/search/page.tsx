import Link from "next/link";
import { SearchResults } from "@/modules/global-search/search-results";
import { searchEverything } from "@/modules/global-search/queries";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const results = await searchEverything(q);

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
        <SearchResults query={q} results={results} />
      </section>
    </main>
  );
}
