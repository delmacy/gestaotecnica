import { getEvidenceLinkOptions } from "@/modules/evidences/queries";
import { createTechnicalDocument } from "./actions";
import { getDocumentTypeOptions } from "./queries";

export async function DocumentForm() {
  const [options, documentTypes] = await Promise.all([
    getEvidenceLinkOptions(),
    getDocumentTypeOptions(),
  ]);

  return (
    <form action={createTechnicalDocument} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Novo documento</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Prepare relatorios, despachos e resumos para revisao ou legado.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Titulo</span>
          <input className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="title" required />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Tipo</span>
          <select className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="documentType" defaultValue="technical_report">
            {documentTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Conteudo</span>
          <textarea className="mt-1 min-h-32 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]" name="content" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">OS</span>
          <select className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="serviceOrderId" defaultValue="">
            <option value="">Sem OS</option>
            {options.serviceOrders.map((order) => (
              <option key={order.id} value={order.id}>{order.code} - {order.title}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Demanda</span>
          <select className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="workItemId" defaultValue="">
            <option value="">Sem demanda</option>
            {options.workItems.map((item) => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Ativo</span>
          <select className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="assetId" defaultValue="">
            <option value="">Sem ativo</option>
            {options.assets.map((asset) => (
              <option key={asset.id} value={asset.id}>{asset.code} - {asset.name}</option>
            ))}
          </select>
        </label>
        <button className="h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]" type="submit">
          Criar documento
        </button>
      </div>
    </form>
  );
}
