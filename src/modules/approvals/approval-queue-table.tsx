import Link from "next/link";
import {
  getServiceOrderPriorityLabel,
  getServiceOrderStatusLabel,
} from "@/modules/service-orders/constants";
import type { ApprovalQueueItem } from "./contracts";
import {
  approveServiceOrder,
  returnServiceOrderForExecution,
} from "./actions";

function formatDate(date: Date | null) {
  if (!date) return "Nao informado";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function ApprovalQueueTable({ items }: { items: ApprovalQueueItem[] }) {
  if (items.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Nenhuma OS aguardando revisao
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          As OS enviadas para revisao tecnica aparecem aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={item.id}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Link
                className="font-mono text-sm font-semibold text-[#182017] underline-offset-4 hover:underline"
                href={`/service-orders/${item.id}`}
              >
                {item.code}
              </Link>
              <h2 className="mt-2 text-xl font-semibold text-[#111510]">
                {item.title}
              </h2>
              {item.objective ? (
                <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-[#4d5848]">
                  {item.objective}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="border border-[#b9c6ac] px-2 py-1 font-mono text-xs text-[#506247]">
                {getServiceOrderStatusLabel(item.status)}
              </span>
              <span className="border border-[#b9c6ac] px-2 py-1 font-mono text-xs text-[#506247]">
                {getServiceOrderPriorityLabel(item.priority)}
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="font-mono text-xs text-[#6e7a66]">Concluida em</p>
              <p className="mt-1 text-[#273025]">{formatDate(item.completedAt)}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6e7a66]">Ativo</p>
              <p className="mt-1 text-[#273025]">
                {item.assetId && item.assetName
                  ? `${item.assetCode} - ${item.assetName}`
                  : "Nao vinculado"}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <form action={approveServiceOrder} className="space-y-3">
              <input name="id" type="hidden" value={item.id} />
              <input
                className="h-10 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
                name="note"
                placeholder="Nota de aprovacao"
              />
              <button
                className="h-10 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]"
                type="submit"
              >
                Aprovar OS
              </button>
            </form>

            <form action={returnServiceOrderForExecution} className="space-y-3">
              <input name="id" type="hidden" value={item.id} />
              <input
                className="h-10 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
                name="note"
                placeholder="Motivo do retorno"
                required
              />
              <button
                className="h-10 w-full border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] transition hover:bg-[#f1f3ed]"
                type="submit"
              >
                Retornar para execucao
              </button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}
