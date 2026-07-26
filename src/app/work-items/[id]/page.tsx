import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getWorkItemEvents,
  getWorkItemById,
} from "@/modules/work-items/queries";
import { WorkItemEventTimeline } from "@/modules/work-items/event-timeline";
import { WorkItemStatusForm } from "@/modules/work-items/status-form";
import { CreateServiceOrderFromWorkItemForm } from "@/modules/service-orders/create-from-work-item-form";
import { WorkItemServiceOrdersList } from "@/modules/service-orders/service-orders-list";
import {
  getServiceOrdersForWorkItem,
  getServiceOrderTypeOptions,
} from "@/modules/service-orders/queries";
import {
  getWorkItemPriorityLabel,
  getWorkItemStatusLabel,
  getWorkItemTypeLabel,
} from "@/modules/work-items/constants";
import { EntityCollaboration } from "@/modules/comments/entity-collaboration";
import {
  getEntityAttachments,
  getEntityComments,
} from "@/modules/comments/queries";
import { ActionBar } from "@/components/action-bar";
import { getAvailableActionsForEntity } from "@/platform/views";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { resolveOriginContext } from "@/platform/builder/contracts/origin-context/resolve-origin-context";

export const dynamic = "force-dynamic";

type WorkItemDetailPageProps = {
  searchParams: Promise<{ origin?: string }>;

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

export default async function WorkItemDetailPage({
  params,
  searchParams,
}: WorkItemDetailPageProps) {
  const { id } = await params;
  const [
    workItem,
    events,
    serviceOrders,
    serviceOrderTypeOptions,
    comments,
    attachments,
  ] = await Promise.all([
      getWorkItemById(id),
      getWorkItemEvents(id),
      getServiceOrdersForWorkItem(id),
      getServiceOrderTypeOptions(),
      getEntityComments("work_item", id),
      getEntityAttachments("work_item", id),
    ]);

  if (!workItem) {
    notFound();
  }

  const context = await resolveWorkspaceContext({ source: "ui" });
  const searchParamsAwaited = await searchParams;
  const originPath = searchParamsAwaited.origin ?? null;
  const currentPath = `/work-items/${id}`;
  const originContext = resolveOriginContext({ workspaceContext: context, currentPath, originPath });
  const availableActions = await getAvailableActionsForEntity(
    "work_item",
    workItem.status,
    context,
  );

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs uppercase text-[#65705f]">Demanda</p>
                {originContext.isDemo && (
                  <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                    DEMO MODE
                  </span>
                )}
                {originContext.isSynthetic && (
                  <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20">
                    SYNTHETIC MODE
                  </span>
                )}
              </div>
              <h1 className="mt-2 max-w-4xl text-4xl font-semibold text-[#111510]">
                {workItem.title}
              </h1>
              <p className="mt-2 font-mono text-xs text-[#6e7a66]">
                {workItem.id}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <ActionBar actions={availableActions} entityId={workItem.id} path={`/work-items/${workItem.id}`} />
              <Link
              className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]"
                href={originContext.returnPath ?? "/builder"}
              >
                {originContext.returnLabel}
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Status</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {getWorkItemStatusLabel(workItem.status)}
              </p>
            </div>
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Tipo</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {getWorkItemTypeLabel(workItem.type)}
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
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#4d5848]">
              {workItem.description ?? "Sem descricao informada."}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="font-mono text-xs text-[#6e7a66]">Solicitante</p>
                <p className="mt-1 text-sm text-[#273025]">
                  {workItem.requesterName ?? "Nao informado"}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6e7a66]">Contato</p>
                <p className="mt-1 text-sm text-[#273025]">
                  {workItem.requesterContact ?? "Nao informado"}
                </p>
              </div>
              <div>
                <p className="font-mono text-xs text-[#6e7a66]">Ativo</p>
                {workItem.assetId && workItem.assetName ? (
                  <Link
                    className="mt-1 block text-sm text-[#273025] underline-offset-4 hover:underline"
                    href={`/assets/${workItem.assetId}`}
                  >
                    {workItem.assetCode} - {workItem.assetName}
                  </Link>
                ) : (
                  <p className="mt-1 text-sm text-[#273025]">Nao vinculado</p>
                )}
              </div>
            </div>
          </article>

          <WorkItemServiceOrdersList serviceOrders={serviceOrders} />
          <EntityCollaboration
            attachments={attachments}
            comments={comments}
            entityId={workItem.id}
            entityType="work_item"
            returnTo={`/work-items/${workItem.id}`}
          />
          <WorkItemEventTimeline events={events} />
        </div>

        <aside className="space-y-6">
          <CreateServiceOrderFromWorkItemForm
            serviceOrderTypes={serviceOrderTypeOptions}
            workItemId={workItem.id}
          />
          <WorkItemStatusForm
            currentStatus={workItem.status}
            workItemId={workItem.id}
          />
        </aside>
      </section>
    </main>
  );
}
