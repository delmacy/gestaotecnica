import Link from "next/link";
import type { ApprovalRequest } from "./contracts/approval.schema";

function formatDate(date: Date | null | undefined) {
  if (!date) return "Nao informado";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function ApprovalQueueTable({ items }: { items: ApprovalRequest[] }) {
  if (items.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-12 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-[#111510]">
          Nenhuma solicitacao pendente
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          Todas as solicitações de aprovação do seu workspace foram processadas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm transition hover:border-[#b9c6ac]" key={item.id}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Link
                className="font-mono text-sm font-semibold text-[#182017] underline-offset-4 hover:underline"
                href={`/approvals/${item.id}`}
              >
                REQ-{item.id?.substring(0, 8).toUpperCase()}
              </Link>
              <h2 className="mt-2 text-xl font-semibold text-[#111510]">
                {item.subjectType}: {item.subjectId}
              </h2>
              {item.comment ? (
                <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-[#4d5848]">
                  {item.comment}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="border border-[#b9c6ac] px-2 py-1 font-mono text-[10px] text-[#506247] uppercase">
                {item.status}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-6 border-t border-[#f0f2ed] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                <p className="font-mono text-[10px] uppercase text-[#6e7a66]">Solicitante</p>
                <p className="mt-1 font-medium text-[#273025]">{item.requesterName}</p>
                </div>
                <div>
                <p className="font-mono text-[10px] uppercase text-[#6e7a66]">Criado em</p>
                <p className="mt-1 text-[#273025]">{formatDate(item.createdAt)}</p>
                </div>
            </div>

            <Link
                href={`/approvals/${item.id}`}
                className="inline-flex h-10 items-center justify-center bg-[#1f2a1c] px-6 text-sm font-semibold text-white transition hover:bg-[#31402d]"
            >
                Analisar Solicitação
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
