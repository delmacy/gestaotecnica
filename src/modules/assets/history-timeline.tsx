import { getStatusLabel, getCategoryLabel } from "./constants";

type AssetHistoryEntry = {
  id: string;
  action: string;
  previousData: { status?: string; note?: string; [key: string]: unknown } | null;
  newData: { status?: string; note?: string; [key: string]: unknown } | null;
  occurredAt: Date;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function HistoryTimeline({ history }: { history: AssetHistoryEntry[] }) {
  if (history.length === 0) {
    return <p className="text-sm text-slate-500">Nenhum histórico registrado.</p>;
  }

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {history.map((entry, entryIdx) => (
          <li key={entry.id}>
            <div className="relative pb-8">
              {entryIdx !== history.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 ring-8 ring-white">
                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-slate-900">
                        {entry.action === "create" ? "Ativo criado" : "Ativo atualizado"}
                      </span>
                      {entry.action === "update_status" && (
                        <>
                          {" alterado de "}
                          <span className="font-medium">
                            {getStatusLabel(entry.previousData?.status as string)}
                          </span>
                          {" para "}
                          <span className="font-medium">
                            {getStatusLabel(entry.newData?.status as string)}
                          </span>
                        </>
                      )}
                    </p>
                    {entry.newData?.note && (
                      <p className="mt-1 text-xs text-slate-500 italic">
                        &quot;{entry.newData.note}&quot;
                      </p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-xs text-slate-400">
                    {formatDate(entry.occurredAt)}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
