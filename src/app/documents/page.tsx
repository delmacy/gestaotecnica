import Link from "next/link";
import { DocumentForm } from "@/modules/documents/document-form";
import { DocumentsTable } from "@/modules/documents/documents-table";
import { getDocumentSummary, getTechnicalDocuments } from "@/modules/documents/queries";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const [documents, summary] = await Promise.all([
    getTechnicalDocuments(),
    getDocumentSummary(),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#65705f]">Fase 2</p>
              <h1 className="mt-2 text-4xl font-semibold text-[#111510]">Documentos Tecnicos</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4d5848]">Workflow documental para relatorios, despachos, revisoes e aprovacoes.</p>
            </div>
            <Link className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]" href="/">Voltar ao painel</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {summary.map((item: any) => (
              <div className="border border-[#d7dccf] bg-white p-4 shadow-sm" key={item.label}>
                <p className="font-mono text-xs text-[#6e7a66]">{item.label}</p>
                <p className="mt-2 text-3xl font-semibold text-[#111510]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-[#111510]">Fila documental</h2>
            <p className="mt-1 text-sm leading-6 text-[#5b6655]">Documentos em preparacao, revisao, aprovacao e exportacao.</p>
          </div>
          <DocumentsTable documents={documents} />
        </div>
        <aside>
          <DocumentForm />
        </aside>
      </section>
    </main>
  );
}
