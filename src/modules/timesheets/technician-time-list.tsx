type TechnicianTimeRow = {
  technicianProfileId: string;
  technicianName: string;
  technicianEmail: string;
  teamName: string | null;
  entries: number;
  minutes: number;
};

function formatDuration(minutesValue: number) {
  const minutes = Number(minutesValue ?? 0);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours} h`;

  return `${hours} h ${remainingMinutes} min`;
}

export function TechnicianTimeList({
  technicians,
}: {
  technicians: TechnicianTimeRow[];
}) {
  if (technicians.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-5 text-sm text-[#5b6655] shadow-sm">
        Sem horas consolidadas por tecnico.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {technicians.map((technician: any) => (
        <article
          className="border border-[#d7dccf] bg-white p-4 shadow-sm"
          key={technician.technicianProfileId}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-[#182017]">
                {technician.technicianName}
              </h3>
              <p className="mt-1 text-sm text-[#5b6655]">
                {technician.teamName ?? "Sem equipe"}
              </p>
              <p className="mt-1 text-sm text-[#5b6655]">
                {technician.technicianEmail}
              </p>
            </div>
            <span className="border border-[#b9c6ac] px-2 py-1 font-mono text-xs text-[#506247]">
              {formatDuration(Number(technician.minutes))}
            </span>
          </div>
          <p className="mt-3 text-sm text-[#5b6655]">
            {Number(technician.entries)} apontamentos registrados.
          </p>
        </article>
      ))}
    </div>
  );
}
