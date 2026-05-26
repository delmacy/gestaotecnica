type TimeEntryRow = {
  id: string;
  startedAt: Date;
  endedAt: Date | null;
  durationMinutes: number | null;
  notes: string | null;
  technicianName: string;
  technicianEmail: string;
  technicianRegistrationCode: string | null;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function formatDuration(minutes: number | null) {
  if (minutes === null) return "Em aberto";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours} h`;

  return `${hours} h ${remainingMinutes} min`;
}

export function ServiceOrderTimeEntriesList({
  timeEntries,
}: {
  timeEntries: TimeEntryRow[];
}) {
  return (
    <article className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#111510]">
          Tempo de execucao
        </h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Apontamentos realizados pelos tecnicos responsaveis.
        </p>
      </div>

      {timeEntries.length === 0 ? (
        <p className="text-sm leading-6 text-[#5b6655]">
          Nenhum tempo apontado nesta OS.
        </p>
      ) : (
        <div className="overflow-hidden border border-[#e0e5d9]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-[#f1f3ed] text-xs uppercase text-[#65705f]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tecnico</th>
                  <th className="px-4 py-3 font-semibold">Inicio</th>
                  <th className="px-4 py-3 font-semibold">Fim</th>
                  <th className="px-4 py-3 font-semibold">Duracao</th>
                  <th className="px-4 py-3 font-semibold">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e5d9]">
                {timeEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-[#182017]">
                        {entry.technicianName}
                      </p>
                      <p className="mt-1 text-[#5b6655]">{entry.technicianEmail}</p>
                      {entry.technicianRegistrationCode ? (
                        <p className="mt-2 font-mono text-xs text-[#7a8474]">
                          {entry.technicianRegistrationCode}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 align-top font-mono text-xs">
                      {formatDate(entry.startedAt)}
                    </td>
                    <td className="px-4 py-4 align-top font-mono text-xs">
                      {entry.endedAt ? formatDate(entry.endedAt) : "Em aberto"}
                    </td>
                    <td className="px-4 py-4 align-top">
                      {formatDuration(entry.durationMinutes)}
                    </td>
                    <td className="px-4 py-4 align-top text-[#4d5848]">
                      {entry.notes ?? "Sem notas"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </article>
  );
}
