import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getServiceOrderById,
  getServiceOrderAssignments,
  getServiceOrderEvidences,
  getServiceOrderEvents,
  getServiceOrderStages,
  getServiceOrderTargets,
  getServiceOrderTasks,
  getServiceOrderTimeEntries,
} from "@/modules/service-orders/queries";
import { getTechnicianOptions } from "@/modules/workforce/queries";
import { ServiceOrderAssignmentForm } from "@/modules/service-orders/assignment-form";
import { ServiceOrderAssignmentsList } from "@/modules/service-orders/assignments-list";
import { ServiceOrderEvidenceForm } from "@/modules/service-orders/evidence-form";
import { ServiceOrderEvidencesList } from "@/modules/service-orders/evidences-list";
import { ServiceOrderEventTimeline } from "@/modules/service-orders/event-timeline";
import { ServiceOrderStatusForm } from "@/modules/service-orders/status-form";
import { ServiceOrderReviewRequestForm } from "@/modules/service-orders/review-request-form";
import { ServiceOrderTimeEntryForm } from "@/modules/service-orders/time-entry-form";
import { ServiceOrderTimeEntriesList } from "@/modules/service-orders/time-entries-list";
import {
  ServiceOrderExecutionPlan,
  ServiceOrderExecutionPlanForms,
} from "@/modules/service-orders/execution-plan";
import {
  getServiceOrderPriorityLabel,
  getServiceOrderStatusLabel,
  getServiceOrderTypeLabel,
} from "@/modules/service-orders/constants";
import { EntityCollaboration } from "@/modules/comments/entity-collaboration";
import {
  getEntityAttachments,
  getEntityComments,
} from "@/modules/comments/queries";
import { getWorkflowInstancesForTarget } from "@/modules/workflow-engine/queries";
import { WorkflowInstancePanel } from "@/modules/workflow-engine/workflow-instance-panel";
import { ActionBar } from "@/components/action-bar";
import { getAvailableActionsForEntity } from "@/platform/views";
import { resolveWorkspaceContext } from "@/platform/workspace";

export const dynamic = "force-dynamic";

type ServiceOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) return "Nao informado";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default async function ServiceOrderDetailPage({
  params,
}: ServiceOrderDetailPageProps) {
  const { id } = await params;
  const [
    serviceOrder,
    events,
    assignments,
    technicians,
    timeEntries,
    evidences,
    stages,
    tasks,
    targets,
    workflowInstances,
    comments,
    attachments,
  ] = await Promise.all([
      getServiceOrderById(id),
      getServiceOrderEvents(id),
      getServiceOrderAssignments(id),
      getTechnicianOptions(),
      getServiceOrderTimeEntries(id),
      getServiceOrderEvidences(id),
      getServiceOrderStages(id),
      getServiceOrderTasks(id),
      getServiceOrderTargets(id),
      getWorkflowInstancesForTarget("service_order", id),
      getEntityComments("service_order", id),
      getEntityAttachments("service_order", id),
    ]);

  if (!serviceOrder) {
    notFound();
  }

  const context = await resolveWorkspaceContext({ source: "ui" });
  const availableActions = await getAvailableActionsForEntity(
    "service_order",
    serviceOrder.status,
    context,
  );

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#65705f]">OS</p>
              <h1 className="mt-2 max-w-4xl text-4xl font-semibold text-[#111510]">
                {serviceOrder.code}
              </h1>
              <p className="mt-2 text-lg text-[#273025]">{serviceOrder.title}</p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <ActionBar actions={availableActions} entityId={serviceOrder.id} path={`/service-orders/${serviceOrder.id}`} />
              <Link
              className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]"
                href="/service-orders"
              >
                Voltar para OS
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Tipo</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {getServiceOrderTypeLabel(serviceOrder.type)}
              </p>
            </div>
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Status</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {getServiceOrderStatusLabel(serviceOrder.status)}
              </p>
            </div>
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Prioridade</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {getServiceOrderPriorityLabel(serviceOrder.priority)}
              </p>
            </div>
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Criada em</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {formatDate(serviceOrder.createdAt)}
              </p>
            </div>
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Concluida em</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {formatDate(serviceOrder.completedAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="space-y-6">
          <article className="border border-[#d7dccf] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#111510]">Execucao</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#4d5848]">
              {serviceOrder.objective ?? "Sem objetivo informado."}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="font-mono text-xs text-[#6e7a66]">Demanda origem</p>
                {serviceOrder.workItemId && serviceOrder.workItemTitle ? (
                  <Link
                    className="mt-1 block text-sm text-[#273025] underline-offset-4 hover:underline"
                    href={`/work-items/${serviceOrder.workItemId}`}
                  >
                    {serviceOrder.workItemTitle}
                  </Link>
                ) : (
                  <p className="mt-1 text-sm text-[#273025]">Nao vinculada</p>
                )}
              </div>
              <div>
                <p className="font-mono text-xs text-[#6e7a66]">Ativo</p>
                {serviceOrder.assetId && serviceOrder.assetName ? (
                  <Link
                    className="mt-1 block text-sm text-[#273025] underline-offset-4 hover:underline"
                    href={`/assets/${serviceOrder.assetId}`}
                  >
                    {serviceOrder.assetCode} - {serviceOrder.assetName}
                  </Link>
                ) : (
                  <p className="mt-1 text-sm text-[#273025]">Nao vinculado</p>
                )}
              </div>
            </div>
          </article>

          <ServiceOrderAssignmentsList assignments={assignments} />

          <ServiceOrderExecutionPlan
            stages={stages}
            targets={targets}
            tasks={tasks}
          />

          <WorkflowInstancePanel
            instances={workflowInstances}
            returnTo={`/service-orders/${serviceOrder.id}`}
            targetId={serviceOrder.id}
            targetType="service_order"
          />

          <ServiceOrderTimeEntriesList timeEntries={timeEntries} />

          <ServiceOrderEvidencesList evidences={evidences} />

          <EntityCollaboration
            attachments={attachments}
            comments={comments}
            entityId={serviceOrder.id}
            entityType="service_order"
            returnTo={`/service-orders/${serviceOrder.id}`}
          />

          <ServiceOrderEventTimeline events={events} />
        </div>

        <aside className="space-y-6">
          <ServiceOrderAssignmentForm
            serviceOrderId={serviceOrder.id}
            technicians={technicians}
          />
          <ServiceOrderTimeEntryForm
            assignments={assignments}
            serviceOrderId={serviceOrder.id}
          />
          <ServiceOrderEvidenceForm serviceOrderId={serviceOrder.id} />
          <ServiceOrderExecutionPlanForms
            serviceOrderId={serviceOrder.id}
            stages={stages}
            technicians={technicians}
          />
          <ServiceOrderReviewRequestForm
            currentStatus={serviceOrder.status}
            serviceOrderId={serviceOrder.id}
          />
          <ServiceOrderStatusForm
            currentStatus={serviceOrder.status}
            serviceOrderId={serviceOrder.id}
          />
        </aside>
      </section>
    </main>
  );
}
