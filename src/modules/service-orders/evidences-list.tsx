import Link from "next/link";

type EvidenceRow = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string | null;
  mimeType: string | null;
  createdAt: Date;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function ServiceOrderEvidencesList({
  evidences,
}: {
  evidences: EvidenceRow[];
}) {
  return (
    <article className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#111510]">Evidencias</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Registros documentais vinculados a execucao da OS.
        </p>
      </div>

      {evidences.length === 0 ? (
        <p className="text-sm leading-6 text-[#5b6655]">
          Nenhuma evidencia registrada nesta OS.
        </p>
      ) : (
        <div className="space-y-3">
          {evidences.map((evidence: any) => (
            <div
              className="border border-[#e0e5d9] bg-[#fbfcf8] p-4"
              key={evidence.id}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-[#182017]">{evidence.title}</h3>
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

              {evidence.fileUrl ? (
                <Link
                  className="mt-3 inline-flex text-sm font-semibold text-[#273025] underline-offset-4 hover:underline"
                  href={evidence.fileUrl}
                  target="_blank"
                >
                  Abrir evidencia
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
