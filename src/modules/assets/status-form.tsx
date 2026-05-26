import { updateAssetStatus } from "./actions";
import { assetStatuses } from "./constants";

export function AssetStatusForm({
  assetId,
  currentStatus,
}: {
  assetId: string;
  currentStatus: string;
}) {
  return (
    <form action={updateAssetStatus} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <input name="id" type="hidden" value={assetId} />

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Estado do ativo</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Atualize o status operacional e registre a mudanca no historico.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Status</span>
          <select
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            defaultValue={currentStatus}
            name="status"
          >
            {assetStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Nota</span>
          <textarea
            className="mt-1 min-h-24 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]"
            name="note"
            placeholder="Motivo da alteracao, impacto ou orientacao para o turno."
          />
        </label>

        <button
          className="h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]"
          type="submit"
        >
          Registrar status
        </button>
      </div>
    </form>
  );
}
