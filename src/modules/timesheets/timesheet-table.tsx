import Link from "next/link";
import { getServiceOrderStatusLabel } from "@/modules/service-orders/constants";
import { getTechnicianLevelLabel } from "@/modules/workforce/constants";

type TimesheetEntry = {
  id: string;
  startedAt: Date;
  endedAt: Date | null;
  durationMinutes: number | null;
  notes: string | null;
  serviceOrderId: string;
  serviceOrderCode: string;
  serviceOrderTitle: string;
  serviceOrderStatus: string;
  technicianName: string;
  technicianEmail: string;
  technicianRegistrationCode: string | null;
  technicianLevel: string;
  teamName: string | null;
};

function formatDate(date: Date | null) {
  if (!date) return "Em aberto";

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

export function TimesheetTable({ entries }: { entries: TimesheetEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Nenhum apontamento registrado
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          Os tempos lancados nas OS aparecem aqui automaticamente.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-[#d7dccf] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead className="bg-[#f1f3ed] text-xs uppercase text-[#65705f]">
            <tr>
              <th className="px-4 py-3 font-semibold">Tecnico</th>
              <th className="px-4 py-3 font-semibold">OS</th>
              <th className="px-4 py-3 font-semibold">Inicio</th>
              <th className="px-4 py-3 font-semibold">Fim</th>
              <th className="px-4 py-3 font-semibold">Duracao</th>
              <th className="px-4 py-3 font-semibold">Notas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e5d9] text-sm">
            {entries.map((entry: any) => (
              <tr key={entry.id}>
                <td className="px-4 py-4 align-top">
                  <p className="font-semibold text-[#182017]">{entry.technicianName}</p>
                  <p className="mt-1 text-[#5b6655]">{entry.technicianEmail}</p>
                  <p className="mt-1 text-[#5b6655]">
                    {getTechnicianLevelLabel(entry.technicianLevel)} |{" "}
                    {entry.teamName ?? "Sem equipe"}
                  </p>
                  {entry.technicianRegistrationCode ? (
                    <p className="mt-2 font-mono text-xs text-[#7a8474]">
                      {entry.technicianRegistrationCode}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-4 align-top">
                  <Link
                    className="font-semibold text-[#182017] underline-offset-4 hover:underline"
                    href={`/service-orders/${entry.serviceOrderId}`}
                  >
                    {entry.serviceOrderCode}
                  </Link>
                  <p className="mt-1 text-[#273025]">{entry.serviceOrderTitle}</p>
                  <p className="mt-1 text-[#5b6655]">
                    {getServiceOrderStatusLabel(entry.serviceOrderStatus)}
                  </p>
                </td>
                <td className="px-4 py-4 align-top font-mono text-xs">
                  {formatDate(entry.startedAt)}
                </td>
                <td className="px-4 py-4 align-top font-mono text-xs">
                  {formatDate(entry.endedAt)}
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
  );
}
