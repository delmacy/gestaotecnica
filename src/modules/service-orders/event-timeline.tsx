import { ServiceOrderEvent } from "./contracts/service-order-event-contract";

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
    typeof data.code === "string" ? data.code : null,
    typeof data.from === "string" && typeof data.to === "string"
      ? `${data.from} -> ${data.to}`
      : null,
    typeof data.note === "string" && data.note.length > 0 ? data.note : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" | ") : null;
}

function EvidenceAttachment({ payload }: { payload: unknown }) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const data = payload as Record<string, unknown>;
  const title = typeof data.title === "string" ? data.title : null;
  const mimeType = typeof data.mimeType === "string" ? data.mimeType : null;
  const fileUrl = typeof data.fileUrl === "string" ? data.fileUrl : null;

  if (!title && !fileUrl) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      {title ? (
        <span className="text-sm font-medium text-[#182017]">{title}</span>
      ) : null}
      {mimeType ? (
        <span className="border border-[#b9c6ac] px-2 py-0.5 font-mono text-xs text-[#506247]">
          {mimeType}
        </span>
      ) : null}
      {fileUrl ? (
        <a
          className="text-sm font-semibold text-[#273025] underline-offset-4 hover:underline"
          href={fileUrl}
          rel="noreferrer"
          target="_blank"
        >
          Abrir evidencia
        </a>
      ) : null}
    </div>
  );
}

export function ServiceOrderEventTimeline({
  events,
}: {
  events: ServiceOrderEvent[];
}) {
  if (events.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-5 text-sm text-[#5b6655] shadow-sm">
        Nenhum evento registrado para esta OS.
      </div>
    );
  }

  return (
    <div className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Historico</h2>
      <ol className="mt-5 space-y-4">
        {events.map((event: ServiceOrderEvent) => (
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
            <EvidenceAttachment payload={event.payload} />
          </li>
        ))}
      </ol>
    </div>
  );
}
