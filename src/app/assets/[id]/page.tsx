import Link from "next/link";
import { notFound } from "next/navigation";
import { AssetEventTimeline } from "@/modules/assets/event-timeline";
import {
  getAssetById,
  getAssetEvents,
  getAssetRelationsSummary,
} from "@/modules/assets/queries";
import { AssetStatusForm } from "@/modules/assets/status-form";
import {
  getAssetCriticalityLabel,
  getAssetStatusLabel,
  getAssetTypeLabel,
} from "@/modules/assets/constants";
import { EntityCollaboration } from "@/modules/comments/entity-collaboration";
import {
  getEntityAttachments,
  getEntityComments,
} from "@/modules/comments/queries";

export const dynamic = "force-dynamic";

type AssetDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default async function AssetDetailPage({ params }: AssetDetailPageProps) {
  const { id } = await params;
  const [asset, events, relations, comments, attachments] = await Promise.all([
    getAssetById(id),
    getAssetEvents(id),
    getAssetRelationsSummary(id),
    getEntityComments("asset", id),
    getEntityAttachments("asset", id),
  ]);

  if (!asset) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#65705f]">Ativo</p>
              <h1 className="mt-2 max-w-4xl text-4xl font-semibold text-[#111510]">
                {asset.name}
              </h1>
              <p className="mt-2 font-mono text-xs text-[#6e7a66]">
                {asset.code} | {asset.id}
              </p>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]"
              href="/assets"
            >
              Voltar para Ativos
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Status</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {getAssetStatusLabel(asset.status)}
              </p>
            </div>
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Tipo</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {getAssetTypeLabel(asset.type)}
              </p>
            </div>
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Criticidade</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {getAssetCriticalityLabel(asset.criticality)}
              </p>
            </div>
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Criado em</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {formatDate(asset.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="space-y-6">
          <article className="border border-[#d7dccf] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#111510]">Contexto</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#4d5848]">
              {asset.description ?? "Sem descricao informada."}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="font-mono text-xs text-[#6e7a66]">Localizacao</p>
                <p className="mt-1 text-sm text-[#273025]">
                  {asset.location ?? "Nao informada"}
                </p>
              </div>
              {relations.map((relation) => (
                <div key={relation.label}>
                  <p className="font-mono text-xs text-[#6e7a66]">
                    {relation.label}
                  </p>
                  <p className="mt-1 text-sm text-[#273025]">
                    {relation.value}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <EntityCollaboration
            attachments={attachments}
            comments={comments}
            entityId={asset.id}
            entityType="asset"
            returnTo={`/assets/${asset.id}`}
          />

          <AssetEventTimeline events={events} />
        </div>

        <aside>
          <AssetStatusForm assetId={asset.id} currentStatus={asset.status} />
        </aside>
      </section>
    </main>
  );
}
