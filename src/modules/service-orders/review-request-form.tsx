import { submitServiceOrderForReview } from "@/modules/approvals/actions";

export function ServiceOrderReviewRequestForm({
  currentStatus,
  serviceOrderId,
}: {
  currentStatus: string;
  serviceOrderId: string;
}) {
  const blocked = currentStatus === "approved" || currentStatus === "cancelled";

  return (
    <form
      action={submitServiceOrderForReview}
      className="border border-[#d7dccf] bg-white p-5 shadow-sm"
    >
      <input name="id" type="hidden" value={serviceOrderId} />

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">
          Fechamento tecnico
        </h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Envie a OS para revisao apos registrar execucao e evidencias.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-[#273025]">Nota</span>
        <textarea
          className="mt-1 min-h-20 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]"
          name="note"
          placeholder="Resumo do fechamento, criterios atendidos ou pendencias resolvidas."
        />
      </label>

      <button
        className="mt-4 h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d] disabled:cursor-not-allowed disabled:bg-[#aab3a3]"
        disabled={blocked}
        type="submit"
      >
        Enviar para revisao
      </button>
    </form>
  );
}
