import { createShiftLogEntry } from "./actions";

type LinkOptions = {
  workItems: { id: string; label: string }[];
  serviceOrders: { id: string; code: string; title: string }[];
  assets: { id: string; code: string; name: string }[];
};

export function ShiftEntryForm({
  isClosed,
  options,
  shiftId,
}: {
  isClosed: boolean;
  options: LinkOptions;
  shiftId: string;
}) {
  return (
    <form
      action={createShiftLogEntry}
      className="border border-[#d7dccf] bg-white p-5 shadow-sm"
    >
      <input name="shiftId" type="hidden" value={shiftId} />

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Novo registro</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Registre ocorrencias, pendencias e informacoes de continuidade.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Titulo</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            disabled={isClosed}
            name="title"
            placeholder="Ex.: Pendencia de radio base"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Descricao</span>
          <textarea
            className="mt-1 min-h-24 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]"
            disabled={isClosed}
            name="description"
            placeholder="Contexto, decisao tomada, responsavel ou continuidade."
          />
        </label>

        <div className="grid gap-3">
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">execucao vinculada</span>
            <select
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              disabled={isClosed}
              name="serviceOrderId"
              defaultValue=""
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
            <span className="text-sm font-medium text-[#273025]">Demanda vinculada</span>
            <select
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              disabled={isClosed}
              name="workItemId"
              defaultValue=""
            >
              <option value="">Sem demanda</option>
              {options.workItems.map((workItem) => (
                <option key={workItem.id} value={workItem.id}>
                  {workItem.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Ativo vinculado</span>
            <select
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              disabled={isClosed}
              name="assetId"
              defaultValue=""
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

        <label className="flex items-center gap-2 text-sm font-medium text-[#273025]">
          <input
            className="h-4 w-4 border border-[#c8d0bf]"
            disabled={isClosed}
            name="isPending"
            type="checkbox"
          />
          Marcar como pendencia para o proximo turno
        </label>

        <button
          className="h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d] disabled:cursor-not-allowed disabled:bg-[#aab3a3]"
          disabled={isClosed}
          type="submit"
        >
          Registrar no turno
        </button>
      </div>
    </form>
  );
}
