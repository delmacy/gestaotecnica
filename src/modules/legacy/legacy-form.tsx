import { createLegacyRecord } from "./actions";
import { legacySyncStatuses } from "./constants";
import { getLegacyLinkOptions } from "./queries";

export async function LegacyForm() {
  const options = await getLegacyLinkOptions();

  return (
    <form action={createLegacyRecord} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Novo protocolo</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Registre o vinculo manual com sistema oficial ou legado.
        </p>
      </div>
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Sistema</span>
          <input className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="systemName" placeholder="Ex.: Sistema oficial" required />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Protocolo</span>
            <input className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="protocolNumber" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">ID externo</span>
            <input className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="externalRecordId" />
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Status externo</span>
            <input className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="externalStatus" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Sincronizacao</span>
            <select className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="syncStatus" defaultValue="pending">
              {legacySyncStatuses.map((status: any) => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">OS</span>
          <select className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="serviceOrderId" defaultValue="">
            <option value="">Sem OS</option>
            {options.serviceOrders.map((order: any) => (
              <option key={order.id} value={order.id}>{order.code} - {order.title}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Documento</span>
          <select className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="documentId" defaultValue="">
            <option value="">Sem documento</option>
            {options.documents.map((document: any) => (
              <option key={document.id} value={document.id}>{document.title}</option>
            ))}
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Demanda</span>
            <select className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="workItemId" defaultValue="">
              <option value="">Sem demanda</option>
              {options.workItems.map((item: any) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Ativo</span>
            <select className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="assetId" defaultValue="">
              <option value="">Sem ativo</option>
              {options.assets.map((asset: any) => (
                <option key={asset.id} value={asset.id}>{asset.code} - {asset.name}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Notas</span>
          <textarea className="mt-1 min-h-24 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]" name="notes" />
        </label>
        <button className="h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]" type="submit">
          Registrar legado
        </button>
      </div>
    </form>
  );
}
