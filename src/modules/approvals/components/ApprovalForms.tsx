"use client";

import { useActionState, useEffect } from "react";
import { approveServiceOrder, returnServiceOrderForExecution } from "../actions";
import { useWorkStatus } from "@/components/builder/shared/hooks/useWorkStatus";

type FormState = {
  id?: string;
  status?: string;
  receipt?: {
    action: string;
    serviceOrderId: string;
    correlationId: string;
    recordedAt: string;
  };
  error?: string;
};

const initialState: FormState = {};

export function ApproveServiceOrderForm({ id }: { id: string }) {
  const [state, formAction, isPending] = useActionState(approveServiceOrder, initialState);
  const { resolveWorkStatus, isResolving } = useWorkStatus();

  useEffect(() => {
    if (state && typeof state === "object" && "id" in state && typeof state.id === "string") {
      resolveWorkStatus({ workId: String(state.id), moduleKey: "approvals" }).catch(console.error);
    }
  }, [state, resolveWorkStatus]);

  const isSubmitting = isPending || isResolving;

  return (
    <form action={formAction} className="space-y-3">
      {state?.error ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      ) : state?.receipt ? (
        <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          <p className="font-semibold">OS aprovada</p>
          <p className="mt-1 font-mono text-xs text-green-600">
            Protocolo: {state.receipt.correlationId.slice(0, 8)}...
          </p>
        </div>
      ) : null}
      {!state?.receipt && (
        <>
          <input name="id" type="hidden" value={id} />
          <input
            className="h-10 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d] disabled:opacity-50"
            name="note"
            placeholder="Nota de aprovacao"
            disabled={isSubmitting}
          />
          <button
            className="h-10 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d] disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Aprovando..." : "Aprovar OS"}
          </button>
        </>
      )}
    </form>
  );
}

export function ReturnServiceOrderForm({ id }: { id: string }) {
  const [state, formAction, isPending] = useActionState(returnServiceOrderForExecution, initialState);
  const { resolveWorkStatus, isResolving } = useWorkStatus();

  useEffect(() => {
    if (state && typeof state === "object" && "id" in state && typeof state.id === "string") {
      resolveWorkStatus({ workId: String(state.id), moduleKey: "approvals" }).catch(console.error);
    }
  }, [state, resolveWorkStatus]);

  const isSubmitting = isPending || isResolving;

  return (
    <form action={formAction} className="space-y-3">
      {state?.error ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
      ) : state?.receipt ? (
        <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <p className="font-semibold">OS retornada para execucao</p>
          <p className="mt-1 font-mono text-xs text-amber-600">
            Protocolo: {state.receipt.correlationId.slice(0, 8)}...
          </p>
        </div>
      ) : null}
      {!state?.receipt && (
        <>
          <input name="id" type="hidden" value={id} />
          <input
            className="h-10 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d] disabled:opacity-50"
            name="note"
            placeholder="Motivo do retorno"
            required
            disabled={isSubmitting}
          />
          <button
            className="h-10 w-full border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] transition hover:bg-[#f1f3ed] disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Retornando..." : "Retornar para execucao"}
          </button>
        </>
      )}
    </form>
  );
}
