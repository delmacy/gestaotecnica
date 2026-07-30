"use client";

import { useActionState, useEffect } from "react";
import { submitServiceOrderForReview } from "@/modules/approvals/actions";
import { useWorkStatus } from "@/components/builder/shared/hooks/useWorkStatus";

export function ServiceOrderReviewRequestForm({
  currentStatus,
  serviceOrderId,
}: {
  currentStatus: string;
  serviceOrderId: string;
}) {
  const [state, formAction, isPending] = useActionState(submitServiceOrderForReview, { error: "" });
  const { resolveWorkStatus, isResolving } = useWorkStatus();
  const blocked = currentStatus === "approved" || currentStatus === "cancelled";

  useEffect(() => {
    if (state && typeof state === 'object' && 'id' in state && typeof state.id === 'string') {
      resolveWorkStatus({ workId: String(state.id), moduleKey: 'approvals' }).catch(console.error);
    }
  }, [state, resolveWorkStatus]);

  const isSubmitting = isPending || isResolving;

  return (
    <form
      action={formAction}
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

      {state?.error && (
        <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {state.error}
        </div>
      )}

      <label className="block">
        <span className="text-sm font-medium text-[#273025]">Nota</span>
        <textarea
          className="mt-1 min-h-20 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d] disabled:opacity-50"
          name="note"
          placeholder="Resumo do fechamento, criterios atendidos ou pendencias resolvidas."
          disabled={blocked || isSubmitting}
        />
      </label>

      <button
        className="mt-4 h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d] disabled:cursor-not-allowed disabled:bg-[#aab3a3] disabled:opacity-50"
        disabled={blocked || isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Enviando..." : "Enviar para revisao"}
      </button>
    </form>
  );
}
