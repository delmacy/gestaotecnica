import Link from "next/link";
import { getShiftStatusLabel } from "./constants";

type ShiftRow = {
  id: string;
  name: string;
  status: string;
  startedAt: Date;
  endedAt: Date | null;
  summary: string | null;
};

function formatDate(date: Date | null) {
  if (!date) return "Nao informado";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function ShiftsTable({ shifts }: { shifts: ShiftRow[] }) {
  if (shifts.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Nenhum turno aberto
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          Abra o primeiro turno para registrar passagem de servico.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-[#d7dccf] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-[#f1f3ed] text-xs uppercase text-[#65705f]">
            <tr>
              <th className="px-4 py-3 font-semibold">Turno</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Inicio</th>
              <th className="px-4 py-3 font-semibold">Fim</th>
              <th className="px-4 py-3 font-semibold">Resumo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e5d9] text-sm">
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td className="px-4 py-4 align-top">
                  <Link
                    className="font-semibold text-[#182017] underline-offset-4 hover:underline"
                    href={`/shifts/${shift.id}`}
                  >
                    {shift.name}
                  </Link>
                </td>
                <td className="px-4 py-4 align-top">
                  {getShiftStatusLabel(shift.status)}
                </td>
                <td className="px-4 py-4 align-top font-mono text-xs">
                  {formatDate(shift.startedAt)}
                </td>
                <td className="px-4 py-4 align-top font-mono text-xs">
                  {formatDate(shift.endedAt)}
                </td>
                <td className="px-4 py-4 align-top text-[#4d5848]">
                  {shift.summary ?? "Sem resumo"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
