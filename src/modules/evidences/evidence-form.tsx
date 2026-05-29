import { createEvidence } from "./actions";

type EvidenceOptions = {
  serviceOrders: { id: string; code: string; title: string }[];
  workItems: { id: string; title: string }[];
  assets: { id: string; code: string; name: string }[];
};

export function EvidenceForm({ options }: { options: EvidenceOptions }) {
  return (
    <form action={createEvidence} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Nova evidencia</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Cadastre um comprovante ou documento e vincule ao contexto operacional.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Titulo</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            name="title"
            placeholder="Ex.: Evidencia fotografica"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">URL</span>
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
            placeholder="Contexto, medicao, observacao ou referencia externa."
          />
        </label>

        <div className="grid gap-3">
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">execucao</span>
            <select
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              defaultValue=""
              name="serviceOrderId"
            >
              <option value="">Sem execucao</option>
              {options.serviceOrders.map((serviceOrder) => (
                <option key={serviceOrder.id} value={serviceOrder.id}>
                  {serviceOrder.code} - {serviceOrder.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Demanda</span>
            <select
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              defaultValue=""
              name="workItemId"
            >
              <option value="">Sem demanda</option>
              {options.workItems.map((workItem) => (
                <option key={workItem.id} value={workItem.id}>
                  {workItem.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Ativo</span>
            <select
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              defaultValue=""
              name="assetId"
            >
              <option value="">Sem ativo</option>
              {options.assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.code} - {asset.name}
                </option>
              ))}
            </select>
          </label>
        </div>

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
