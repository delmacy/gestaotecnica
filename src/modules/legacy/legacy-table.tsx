import Link from "next/link";
import { updateLegacySyncStatus } from "./actions";
import { getLegacySyncStatusLabel, legacySyncStatuses } from "./constants";

type LegacyRecord = {
  id: string;
  systemName: string;
  protocolNumber: string | null;
  externalRecordId: string | null;
  externalStatus: string | null;
  syncStatus: string;
  exportedAt: Date | null;
  notes: string | null;
  createdAt: Date;
  serviceOrderId: string | null;
  serviceOrderCode: string | null;
  serviceOrderTitle: string | null;
  documentId: string | null;
  documentTitle: string | null;
};

function formatDate(date: Date | null) {
  if (!date) return "Nao informado";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

export function LegacyTable({ records }: { records: LegacyRecord[] }) {
  if (records.length === 0) {
    return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhum protocolo legado registrado.</div>;
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={record.id}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#111510]">{record.systemName}</h2>
              <p className="mt-1 text-sm text-[#5b6655]">
                {getLegacySyncStatusLabel(record.syncStatus)} | protocolo {record.protocolNumber ?? "nao informado"}
              </p>
              <p className="mt-1 font-mono text-xs text-[#7a8474]">{formatDate(record.createdAt)}</p>
            </div>
            <form action={updateLegacySyncStatus} className="flex flex-col gap-2 sm:flex-row">
              <input name="id" type="hidden" value={record.id} />
              <select className="h-10 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="syncStatus" defaultValue={record.syncStatus}>
                {legacySyncStatuses.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
              <input className="h-10 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="note" placeholder="Nota" />
              <button className="h-10 bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]" type="submit">Atualizar</button>
            </form>
          </div>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="font-mono text-xs text-[#6e7a66]">execucao</p>
              {record.serviceOrderId && record.serviceOrderCode ? (
                <Link className="mt-1 block underline-offset-4 hover:underline" href={`/service-orders/${record.serviceOrderId}`}>{record.serviceOrderCode} - {record.serviceOrderTitle}</Link>
              ) : <p className="mt-1 text-[#273025]">Nao vinculada</p>}
            </div>
            <div>
              <p className="font-mono text-xs text-[#6e7a66]">Documento</p>
              <p className="mt-1 text-[#273025]">{record.documentTitle ?? "Nao vinculado"}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#6e7a66]">Exportado em</p>
              <p className="mt-1 text-[#273025]">{formatDate(record.exportedAt)}</p>
            </div>
          </div>
          {record.notes ? <p className="mt-3 text-sm leading-6 text-[#4d5848]">{record.notes}</p> : null}
          {record.externalRecordId || record.externalStatus ? (
            <p className="mt-3 text-sm text-[#5b6655]">
              ID externo: {record.externalRecordId ?? "nao informado"} | Status externo: {record.externalStatus ?? "nao informado"}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
