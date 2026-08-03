import { getQueueItemReceipts } from "./queries";
import { getQueueAuditEventLabel } from "./audit-labels";

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export async function QueueActivityReceipt() {
  const receipt = await getQueueItemReceipts();

  if (receipt.state === "blocked") {
    return (
      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Comprovante de atividade
        </h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          {receipt.message ?? "Serviço temporariamente indisponível."}
        </p>
      </section>
    );
  }

  if (receipt.state === "empty") {
    return (
      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#111510]">
            Comprovante de atividade
          </h2>
          <p className="text-xs text-[#5b6655]">{receipt.workspaceName}</p>
        </div>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Registro imutavel das acoes executadas na fila deste workspace.
        </p>
        <div className="mt-4 border border-[#e0e5d9] bg-[#fbfcf8] p-4">
          <p className="text-sm text-[#5b6655]">
            Nenhuma atividade registrada neste workspace ainda.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#111510]">
          Comprovante de atividade
        </h2>
        <p className="text-xs text-[#5b6655]">{receipt.workspaceName}</p>
      </div>
      <p className="mt-1 text-sm leading-6 text-[#5b6655]">
        Registro imutavel das acoes executadas na fila deste workspace.
      </p>

      <ul className="mt-4 space-y-3">
        {receipt.events.map((event) => (
          <li
            className="border border-[#e0e5d9] bg-[#fbfcf8] p-3"
            key={event.id}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#182017]">
                {getQueueAuditEventLabel(event.eventType)}
              </p>
              <p className="text-xs text-[#5b6655]">
                {dateTimeFormatter.format(event.occurredAt)}
              </p>
            </div>
            <p className="mt-1 text-xs text-[#5b6655]">
              {event.actorName ?? "Operador"} | {event.entityType}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
