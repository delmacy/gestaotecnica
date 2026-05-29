import Link from "next/link";
import {
  getServiceOrderPriorityLabel,
  getServiceOrderStatusLabel,
} from "@/modules/service-orders/constants";

type RecentOrderRow = {
  id: string;
  code: string;
  title: string;
  status: string;
  priority: string;
  createdAt: Date;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function RecentOrdersTable({ orders }: { orders: RecentOrderRow[] }) {
  if (orders.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Sem execucao recentes</h2>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-[#d7dccf] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-[#f1f3ed] text-xs uppercase text-[#65705f]">
            <tr>
              <th className="px-4 py-3 font-semibold">execucao</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Prioridade</th>
              <th className="px-4 py-3 font-semibold">Criada em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e5d9] text-sm">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-4 align-top">
                  <Link
                    className="font-semibold text-[#182017] underline-offset-4 hover:underline"
                    href={`/service-orders/${order.id}`}
                  >
                    {order.code}
                  </Link>
                  <p className="mt-1 text-[#273025]">{order.title}</p>
                </td>
                <td className="px-4 py-4 align-top">
                  {getServiceOrderStatusLabel(order.status)}
                </td>
                <td className="px-4 py-4 align-top">
                  {getServiceOrderPriorityLabel(order.priority)}
                </td>
                <td className="px-4 py-4 align-top font-mono text-xs">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
