import Link from "next/link";
import {
  getServiceOrderPriorityLabel,
  getServiceOrderStatusLabel,
  getServiceOrderTypeLabel,
} from "./constants";

type ServiceOrderRow = {
  id: string;
  code: string;
  title: string;
  type: string;
  objective: string | null;
  status: string;
  priority: string;
  workItemId: string | null;
  assetId: string | null;
  assetCode: string | null;
  assetName: string | null;
  createdAt: Date;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function ServiceOrdersTable({
  serviceOrders,
}: {
  serviceOrders: ServiceOrderRow[];
}) {
  if (serviceOrders.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Nenhuma execucao registrada
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          Crie uma execucao a partir do detalhe de um WorkItem.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-[#d7dccf] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead className="bg-[#f1f3ed] text-xs uppercase text-[#65705f]">
            <tr>
              <th className="px-4 py-3 font-semibold">execucao</th>
              <th className="px-4 py-3 font-semibold">Tipo</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Prioridade</th>
              <th className="px-4 py-3 font-semibold">Ativo</th>
              <th className="px-4 py-3 font-semibold">Criada em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e5d9] text-sm">
            {serviceOrders.map((serviceOrder) => (
              <tr key={serviceOrder.id}>
                <td className="px-4 py-4 align-top">
                  <Link
                    className="font-semibold text-[#182017] underline-offset-4 hover:underline"
                    href={`/service-orders/${serviceOrder.id}`}
                  >
                    {serviceOrder.code}
                  </Link>
                  <p className="mt-1 text-[#273025]">{serviceOrder.title}</p>
                  {serviceOrder.objective ? (
                    <p className="mt-1 line-clamp-2 max-w-md text-[#5b6655]">
                      {serviceOrder.objective}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-4 align-top">
                  {getServiceOrderTypeLabel(serviceOrder.type)}
                </td>
                <td className="px-4 py-4 align-top">
                  {getServiceOrderStatusLabel(serviceOrder.status)}
                </td>
                <td className="px-4 py-4 align-top">
                  {getServiceOrderPriorityLabel(serviceOrder.priority)}
                </td>
                <td className="px-4 py-4 align-top">
                  {serviceOrder.assetId && serviceOrder.assetName ? (
                    <Link
                      className="underline-offset-4 hover:underline"
                      href={`/assets/${serviceOrder.assetId}`}
                    >
                      {serviceOrder.assetCode} - {serviceOrder.assetName}
                    </Link>
                  ) : (
                    "Nao vinculado"
                  )}
                </td>
                <td className="px-4 py-4 align-top font-mono text-xs">
                  {formatDate(serviceOrder.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
