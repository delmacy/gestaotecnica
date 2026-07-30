import { WorkItemEvent } from "./contracts/work-item-event-contract";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function payloadText(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const data = payload as Record<string, unknown>;
  const parts = [
    typeof data.from === "string" && typeof data.to === "string"
      ? `${data.from} -> ${data.to}`
      : null,
    typeof data.note === "string" && data.note.length > 0 ? data.note : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" | ") : null;
}

export function WorkItemEventTimeline({ events }: { events: WorkItemEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-5 text-sm text-[#5b6655] shadow-sm">
        Nenhum evento registrado para esta demanda.
      </div>
    );
  }

  return (
    <div className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Historico</h2>
      <ol className="mt-5 space-y-4">
        {events.map((event: WorkItemEvent) => (
          <li className="border-l border-[#b9c6ac] pl-4" key={event.id}>
            <p className="font-mono text-xs text-[#6e7a66]">
              {formatDate(event.occurredAt)}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#182017]">
              {event.eventType}
            </p>
            {payloadText(event.payload) ? (
              <p className="mt-1 text-sm leading-6 text-[#5b6655]">
                {payloadText(event.payload)}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
