import type { ApprovalRequest, ApprovalHistoryEvent } from "../contracts/approval.schema";
import { decideApproval } from "../actions";

function formatDate(date: Date | null | undefined) {
  if (!date) return "Nao informado";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function ApprovalDetail({
  approval,
  history,
}: {
  approval: ApprovalRequest;
  history: ApprovalHistoryEvent[];
}) {
  const isPending = approval.status === "pending";

  return (
    <div className="space-y-8">
      <div className="border border-[#d7dccf] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase text-[#65705f]">
              Solicitacao de aprovacao
            </p>
            <h2 className="text-2xl font-semibold text-[#111510]">
              {approval.subjectType}: {approval.subjectId}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={`border px-2 py-1 font-mono text-xs ${
                approval.status === 'approved' ? 'border-green-200 bg-green-50 text-green-700' :
                approval.status === 'rejected' ? 'border-red-200 bg-red-50 text-red-700' :
                'border-[#b9c6ac] text-[#506247]'
              }`}>
                STATUS: {approval.status.toUpperCase()}
              </span>
            </div>
          </div>

          {isPending && (
            <div className="flex flex-col gap-4 border-l border-[#f0f2ed] pl-6 lg:w-96">
               <h4 className="font-mono text-[10px] font-bold uppercase text-[#65705f]">
                 Tomar Decisao
               </h4>
               <form action={decideApproval} className="space-y-4">
                 <input name="id" type="hidden" value={approval.id} />

                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#4d5848]">Comentário / Justificativa</label>
                    <textarea
                      className="w-full border border-[#c8d0bf] bg-[#fbfcf8] p-3 text-sm outline-none focus:border-[#6b7d5d] min-h-[100px]"
                      name="comment"
                      placeholder="Obrigatório para rejeição"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-2">
                   <button
                     className="h-10 bg-[#1f2a1c] text-sm font-semibold text-white transition hover:bg-[#31402d]"
                     name="decision"
                     value="approved"
                     type="submit"
                   >
                     Aprovar
                   </button>
                   <button
                     className="h-10 border border-[#c8d0bf] bg-white text-sm font-semibold text-[#273025] transition hover:bg-[#f1f3ed]"
                     name="decision"
                     value="rejected"
                     type="submit"
                   >
                     Rejeitar
                   </button>
                 </div>
               </form>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-6 border-t border-[#f0f2ed] pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-mono text-xs text-[#6e7a66]">Solicitante</p>
            <p className="mt-1 font-medium text-[#111510]">{approval.requesterName}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-[#6e7a66]">Data da solicitacao</p>
            <p className="mt-1 text-[#273025]">{formatDate(approval.createdAt)}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-[#6e7a66]">Aprovador</p>
            <p className="mt-1 text-[#273025]">{approval.approverName || "Aguardando"}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-[#6e7a66]">Data da decisao</p>
            <p className="mt-1 text-[#273025]">{formatDate(approval.decidedAt)}</p>
          </div>
        </div>

        {approval.comment && (
          <div className="mt-8 border-t border-[#f0f2ed] pt-8">
            <p className="font-mono text-xs text-[#6e7a66]">Comentario/Justificativa da Decisao</p>
            <p className="mt-2 text-sm leading-6 text-[#4d5848]">{approval.comment}</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="font-mono text-xs uppercase text-[#65705f]">
          Historico de eventos
        </h3>
        <div className="space-y-3">
          {history.length === 0 ? (
             <div className="border border-[#d7dccf] bg-white p-6 text-center shadow-sm">
               <p className="text-sm text-[#6e7a66]">Nenhum evento registrado.</p>
             </div>
          ) : (
            history.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-2 border border-[#d7dccf] bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-[#182017]">
                    {event.eventType.toUpperCase()}
                  </span>
                  <span className="font-mono text-[10px] text-[#8a9684]">
                    {formatDate(event.occurredAt)}
                  </span>
                </div>
                <pre className="mt-2 overflow-auto bg-[#fbfcf8] p-3 text-[11px] text-[#4d5848] rounded">
                  {JSON.stringify(event.payload, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
