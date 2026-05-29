import Link from "next/link";

type ShiftEntryRow = {
  id: string;
  title: string;
  description: string | null;
  isPending: boolean;
  createdAt: Date;
  workItemId: string | null;
  workItemTitle: string | null;
  serviceOrderId: string | null;
  serviceOrderCode: string | null;
  serviceOrderTitle: string | null;
  assetId: string | null;
  assetCode: string | null;
  assetName: string | null;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function ShiftEntriesList({ entries }: { entries: ShiftEntryRow[] }) {
  if (entries.length === 0) {
    return (
      <article className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Nenhum registro no turno
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          Adicione ocorrencias e pendencias para compor a passagem de servico.
        </p>
      </article>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={entry.id}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#111510]">{entry.title}</h2>
              <p className="mt-1 font-mono text-xs text-[#7a8474]">
                {formatDate(entry.createdAt)}
              </p>
            </div>
            {entry.isPending ? (
              <span className="border border-[#b9c6ac] px-2 py-1 font-mono text-xs text-[#506247]">
                Pendencia
              </span>
            ) : null}
          </div>

          {entry.description ? (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#4d5848]">
              {entry.description}
            </p>
          ) : null}

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="font-mono text-xs text-[#6e7a66]">execucao</p>
              {entry.serviceOrderId && entry.serviceOrderCode ? (
                <Link
                  className="mt-1 block text-[#273025] underline-offset-4 hover:underline"
                  href={`/service-orders/${entry.serviceOrderId}`}
                >
                  {entry.serviceOrderCode} - {entry.serviceOrderTitle}
                </Link>
              ) : (
                <p className="mt-1 text-[#273025]">Nao vinculada</p>
              )}
            </div>
            <div>
              <p className="font-mono text-xs text-[#6e7a66]">Demanda</p>
              {entry.workItemId && entry.workItemTitle ? (
                <Link
                  className="mt-1 block text-[#273025] underline-offset-4 hover:underline"
                  href={`/work-items/${entry.workItemId}`}
                >
                  {entry.workItemTitle}
                </Link>
              ) : (
                <p className="mt-1 text-[#273025]">Nao vinculada</p>
              )}
            </div>
            <div>
              <p className="font-mono text-xs text-[#6e7a66]">Ativo</p>
              {entry.assetId && entry.assetName ? (
                <Link
                  className="mt-1 block text-[#273025] underline-offset-4 hover:underline"
                  href={`/assets/${entry.assetId}`}
                >
                  {entry.assetCode} - {entry.assetName}
                </Link>
              ) : (
                <p className="mt-1 text-[#273025]">Nao vinculado</p>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
