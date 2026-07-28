"use client";

import { useActionState } from "react";
import { transitionIntakeAction } from "../actions";

export function IntakeTransitionForm({ requestId, currentStatus }: { requestId: string; currentStatus: string }) {
  const [state, formAction, isPending] = useActionState(transitionIntakeAction, { error: "" });

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {state.error}
        </div>
      )}
      <input type="hidden" name="id" value={requestId} />
      <label className="block">
        <span className="text-xs font-medium uppercase text-[#6e7a66]">Mudar Estado para</span>
        <select
          className="mt-1 h-10 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d] disabled:opacity-50"
          name="status"
          defaultValue={currentStatus}
          disabled={isPending}
        >
          <option value="new">Novo (new)</option>
          <option value="triage">Em Triagem (triage)</option>
          <option value="qualified">Qualificado (qualified)</option>
          <option value="converted">Convertido (converted)</option>
          <option value="closed">Encerrado (closed)</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-medium uppercase text-[#6e7a66]">Motivo/Nota</span>
        <textarea
          className="mt-1 min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm outline-none focus:border-[#6b7d5d] disabled:opacity-50"
          name="reason"
          placeholder="Opcional"
          disabled={isPending}
        />
      </label>
      <button
        className="h-10 w-full border border-[#1f2a1c] bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d] disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Processando..." : "Confirmar Transição"}
      </button>
    </form>
  );
}
