import { getTechnicianLevelLabel } from "./constants";

type TechnicianRow = {
  id: string;
  name: string;
  email: string;
  teamName: string | null;
  level: string;
  registrationCode: string | null;
  specialty: string | null;
  isAvailable: boolean;
  createdAt: Date;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function TechniciansTable({ technicians }: { technicians: TechnicianRow[] }) {
  if (technicians.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Nenhum tecnico cadastrado
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          Cadastre tecnicos para atribuir responsaveis as OS.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-[#d7dccf] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead className="bg-[#f1f3ed] text-xs uppercase text-[#65705f]">
            <tr>
              <th className="px-4 py-3 font-semibold">Tecnico</th>
              <th className="px-4 py-3 font-semibold">Nivel</th>
              <th className="px-4 py-3 font-semibold">Equipe</th>
              <th className="px-4 py-3 font-semibold">Especialidade</th>
              <th className="px-4 py-3 font-semibold">Disponibilidade</th>
              <th className="px-4 py-3 font-semibold">Criado em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e5d9] text-sm">
            {technicians.map((technician: any) => (
              <tr key={technician.id}>
                <td className="px-4 py-4 align-top">
                  <p className="font-semibold text-[#182017]">{technician.name}</p>
                  <p className="mt-1 text-[#5b6655]">{technician.email}</p>
                  {technician.registrationCode ? (
                    <p className="mt-2 font-mono text-xs text-[#7a8474]">
                      {technician.registrationCode}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-4 align-top">
                  {getTechnicianLevelLabel(technician.level)}
                </td>
                <td className="px-4 py-4 align-top">
                  {technician.teamName ?? "Sem equipe"}
                </td>
                <td className="px-4 py-4 align-top">
                  {technician.specialty ?? "Nao informada"}
                </td>
                <td className="px-4 py-4 align-top">
                  {technician.isAvailable ? "Disponivel" : "Indisponivel"}
                </td>
                <td className="px-4 py-4 align-top font-mono text-xs">
                  {formatDate(technician.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
