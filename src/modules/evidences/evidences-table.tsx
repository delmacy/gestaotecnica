import Link from "next/link";

type EvidenceRow = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string | null;
  mimeType: string | null;
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
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function EvidencesTable({ evidences }: { evidences: EvidenceRow[] }) {
  if (evidences.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Nenhuma evidencia registrada
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          Evidencias adicionadas em OS ou por esta biblioteca aparecem aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {evidences.map((evidence: any) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={evidence.id}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#111510]">
                {evidence.title}
              </h2>
              <p className="mt-1 font-mono text-xs text-[#7a8474]">
                {formatDate(evidence.createdAt)}
              </p>
            </div>
            {evidence.mimeType ? (
              <span className="border border-[#b9c6ac] px-2 py-1 font-mono text-xs text-[#506247]">
                {evidence.mimeType}
              </span>
            ) : null}
          </div>

          {evidence.description ? (
            <p className="mt-3 text-sm leading-6 text-[#4d5848]">
              {evidence.description}
            </p>
          ) : null}

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="font-mono text-xs text-[#6e7a66]">OS</p>
              {evidence.serviceOrderId && evidence.serviceOrderCode ? (
                <Link
                  className="mt-1 block underline-offset-4 hover:underline"
                  href={`/service-orders/${evidence.serviceOrderId}`}
                >
                  {evidence.serviceOrderCode} - {evidence.serviceOrderTitle}
                </Link>
              ) : (
                <p className="mt-1 text-[#273025]">Nao vinculada</p>
              )}
            </div>
            <div>
              <p className="font-mono text-xs text-[#6e7a66]">Demanda</p>
              {evidence.workItemId && evidence.workItemTitle ? (
                <Link
                  className="mt-1 block underline-offset-4 hover:underline"
                  href={`/work-items/${evidence.workItemId}`}
                >
                  {evidence.workItemTitle}
                </Link>
              ) : (
                <p className="mt-1 text-[#273025]">Nao vinculada</p>
              )}
            </div>
            <div>
              <p className="font-mono text-xs text-[#6e7a66]">Ativo</p>
              {evidence.assetId && evidence.assetName ? (
                <Link
                  className="mt-1 block underline-offset-4 hover:underline"
                  href={`/assets/${evidence.assetId}`}
                >
                  {evidence.assetCode} - {evidence.assetName}
                </Link>
              ) : (
                <p className="mt-1 text-[#273025]">Nao vinculado</p>
              )}
            </div>
          </div>

          {evidence.fileUrl ? (
            <Link
              className="mt-4 inline-flex text-sm font-semibold text-[#273025] underline-offset-4 hover:underline"
              href={evidence.fileUrl}
              target="_blank"
            >
              Abrir arquivo
            </Link>
          ) : null}
        </article>
      ))}
    </div>
  );
}
