import Link from "next/link";
import {
  getServiceOrderPriorityLabel,
  getServiceOrderStatusLabel,
} from "@/modules/service-orders/constants";
import {
  getWorkItemPriorityLabel,
  getWorkItemStatusLabel,
  getWorkItemTypeLabel,
} from "@/modules/work-items/constants";

type WorkItemPlanningRow = {
  id: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  assetCode: string | null;
  assetName: string | null;
};

type ServiceOrderPlanningRow = {
  id: string;
  code: string;
  title: string;
  status: string;
  priority: string;
  assetCode: string | null;
  assetName: string | null;
};

function WorkItemCard({ item }: { item: WorkItemPlanningRow }) {
  return (
    <Link
      className="block border border-[#e0e5d9] bg-[#fbfcf8] p-4 transition hover:bg-[#f1f3ed]"
      href={`/work-items/${item.id}`}
    >
      <p className="font-semibold text-[#182017]">{item.title}</p>
      <p className="mt-2 text-sm text-[#5b6655]">
        {getWorkItemTypeLabel(item.type)} | {getWorkItemStatusLabel(item.status)}
      </p>
      <p className="mt-1 text-sm text-[#5b6655]">
        {getWorkItemPriorityLabel(item.priority)}
        {item.assetName ? ` | ${item.assetCode} - ${item.assetName}` : ""}
      </p>
    </Link>
  );
}

function ServiceOrderCard({ order }: { order: ServiceOrderPlanningRow }) {
  return (
    <Link
      className="block border border-[#e0e5d9] bg-[#fbfcf8] p-4 transition hover:bg-[#f1f3ed]"
      href={`/service-orders/${order.id}`}
    >
      <p className="font-mono text-xs text-[#7a8474]">{order.code}</p>
      <p className="mt-1 font-semibold text-[#182017]">{order.title}</p>
      <p className="mt-2 text-sm text-[#5b6655]">
        {getServiceOrderStatusLabel(order.status)} |{" "}
        {getServiceOrderPriorityLabel(order.priority)}
      </p>
      {order.assetName ? (
        <p className="mt-1 text-sm text-[#5b6655]">
          {order.assetCode} - {order.assetName}
        </p>
      ) : null}
    </Link>
  );
}

export function PlanningBoard({
  backlog,
  executionOrders,
  plannedOrders,
  reviewOrders,
}: {
  backlog: WorkItemPlanningRow[];
  executionOrders: ServiceOrderPlanningRow[];
  plannedOrders: ServiceOrderPlanningRow[];
  reviewOrders: ServiceOrderPlanningRow[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-4">
      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Backlog</h2>
        <div className="mt-4 space-y-3">
          {backlog.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Sem demandas planejaveis.</p>
          ) : (
            backlog.map((item) => <WorkItemCard item={item} key={item.id} />)
          )}
        </div>
      </section>

      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Planejadas</h2>
        <div className="mt-4 space-y-3">
          {plannedOrders.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Sem OS planejadas.</p>
          ) : (
            plannedOrders.map((order: any) => (
              <ServiceOrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      </section>

      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Execucao</h2>
        <div className="mt-4 space-y-3">
          {executionOrders.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Sem OS em execucao.</p>
          ) : (
            executionOrders.map((order: any) => (
              <ServiceOrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      </section>

      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Revisao</h2>
        <div className="mt-4 space-y-3">
          {reviewOrders.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Sem OS em revisao.</p>
          ) : (
            reviewOrders.map((order: any) => (
              <ServiceOrderCard key={order.id} order={order} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
