import Link from "next/link";
import {
  getServiceOrderPriorityLabel,
  getServiceOrderStatusLabel,
} from "./constants";

type WorkItemServiceOrder = {
  id: string;
  code: string;
  title: string;
  status: string;
  priority: string;
  createdAt: Date;
};

export function WorkItemServiceOrdersList({
  serviceOrders,
}: {
  serviceOrders: WorkItemServiceOrder[];
}) {
  if (serviceOrders.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-5 text-sm text-[#5b6655] shadow-sm">
        Nenhuma OS criada a partir desta demanda.
      </div>
    );
  }

  return (
    <div className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">OS vinculadas</h2>
      <div className="mt-4 space-y-3">
        {serviceOrders.map((serviceOrder) => (
          <Link
            className="block border border-[#e0e5d9] p-4 transition hover:bg-[#f6f7f4]"
            href={`/service-orders/${serviceOrder.id}`}
            key={serviceOrder.id}
          >
            <p className="font-mono text-xs text-[#6e7a66]">
              {serviceOrder.code}
            </p>
            <p className="mt-1 font-semibold text-[#182017]">
              {serviceOrder.title}
            </p>
            <p className="mt-2 text-sm text-[#5b6655]">
              {getServiceOrderStatusLabel(serviceOrder.status)} |{" "}
              {getServiceOrderPriorityLabel(serviceOrder.priority)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
