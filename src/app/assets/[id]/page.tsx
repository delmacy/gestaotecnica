import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAssetById,
  getAssetHistory,
} from "@/modules/assets/queries";
import { AssetDetail } from "@/modules/assets/asset-detail";

export const dynamic = "force-dynamic";

type AssetDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AssetDetailPage({ params }: AssetDetailPageProps) {
  const { id } = await params;
  const [asset, history] = await Promise.all([
    getAssetById(id),
    getAssetHistory(id),
  ]);

  if (!asset) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-slate-500 tracking-wider">Visualização de Ativo</p>
              <h1 className="mt-2 max-w-4xl text-4xl font-bold text-slate-900 tracking-tight">
                {asset.name}
              </h1>
              <p className="mt-2 font-mono text-xs text-slate-400">
                {asset.code} | {asset.id}
              </p>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              href="/assets"
            >
              Voltar para Ativos
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
        <AssetDetail asset={asset} history={history} />
      </section>
    </main>
  );
}
