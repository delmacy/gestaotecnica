type ReportRow = {
  id: string;
  title: string;
  type: string;
  createdAt: Date;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

import Link from "next/link";

export function ReportsList({
  reports,
  currentPage = 0,
  hasMore = false,
  filters = {},
}: {
  reports: ReportRow[];
  currentPage?: number;
  hasMore?: boolean;
  filters?: Record<string, string | undefined>;
}) {
  if (reports.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-5 text-sm text-[#5b6655] shadow-sm">
        Nenhum snapshot encontrado.
      </div>
    );
  }

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (page > 0) params.set("page", page.toString());
    const query = params.toString();
    return query ? `?${query}` : "/reports";
  };

  return (
    <div className="space-y-3">
      {reports.map((report: any) => (
        <article className="border border-[#d7dccf] bg-white p-4 shadow-sm" key={report.id}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-semibold text-[#182017]">{report.title}</h3>
              <p className="mt-1 font-mono text-xs text-[#7a8474]">
                {formatDate(report.createdAt)}
              </p>
            </div>
            <span className="border border-[#b9c6ac] px-2 py-1 font-mono text-xs text-[#506247]">
              {report.type}
            </span>
          </div>
        </article>
      ))}

      {(currentPage > 0 || hasMore) && (
        <div className="mt-4 flex items-center justify-between">
          {currentPage > 0 ? (
            <Link
              href={buildHref(currentPage - 1)}
              className="text-xs font-semibold text-[#506247] hover:underline"
            >
              ← Anterior
            </Link>
          ) : (
            <div />
          )}

          {hasMore && (
            <Link
              href={buildHref(currentPage + 1)}
              className="text-xs font-semibold text-[#506247] hover:underline"
            >
              Proxima →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
