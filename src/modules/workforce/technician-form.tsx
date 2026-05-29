import { createTechnician } from "./actions";
import type { TechnicianLevelValue } from "./constants";

type TeamOption = {
  id: string;
  name: string;
};

type TechnicianLevelOption = {
  value: TechnicianLevelValue;
  label: string;
};

export function TechnicianForm({
  teams,
  technicianLevels,
}: {
  teams: TeamOption[];
  technicianLevels: TechnicianLevelOption[];
}) {
  return (
    <form action={createTechnician} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Novo tecnico</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Crie o usuario operacional e o perfil tecnico em uma unica etapa.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Nome</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            name="name"
            placeholder="Ex.: Ana Souza"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">E-mail</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            name="email"
            placeholder="ana.souza@empresa.com"
            required
            type="email"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Nivel</span>
            <select
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              defaultValue="pleno"
              name="level"
            >
              {technicianLevels.map((level: any) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Equipe</span>
            <select
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              name="teamId"
              defaultValue=""
            >
              <option value="">Sem equipe</option>
              {teams.map((team: any) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Matricula</span>
            <input
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              name="registrationCode"
              placeholder="Ex.: TEC-102"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Especialidade</span>
            <input
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              name="specialty"
              placeholder="Ex.: redes, radio, eletrica"
            />
          </label>
        </div>

        <button
          className="h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]"
          type="submit"
        >
          Criar tecnico
        </button>
      </div>
    </form>
  );
}
