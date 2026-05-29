import { createTeam } from "./actions";

export function TeamForm() {
  return (
    <form action={createTeam} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Nova equipe</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Agrupe tecnicos por turno, especialidade ou area operacional.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Nome</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            name="name"
            placeholder="Ex.: Equipe radio"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Descricao</span>
          <textarea
            className="mt-1 min-h-20 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]"
            name="description"
            placeholder="Cobertura, rotina ou responsabilidade principal."
          />
        </label>

        <button
          className="h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]"
          type="submit"
        >
          Criar equipe
        </button>
      </div>
    </form>
  );
}
