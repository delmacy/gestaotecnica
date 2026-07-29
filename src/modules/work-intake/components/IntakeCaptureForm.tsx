"use client";

import { useActionState, useEffect } from "react";
import { captureIntakeAction } from "../actions";
import { useWorkStatus } from "@/components/builder/shared/hooks/useWorkStatus";

export function IntakeCaptureForm() {
  const [state, formAction, isPending] = useActionState(captureIntakeAction, { error: "" });
  const { resolveWorkStatus, isResolving } = useWorkStatus();

  useEffect(() => {
    if (state && typeof state === 'object' && 'id' in state && typeof state.id === 'string') {
      resolveWorkStatus({ workId: String(state.id), moduleKey: 'work-intake' }).catch(console.error);
    }
  }, [state, resolveWorkStatus]);

  const isSubmitting = isPending || isResolving;

  return (
    <form action={formAction} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Nova Entrada</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Capture uma nova solicitação ou observação para triagem.
        </p>
      </div>

      <div className="space-y-4">
        {state?.error && (
          <div className="rounded bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {state.error}
          </div>
        )}
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Título</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d] disabled:opacity-50"
            name="title"
            placeholder="Resumo da solicitação"
            required
            disabled={isSubmitting}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Categoria</span>
            <input
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d] disabled:opacity-50"
              name="category"
              placeholder="Ex: Infra, Software, Processo"
              required
              disabled={isSubmitting}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Prioridade</span>
            <select
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d] disabled:opacity-50"
              defaultValue="medium"
              name="priority"
              disabled={isSubmitting}
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Descrição</span>
          <textarea
            className="mt-1 min-h-24 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d] disabled:opacity-50"
            name="description"
            placeholder="Detalhes adicionais..."
            disabled={isSubmitting}
          />
        </label>

        <div className="border-t border-[#f0f2ed] pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#65705f]">
            Dados do Solicitante
          </p>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-[#273025]">Nome</span>
              <input
                className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d] disabled:opacity-50"
                name="requesterName"
                placeholder="Quem solicita?"
                required
                disabled={isSubmitting}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-[#273025]">Contato</span>
                <input
                  className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d] disabled:opacity-50"
                  name="requesterContact"
                  placeholder="Email ou telefone"
                  disabled={isSubmitting}
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-[#273025]">Departamento</span>
                <input
                  className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d] disabled:opacity-50"
                  name="requesterDepartment"
                  placeholder="Setor"
                  disabled={isSubmitting}
                />
              </label>
            </div>
          </div>
        </div>

        <button
          className="mt-2 h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d] disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Capturando..." : "Capturar Solicitação"}
        </button>
      </div>
    </form>
  );
}
