import Link from "next/link";
import { AssetForm } from "@/modules/assets/asset-form";
import { AssetsTable } from "@/modules/assets/assets-table";
import {
  getAssets,
} from "@/modules/assets/queries";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const assets = await getAssets();

  const summary = [
    { label: "Total de Ativos", value: assets.length },
    { label: "Ativos Disponíveis", value: assets.filter((a: any) => a.status === 'available').length },
    { label: "Em Manutenção", value: assets.filter((a: any) => a.status === 'maintenance').length },
    { label: "Avariados", value: assets.filter((a: any) => a.status === 'broken').length },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-slate-500 tracking-wider">
                Módulo Universal
              </p>
              <h1 className="mt-2 text-4xl font-bold text-slate-900 tracking-tight">
                Ativos
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Gerencie todos os ativos da organização de forma centralizada e universal.
              </p>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              href="/"
            >
              Voltar ao painel
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summary.map((item) => (
              <div
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                key={item.label}
              >
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1fr_400px] lg:px-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Inventário de Ativos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Visualize e gerencie todos os ativos cadastrados.
            </p>
          </div>
          <AssetsTable assets={assets} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
            <h3 className="mb-6 text-lg font-bold text-slate-900">Novo Ativo</h3>
            <AssetForm />
          </div>
        </aside>
      </section>
    </main>
  );
}
