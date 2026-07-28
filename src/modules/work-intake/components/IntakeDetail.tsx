import { transitionIntakeAction } from "../actions";
import type { IntakeRequest, IntakeHistoryEvent } from "../contracts/intake.schema";

export function IntakeDetail({
  request,
  history
}: {
  request: IntakeRequest,
  history: IntakeHistoryEvent[]
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div className="border border-[#d7dccf] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-[#6e7a66]">{request.category}</span>
              <h2 className="text-2xl font-semibold text-[#111510]">{request.title}</h2>
            </div>
            <span className="rounded-full bg-[#1f2a1c] px-3 py-1 text-xs font-semibold text-white">
              {request.status}
            </span>
          </div>

          <div className="prose prose-sm max-w-none text-[#273025]">
            <p>{request.description || 'Sem descrição.'}</p>
          </div>

          <div className="mt-8 grid gap-4 border-t border-[#f0f2ed] pt-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-[#6e7a66]">Solicitante</p>
              <p className="mt-1 font-medium text-[#111510]">{request.requester.name}</p>
              <p className="text-sm text-[#4d5848]">{request.requester.contact || 'Sem contato'}</p>
              <p className="text-sm text-[#4d5848]">{request.requester.department || 'Sem setor'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-[#6e7a66]">Dados Técnicos</p>
              <p className="mt-1 text-sm text-[#111510]"><span className="font-medium">Prioridade:</span> {request.priority}</p>
              <p className="text-sm text-[#111510]"><span className="font-medium">Origem:</span> {request.source}</p>
              <p className="text-sm text-[#111510]"><span className="font-medium">Criado em:</span> {request.createdAt ? new Date(request.createdAt).toLocaleString('pt-BR') : '-'}</p>
            </div>
          </div>
        </div>

        <div className="border border-[#d7dccf] bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-[#111510]">Histórico de Eventos</h3>
          <div className="flow-root">
            <ul className="-mb-8 space-y-6">
              {history.map((event, idx) => (
                <li key={event.id} className="relative pb-8">
                  {idx !== history.length - 1 && (
                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-[#f0f2ed]" aria-hidden="true" />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fbfcf8] border border-[#d7dccf]">
                        <div className="h-2 w-2 rounded-full bg-[#31402d]" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-[#273025]">
                          <span className="font-bold">{event.eventType}</span>
                        </p>
                        {!!(event.payload as Record<string, unknown>)?.reason && (
                          <p className="mt-1 text-xs text-[#6e7a66]">Motivo: {String((event.payload as Record<string, unknown>).reason)}</p>
                        )}
                      </div>
                      <div className="whitespace-nowrap text-right text-xs text-[#6e7a66]">
                        {new Date(event.occurredAt).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {history.length === 0 && <p className="text-sm text-[#6e7a66]">Nenhum evento registrado.</p>}
            </ul>
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="border border-[#d7dccf] bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-[#111510]">Ações de Transição</h3>
          <form action={transitionIntakeAction} className="space-y-4">
            <input type="hidden" name="id" value={request.id} />
            <label className="block">
              <span className="text-xs font-medium uppercase text-[#6e7a66]">Mudar Estado para</span>
              <select
                className="mt-1 h-10 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
                name="status"
                defaultValue={request.status}
              >
                <option value="new">Novo (new)</option>
                <option value="triage">Em Triagem (triage)</option>
                <option value="qualified">Qualificado (qualified)</option>
                <option value="converted">Convertido (converted)</option>
                <option value="closed">Encerrado (closed)</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium uppercase text-[#6e7a66]">Motivo/Nota</span>
              <textarea
                className="mt-1 min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm outline-none focus:border-[#6b7d5d]"
                name="reason"
                placeholder="Opcional"
              />
            </label>
            <button
              className="h-10 w-full border border-[#1f2a1c] bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]"
              type="submit"
            >
              Confirmar Transição
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}
