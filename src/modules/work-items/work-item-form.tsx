import { createWorkItem } from "./actions";
import { workItemPriorities } from "./constants";
import type { WorkItemTypeValue } from "./constants";

type AssetOption = {
  id: string;
  code: string;
  name: string;
  status: string;
};

type WorkItemTypeOption = {
  value: WorkItemTypeValue;
  label: string;
};

export function WorkItemForm({
  assets,
  workItemTypes,
}: {
  assets: AssetOption[];
  workItemTypes: WorkItemTypeOption[];
}) {
  return (
    <form action={createWorkItem} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Nova demanda</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Registre a necessidade antes de decidir se ela vira OS.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Titulo</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            name="title"
            placeholder="Ex.: Verificar radio inoperante"
            required
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Tipo</span>
            <select
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              defaultValue="solicitacao"
              name="type"
            >
              {workItemTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Prioridade</span>
            <select
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              defaultValue="medium"
              name="priority"
            >
              {workItemPriorities.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Descricao</span>
          <textarea
            className="mt-1 min-h-28 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]"
            name="description"
            placeholder="Contexto, sintomas, local, impacto e observacoes iniciais."
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Ativo vinculado</span>
          <select
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            defaultValue=""
            name="assetId"
          >
            <option value="">Sem ativo vinculado</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.code} - {asset.name}
              </option>
            ))}
          </select>
          {assets.length === 0 ? (
            <span className="mt-1 block text-xs text-[#6e7a66]">
              Cadastre ativos para vincular demandas a equipamentos ou sistemas.
            </span>
          ) : null}
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Solicitante</span>
            <input
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              name="requesterName"
              placeholder="Nome ou setor"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Contato</span>
            <input
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              name="requesterContact"
              placeholder="Ramal, WhatsApp ou e-mail"
            />
          </label>
        </div>

        <button
          className="h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]"
          type="submit"
        >
          Criar demanda
        </button>
      </div>
    </form>
  );
}
