import Link from "next/link";
import { updateDocumentStatus } from "./actions";
import { documentStatuses, getDocumentStatusLabel, getDocumentTypeLabel } from "./constants";

type DocumentRow = {
  id: string;
  title: string;
  documentType: string;
  status: string;
  content: string | null;
  createdAt: Date;
  serviceOrderId: string | null;
  serviceOrderCode: string | null;
  serviceOrderTitle: string | null;
  workItemId: string | null;
  workItemTitle: string | null;
  assetId: string | null;
  assetCode: string | null;
  assetName: string | null;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

export function DocumentsTable({ documents }: { documents: DocumentRow[] }) {
  if (documents.length === 0) {
    return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhum documento tecnico registrado.</div>;
  }

  return (
    <div className="space-y-3">
      {documents.map((document: any) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={document.id}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#111510]">{document.title}</h2>
              <p className="mt-1 font-mono text-xs text-[#7a8474]">{formatDate(document.createdAt)}</p>
              <p className="mt-2 text-sm text-[#5b6655]">{getDocumentTypeLabel(document.documentType)} | {getDocumentStatusLabel(document.status)}</p>
            </div>
            <form action={updateDocumentStatus} className="flex flex-col gap-2 sm:flex-row">
              <input name="id" type="hidden" value={document.id} />
              <select className="h-10 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="status" defaultValue={document.status}>
                {documentStatuses.map((status: any) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
              <input className="h-10 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="note" placeholder="Nota" />
              <button className="h-10 bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]" type="submit">Atualizar</button>
            </form>
          </div>
          {document.content ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#4d5848]">{document.content}</p> : null}
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="font-mono text-xs text-[#6e7a66]">OS</p>
              {document.serviceOrderId && document.serviceOrderCode ? (
                <Link className="mt-1 block underline-offset-4 hover:underline" href={`/service-orders/${document.serviceOrderId}`}>{document.serviceOrderCode} - {document.serviceOrderTitle}</Link>
              ) : <p className="mt-1 text-[#273025]">Nao vinculada</p>}
            </div>
            <div>
              <p className="font-mono text-xs text-[#6e7a66]">Demanda</p>
              {document.workItemId && document.workItemTitle ? (
                <Link className="mt-1 block underline-offset-4 hover:underline" href={`/work-items/${document.workItemId}`}>{document.workItemTitle}</Link>
              ) : <p className="mt-1 text-[#273025]">Nao vinculada</p>}
            </div>
            <div>
              <p className="font-mono text-xs text-[#6e7a66]">Ativo</p>
              {document.assetId && document.assetName ? (
                <Link className="mt-1 block underline-offset-4 hover:underline" href={`/assets/${document.assetId}`}>{document.assetCode} - {document.assetName}</Link>
              ) : <p className="mt-1 text-[#273025]">Nao vinculado</p>}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
