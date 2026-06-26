import { createTechnicalDocument } from "./actions";
import { getDocumentTypeOptions } from "./queries";

export async function DocumentForm() {
  const documentTypes = await getDocumentTypeOptions();

  return (
    <form action={createTechnicalDocument} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Novo documento (Novo Schema)</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Prepare relatorios, despachos e resumos para revisao ou legado usando a persistencia runtime.
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
            {documentTypes.map((type: any) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Conteudo</span>
          <textarea className="mt-1 min-h-32 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]" name="content" />
        </label>

        {/* GAP: Vínculos com OS/Ativo/Demanda omitidos até suporte a isolamento nas tabelas de origem */}

        <button className="h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]" type="submit">
          Criar documento
        </button>
      </div>
    </form>
  );
}
