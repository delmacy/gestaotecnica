import { getDocumentById, getDocumentHistory } from "./queries";
import { getDocumentStatusLabel, getDocumentTypeLabel } from "./constants";

export async function DocumentDetail({ id }: { id: string }) {
  const [document, history] = await Promise.all([
    getDocumentById(id),
    getDocumentHistory(id),
  ]);

  if (!document) {
    return <div className="p-8 text-center text-[#5b6655]">Documento não encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="border border-[#d7dccf] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#111510]">{document.title}</h1>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="font-mono text-xs text-[#6e7a66]">Tipo</p>
            <p className="mt-1 font-semibold text-[#273025]">{getDocumentTypeLabel(document.documentType)}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-[#6e7a66]">Status</p>
            <p className="mt-1 font-semibold text-[#273025]">{getDocumentStatusLabel(document.status)}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-[#6e7a66]">Criado em</p>
            <p className="mt-1 text-[#273025]">{new Intl.DateTimeFormat("pt-BR").format(document.createdAt)}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-[#6e7a66]">Referência de Storage</p>
            <p className="mt-1 text-[#273025] font-medium text-amber-700">
              {document.currentVersionId ? document.currentVersionId : "Arquivo ainda não vinculado (CENTRAL_STORAGE_INTEGRATION gap)"}
            </p>
          </div>
        </div>
      </div>

      <div className="border border-[#d7dccf] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Histórico de Versões</h2>
        {history.length === 0 ? (
          <p className="mt-4 text-sm text-[#5b6655]">Nenhuma versão registrada (metadado isolado).</p>
        ) : (
          <ul className="mt-4 divide-y divide-[#ecefe9]">
            {history.map((version: any) => (
              <li key={version.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#273025]">Versão {version.versionNumber}</p>
                  <p className="text-xs text-[#7a8474]">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(version.createdAt)}</p>
                </div>
                <div className="text-xs font-mono text-[#6b7d5d] bg-[#f0f4ee] px-2 py-1">
                  {version.checksumSha256.substring(0, 8)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
