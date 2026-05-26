import Link from "next/link";
import {
  getServiceOrderPriorityLabel,
  getServiceOrderStatusLabel,
} from "@/modules/service-orders/constants";
import {
  getWorkItemPriorityLabel,
  getWorkItemStatusLabel,
} from "@/modules/work-items/constants";
import { getTechnicianLevelLabel } from "@/modules/workforce/constants";

type WorkItemRow = {
  id: string;
  title: string;
  status: string;
  priority: string;
  assetCode: string | null;
  assetName: string | null;
};

type ServiceOrderRow = {
  id: string;
  code: string;
  title: string;
  status: string;
  priority: string;
  assetCode: string | null;
  assetName: string | null;
};

type PendingShiftRow = {
  id: string;
  title: string;
  description: string | null;
  shiftId: string;
  shiftName: string;
  serviceOrderId: string | null;
  serviceOrderCode: string | null;
};

type EventRow = {
  id: string;
  eventType: string;
  entityType: string;
  occurredAt: Date;
  serviceOrderId: string | null;
  serviceOrderCode: string | null;
};

type TechnicianRow = {
  id: string;
  name: string;
  email: string;
  level: string;
  specialty: string | null;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function OperationsBoard({
  activeOrders,
  criticalWorkItems,
  pendingShiftEntries,
  recentEvents,
  technicians,
}: {
  activeOrders: ServiceOrderRow[];
  criticalWorkItems: WorkItemRow[];
  pendingShiftEntries: PendingShiftRow[];
  recentEvents: EventRow[];
  technicians: TechnicianRow[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Demandas criticas</h2>
        <div className="mt-4 space-y-3">
          {criticalWorkItems.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Nenhuma demanda critica na fila.</p>
          ) : (
            criticalWorkItems.map((item) => (
              <Link
                className="block border border-[#e0e5d9] bg-[#fbfcf8] p-4 transition hover:bg-[#f1f3ed]"
                href={`/work-items/${item.id}`}
                key={item.id}
              >
                <p className="font-semibold text-[#182017]">{item.title}</p>
                <p className="mt-2 text-sm text-[#5b6655]">
                  {getWorkItemStatusLabel(item.status)} |{" "}
                  {getWorkItemPriorityLabel(item.priority)}
                </p>
                <p className="mt-1 text-sm text-[#5b6655]">
                  {item.assetName ? `${item.assetCode} - ${item.assetName}` : "Sem ativo"}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">OS ativas</h2>
        <div className="mt-4 space-y-3">
          {activeOrders.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Nenhuma OS ativa no momento.</p>
          ) : (
            activeOrders.map((order) => (
              <Link
                className="block border border-[#e0e5d9] bg-[#fbfcf8] p-4 transition hover:bg-[#f1f3ed]"
                href={`/service-orders/${order.id}`}
                key={order.id}
              >
                <p className="font-mono text-xs text-[#7a8474]">{order.code}</p>
                <p className="mt-1 font-semibold text-[#182017]">{order.title}</p>
                <p className="mt-2 text-sm text-[#5b6655]">
                  {getServiceOrderStatusLabel(order.status)} |{" "}
                  {getServiceOrderPriorityLabel(order.priority)}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Pendencias de turno</h2>
        <div className="mt-4 space-y-3">
          {pendingShiftEntries.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Nenhuma pendencia marcada.</p>
          ) : (
            pendingShiftEntries.map((entry) => (
              <Link
                className="block border border-[#e0e5d9] bg-[#fbfcf8] p-4 transition hover:bg-[#f1f3ed]"
                href={`/shifts/${entry.shiftId}`}
                key={entry.id}
              >
                <p className="font-semibold text-[#182017]">{entry.title}</p>
                <p className="mt-1 text-sm text-[#5b6655]">{entry.shiftName}</p>
                {entry.serviceOrderCode ? (
                  <p className="mt-1 text-sm text-[#5b6655]">
                    OS {entry.serviceOrderCode}
                  </p>
                ) : null}
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Tecnicos disponiveis</h2>
        <div className="mt-4 space-y-3">
          {technicians.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Nenhum tecnico disponivel.</p>
          ) : (
            technicians.map((technician) => (
              <div className="border border-[#e0e5d9] bg-[#fbfcf8] p-4" key={technician.id}>
                <p className="font-semibold text-[#182017]">{technician.name}</p>
                <p className="mt-1 text-sm text-[#5b6655]">{technician.email}</p>
                <p className="mt-1 text-sm text-[#5b6655]">
                  {getTechnicianLevelLabel(technician.level)}
                  {technician.specialty ? ` | ${technician.specialty}` : ""}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm xl:col-span-2">
        <h2 className="text-lg font-semibold text-[#111510]">Eventos recentes</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {recentEvents.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Sem eventos recentes.</p>
          ) : (
            recentEvents.map((event) => (
              <div className="border border-[#e0e5d9] bg-[#fbfcf8] p-4" key={event.id}>
                <p className="font-semibold text-[#182017]">{event.eventType}</p>
                <p className="mt-1 font-mono text-xs text-[#7a8474]">
                  {formatDate(event.occurredAt)}
                </p>
                <p className="mt-1 text-sm text-[#5b6655]">
                  {event.entityType}
                  {event.serviceOrderCode ? ` | OS ${event.serviceOrderCode}` : ""}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
