import { createOperationalReport } from "./actions";

export function ReportForm() {
  return (
    <form action={createOperationalReport} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Gerar snapshot</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Grave uma fotografia do estado operacional atual para acompanhamento.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-[#273025]">Titulo</span>
        <input
          className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
          name="title"
          placeholder="Resumo operacional semanal"
        />
      </label>

      <button
        className="mt-4 h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]"
        type="submit"
      >
        Gerar relatorio
      </button>
    </form>
  );
}
