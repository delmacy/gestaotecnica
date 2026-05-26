import { createServiceOrderEvidence } from "./actions";

export function ServiceOrderEvidenceForm({
  serviceOrderId,
}: {
  serviceOrderId: string;
}) {
  return (
    <form
      action={createServiceOrderEvidence}
      className="border border-[#d7dccf] bg-white p-5 shadow-sm"
    >
      <input name="serviceOrderId" type="hidden" value={serviceOrderId} />

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Nova evidencia</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Registre comprovantes, fotos, documentos ou links tecnicos da execucao.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Titulo</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            name="title"
            placeholder="Ex.: Foto do reparo concluido"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">URL do arquivo</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            name="fileUrl"
            placeholder="https://..."
            type="url"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Tipo MIME</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            name="mimeType"
            placeholder="image/jpeg, application/pdf"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Descricao</span>
          <textarea
            className="mt-1 min-h-24 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]"
            name="description"
            placeholder="Contexto da evidencia, medicao, antes/depois ou observacao."
          />
        </label>

        <button
          className="h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]"
          type="submit"
        >
          Registrar evidencia
        </button>
      </div>
    </form>
  );
}
