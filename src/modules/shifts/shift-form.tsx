import { createShift } from "./actions";

export function ShiftForm() {
  return (
    <form action={createShift} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Novo turno</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Abra um livro para registrar ocorrencias, pendencias e passagem de servico.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Nome</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            name="name"
            placeholder="Ex.: Turno A - Manha"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Resumo inicial</span>
          <textarea
            className="mt-1 min-h-24 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]"
            name="summary"
            placeholder="Contexto operacional ao abrir o turno."
          />
        </label>

        <button
          className="h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]"
          type="submit"
        >
          Abrir turno
        </button>
      </div>
    </form>
  );
}
