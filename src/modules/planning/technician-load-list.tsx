import { getTechnicianLevelLabel } from "@/modules/workforce/constants";

type TechnicianLoadRow = {
  technicianProfileId: string;
  technicianName: string;
  technicianEmail: string;
  level: string;
  activeAssignments: number;
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

export function TechnicianLoadList({
  technicians,
}: {
  technicians: TechnicianLoadRow[];
}) {
  return (
    <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Carga tecnica</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {technicians.length === 0 ? (
          <p className="text-sm text-[#5b6655]">Sem tecnicos cadastrados.</p>
        ) : (
          technicians.map((technician: any) => (
            <article
              className="border border-[#e0e5d9] bg-[#fbfcf8] p-4"
              key={technician.technicianProfileId}
            >
              <h3 className="font-semibold text-[#182017]">
                {technician.technicianName}
              </h3>
              <p className="mt-1 text-sm text-[#5b6655]">
                {getTechnicianLevelLabel(technician.level)}
              </p>
              <p className="mt-3 font-mono text-xs text-[#7a8474]">
                {Number(technician.activeAssignments)} OS ativas
              </p>
              <p className="mt-1 font-mono text-xs text-[#7a8474]">
                {formatDuration(Number(technician.minutes))}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
