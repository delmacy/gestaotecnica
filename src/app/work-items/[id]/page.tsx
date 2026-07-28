import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkItemStatusForm } from "@/modules/work-items/status-form";
import {
  getWorkItemById,
  getWorkItemEvents,
} from "@/modules/work-items/queries";
import {
  getWorkItemPriorityLabel,
  getWorkItemStatusLabel,
  getWorkItemTypeLabel,
} from "@/modules/work-items/constants";
import { WorkItemEventTimeline } from "@/modules/work-items/event-timeline";
import { CreateServiceOrderFromWorkItemForm } from "@/modules/service-orders/create-from-work-item-form";
import { getServiceOrderTypeOptions } from "@/modules/service-orders/queries";
import { resolveWorkspaceContext } from "@/platform/workspace";

export const dynamic = "force-dynamic";

type WorkItemDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date?: Date) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default async function WorkItemDetailPage({
  params,
}: WorkItemDetailPageProps) {
  const { id } = await params;
  await resolveWorkspaceContext({ source: "ui" });

  const [workItem, events, serviceOrderTypeOptions] = await Promise.all([
    getWorkItemById(id),
    getWorkItemEvents(id),
    getServiceOrderTypeOptions(),
  ]);

  if (!workItem) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#65705f]">
                {getWorkItemTypeLabel(workItem.type)}
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-[#111510]">
                {workItem.title}
              </h1>
              <p className="mt-2 font-mono text-xs text-[#7a8474]">
                ID: {workItem.id}
              </p>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]"
              href="/work-items"
            >
              Voltar as demandas
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Status atual</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {getWorkItemStatusLabel(workItem.status)}
              </p>
            </div>
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Prioridade</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {getWorkItemPriorityLabel(workItem.priority)}
              </p>
            </div>
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Criada em</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {formatDate(workItem.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="space-y-6">
          <article className="border border-[#d7dccf] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#111510]">Contexto</h2>
            {workItem.description ? (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#273025]">
                {workItem.description}
              </p>
            ) : (
              <p className="mt-4 text-sm italic text-[#7a8474]">
                Nenhuma descricao fornecida.
              </p>
            )}
          </article>

          <article className="border border-[#d7dccf] bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#111510]">
              Ativo Vinculado
            </h2>
            {workItem.assetId && workItem.assetName ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#273025]">
                    {workItem.assetName}
                  </p>
                  <p className="font-mono text-xs text-[#65705f]">
                    {workItem.assetCode}
                  </p>
                </div>
                <Link
                  className="text-sm font-medium underline underline-offset-4 hover:text-[#31402d]"
                  href={`/assets/${workItem.assetId}`}
                >
                  Ver ativo
                </Link>
              </div>
            ) : (
              <p className="text-sm text-[#5b6655]">
                Esta demanda nao esta vinculada a nenhum ativo especifico.
              </p>
            )}
          </article>

          <article className="border border-[#d7dccf] bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#111510]">
              Solicitante
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-[#273025]">Nome</p>
                <p className="mt-1 text-sm text-[#5b6655]">
                  {workItem.requesterName ?? "Nao informado"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#273025]">Contato</p>
                <p className="mt-1 text-sm text-[#5b6655]">
                  {workItem.requesterContact ?? "Nao informado"}
                </p>
              </div>
            </div>
          </article>

          <article>
            <h2 className="mb-4 text-lg font-semibold text-[#111510]">
              Linha do Tempo
            </h2>
            <WorkItemEventTimeline events={events} />
          </article>
        </div>

        <aside className="space-y-6">
          <WorkItemStatusForm
            currentStatus={workItem.status}
            workItemId={workItem.id}
          />
          {workItem.status !== "cancelled" &&
          workItem.status !== "resolved" ? (
            <CreateServiceOrderFromWorkItemForm
              serviceOrderTypes={serviceOrderTypeOptions}
              workItemId={workItem.id}
            />
          ) : null}
        </aside>
      </section>
    </main>
  );
}
