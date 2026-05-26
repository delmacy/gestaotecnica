import Link from "next/link";

type EventRow = {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string | null;
  payload: unknown;
  occurredAt: Date;
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

function payloadSummary(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;

  const data = payload as Record<string, unknown>;
  const parts = [
    typeof data.code === "string" ? data.code : null,
    typeof data.title === "string" ? data.title : null,
    typeof data.from === "string" && typeof data.to === "string"
      ? `${data.from} -> ${data.to}`
      : null,
    typeof data.note === "string" ? data.note : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" | ") : null;
}

export function EventsTable({ events }: { events: EventRow[] }) {
  if (events.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Nenhum evento registrado
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          O historico sera preenchido automaticamente pelos modulos operacionais.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-[#d7dccf] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead className="bg-[#f1f3ed] text-xs uppercase text-[#65705f]">
            <tr>
              <th className="px-4 py-3 font-semibold">Evento</th>
              <th className="px-4 py-3 font-semibold">Entidade</th>
              <th className="px-4 py-3 font-semibold">Vinculos</th>
              <th className="px-4 py-3 font-semibold">Resumo</th>
              <th className="px-4 py-3 font-semibold">Quando</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e5d9] text-sm">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-4 py-4 align-top">
                  <p className="font-semibold text-[#182017]">{event.eventType}</p>
                  <p className="mt-1 font-mono text-xs text-[#7a8474]">{event.id}</p>
                </td>
                <td className="px-4 py-4 align-top">
                  <p>{event.entityType}</p>
                  {event.entityId ? (
                    <p className="mt-1 font-mono text-xs text-[#7a8474]">
                      {event.entityId}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="space-y-1">
                    {event.serviceOrderId && event.serviceOrderCode ? (
                      <Link
                        className="block underline-offset-4 hover:underline"
                        href={`/service-orders/${event.serviceOrderId}`}
                      >
                        {event.serviceOrderCode} - {event.serviceOrderTitle}
                      </Link>
                    ) : null}
                    {event.workItemId && event.workItemTitle ? (
                      <Link
                        className="block underline-offset-4 hover:underline"
                        href={`/work-items/${event.workItemId}`}
                      >
                        {event.workItemTitle}
                      </Link>
                    ) : null}
                    {event.assetId && event.assetName ? (
                      <Link
                        className="block underline-offset-4 hover:underline"
                        href={`/assets/${event.assetId}`}
                      >
                        {event.assetCode} - {event.assetName}
                      </Link>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-4 align-top text-[#4d5848]">
                  {payloadSummary(event.payload) ?? "Sem resumo"}
                </td>
                <td className="px-4 py-4 align-top font-mono text-xs">
                  {formatDate(event.occurredAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
