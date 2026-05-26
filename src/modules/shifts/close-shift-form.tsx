import { closeShift } from "./actions";

export function CloseShiftForm({
  isClosed,
  shiftId,
  summary,
}: {
  isClosed: boolean;
  shiftId: string;
  summary: string | null;
}) {
  return (
    <form action={closeShift} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <input name="id" type="hidden" value={shiftId} />

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Fechar turno</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Consolide o resumo final antes da passagem de servico.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-[#273025]">Resumo final</span>
        <textarea
          className="mt-1 min-h-28 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]"
          defaultValue={summary ?? ""}
          disabled={isClosed}
          name="summary"
          required
        />
      </label>

      <button
        className="mt-4 h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d] disabled:cursor-not-allowed disabled:bg-[#aab3a3]"
        disabled={isClosed}
        type="submit"
      >
        Fechar turno
      </button>
    </form>
  );
}
