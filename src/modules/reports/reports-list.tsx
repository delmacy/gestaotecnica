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

export function ReportsList({ reports }: { reports: ReportRow[] }) {
  if (reports.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-5 text-sm text-[#5b6655] shadow-sm">
        Nenhum snapshot gerado.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
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
    </div>
  );
}
