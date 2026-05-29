import { getScheduleStatusLabel, getScheduleTypeLabel } from "./constants";

type ScheduleRow = {
  id: string;
  title: string;
  type: string;
  status: string;
  startsAt: Date;
  endsAt: Date;
  notes: string | null;
  technicianName: string | null;
  technicianEmail: string | null;
  teamName: string | null;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function SchedulesTable({ schedules }: { schedules: ScheduleRow[] }) {
  if (schedules.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Nenhuma escala registrada</h2>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-[#d7dccf] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead className="bg-[#f1f3ed] text-xs uppercase text-[#65705f]">
            <tr>
              <th className="px-4 py-3 font-semibold">Escala</th>
              <th className="px-4 py-3 font-semibold">Tipo</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Periodo</th>
              <th className="px-4 py-3 font-semibold">Responsavel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e5d9] text-sm">
            {schedules.map((schedule: any) => (
              <tr key={schedule.id}>
                <td className="px-4 py-4 align-top">
                  <p className="font-semibold text-[#182017]">{schedule.title}</p>
                  {schedule.notes ? <p className="mt-1 text-[#5b6655]">{schedule.notes}</p> : null}
                </td>
                <td className="px-4 py-4 align-top">{getScheduleTypeLabel(schedule.type)}</td>
                <td className="px-4 py-4 align-top">{getScheduleStatusLabel(schedule.status)}</td>
                <td className="px-4 py-4 align-top font-mono text-xs">
                  {formatDate(schedule.startsAt)}<br />{formatDate(schedule.endsAt)}
                </td>
                <td className="px-4 py-4 align-top">
                  {schedule.technicianName ?? schedule.teamName ?? "Nao definido"}
                  {schedule.technicianEmail ? <p className="mt-1 text-[#5b6655]">{schedule.technicianEmail}</p> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
