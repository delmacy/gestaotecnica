"use client";

import { useActionState } from "react";
import { createServiceOrderEvidence } from "./actions";

export function ServiceOrderEvidenceForm({
  serviceOrderId,
}: {
  serviceOrderId: string;
}) {
  const [state, formAction, isPending] = useActionState(createServiceOrderEvidence, {
    error: "",
  });

  return (
    <form
      action={formAction}
      className="border border-[#d7dccf] bg-white p-5 shadow-sm"
    >
      <input name="serviceOrderId" type="hidden" value={serviceOrderId} />

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Nova evidencia</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Registre comprovantes, fotos, documentos ou links tecnicos da execucao.
        </p>
      </div>

      {state?.error ? (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Titulo</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d] disabled:opacity-50"
            disabled={isPending}
            name="title"
            placeholder="Ex.: Foto do reparo concluido"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">URL do arquivo</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d] disabled:opacity-50"
            disabled={isPending}
            name="fileUrl"
            placeholder="https://..."
            type="url"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Tipo MIME</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d] disabled:opacity-50"
            disabled={isPending}
            name="mimeType"
            placeholder="image/jpeg, application/pdf"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Descricao</span>
          <textarea
            className="mt-1 min-h-24 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d] disabled:opacity-50"
            disabled={isPending}
            name="description"
            placeholder="Contexto da evidencia, medicao, antes/depois ou observacao."
          />
        </label>

        <button
          className="h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d] disabled:cursor-not-allowed disabled:bg-[#aab3a3] disabled:opacity-50"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Registrando..." : "Registrar evidencia"}
        </button>
      </div>
    </form>
  );
}
