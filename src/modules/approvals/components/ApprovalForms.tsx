"use client";

import { useActionState, useEffect } from "react";
import { approveServiceOrder, returnServiceOrderForExecution } from "../actions";
import { useWorkStatus } from "@/components/builder/shared/hooks/useWorkStatus";

export function ApproveServiceOrderForm({ id }: { id: string }) {
  const [state, formAction, isPending] = useActionState(approveServiceOrder, { error: "" });
  const { resolveWorkStatus, isResolving } = useWorkStatus();

  useEffect(() => {
    if (state && typeof state === 'object' && 'id' in state && typeof state.id === 'string') {
      resolveWorkStatus({ workId: String(state.id), moduleKey: 'approvals' }).catch(console.error);
    }
  }, [state, resolveWorkStatus]);

  const isSubmitting = isPending || isResolving;

  return (
    <form action={formAction} className="space-y-3">
      {state?.error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {state.error}
        </div>
      )}
      <input name="id" type="hidden" value={id} />
      <input
        className="h-10 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d] disabled:opacity-50"
        name="note"
        placeholder="Nota de aprovacao"
        disabled={isSubmitting}
      />
      <button
        className="h-10 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d] disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Aprovando..." : "Aprovar OS"}
      </button>
    </form>
  );
}

export function ReturnServiceOrderForm({ id }: { id: string }) {
  const [state, formAction, isPending] = useActionState(returnServiceOrderForExecution, { error: "" });
  const { resolveWorkStatus, isResolving } = useWorkStatus();

  useEffect(() => {
    if (state && typeof state === 'object' && 'id' in state && typeof state.id === 'string') {
      resolveWorkStatus({ workId: String(state.id), moduleKey: 'approvals' }).catch(console.error);
    }
  }, [state, resolveWorkStatus]);

  const isSubmitting = isPending || isResolving;

  return (
    <form action={formAction} className="space-y-3">
      {state?.error && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {state.error}
        </div>
      )}
      <input name="id" type="hidden" value={id} />
      <input
        className="h-10 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d] disabled:opacity-50"
        name="note"
        placeholder="Motivo do retorno"
        required
        disabled={isSubmitting}
      />
      <button
        className="h-10 w-full border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] transition hover:bg-[#f1f3ed] disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Retornando..." : "Retornar para execucao"}
      </button>
    </form>
  );
}
