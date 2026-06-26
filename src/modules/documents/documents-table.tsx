import Link from "next/link";
import { updateDocumentStatus } from "./actions";
import { documentStatuses, getDocumentStatusLabel, getDocumentTypeLabel } from "./constants";

type DocumentRow = {
  id: string;
  title: string;
  documentType: string;
  status: string;
  createdAt: Date;
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
              <Link href={`/documents/${document.id}`} className="text-lg font-semibold text-[#111510] hover:underline">
                {document.title}
              </Link>
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
        </article>
      ))}
    </div>
  );
}
