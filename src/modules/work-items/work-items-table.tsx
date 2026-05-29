import Link from "next/link";
import {
  getWorkItemPriorityLabel,
  getWorkItemStatusLabel,
  getWorkItemTypeLabel,
} from "./constants";

type WorkItemRow = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  priority: string;
  requesterName: string | null;
  requesterContact: string | null;
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

export function WorkItemsTable({ workItems }: { workItems: WorkItemRow[] }) {
  if (workItems.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Nenhuma demanda registrada
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          Crie a primeira demanda para iniciar o fluxo WorkItem {"->"} execucao.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-[#d7dccf] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-[#f1f3ed] text-xs uppercase text-[#65705f]">
            <tr>
              <th className="px-4 py-3 font-semibold">Demanda</th>
              <th className="px-4 py-3 font-semibold">Tipo</th>
              <th className="px-4 py-3 font-semibold">Prioridade</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Ativo</th>
              <th className="px-4 py-3 font-semibold">Solicitante</th>
              <th className="px-4 py-3 font-semibold">Criada em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e5d9] text-sm">
            {workItems.map((workItem) => (
              <tr key={workItem.id}>
                <td className="px-4 py-4 align-top">
                  <Link
                    className="font-semibold text-[#182017] underline-offset-4 hover:underline"
                    href={`/work-items/${workItem.id}`}
                  >
                    {workItem.title}
                  </Link>
                  {workItem.description ? (
                    <p className="mt-1 line-clamp-2 max-w-md text-[#5b6655]">
                      {workItem.description}
                    </p>
                  ) : null}
                  <p className="mt-2 font-mono text-xs text-[#7a8474]">
                    {workItem.id.slice(0, 8)}
                  </p>
                </td>
                <td className="px-4 py-4 align-top">
                  {getWorkItemTypeLabel(workItem.type)}
                </td>
                <td className="px-4 py-4 align-top">
                  {getWorkItemPriorityLabel(workItem.priority)}
                </td>
                <td className="px-4 py-4 align-top">
                  {getWorkItemStatusLabel(workItem.status)}
                </td>
                <td className="px-4 py-4 align-top">
                  {workItem.assetId && workItem.assetName ? (
                    <Link
                      className="underline-offset-4 hover:underline"
                      href={`/assets/${workItem.assetId}`}
                    >
                      {workItem.assetCode} - {workItem.assetName}
                    </Link>
                  ) : (
                    "Nao vinculado"
                  )}
                </td>
                <td className="px-4 py-4 align-top">
                  <p>{workItem.requesterName ?? "Nao informado"}</p>
                  {workItem.requesterContact ? (
                    <p className="mt-1 text-[#65705f]">{workItem.requesterContact}</p>
                  ) : null}
                </td>
                <td className="px-4 py-4 align-top font-mono text-xs">
                  {formatDate(workItem.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
