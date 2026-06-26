import { createAsset } from "./actions";
import { assetCriticalities, assetStatuses } from "./constants";

type AssetTypeOption = {
  value: string;
  label: string;
};

export function AssetForm({ assetTypes }: { assetTypes: AssetTypeOption[] }) {
  return (
    <form action={createAsset} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Novo ativo</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Cadastre equipamentos, sistemas ou infraestrutura que podem receber demandas e OS.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Codigo</span>
            <input
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              name="code"
              placeholder="Ex.: RAD-001"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Tipo</span>
            <select
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              name="type"
              defaultValue="equipment"
              required
            >
              {assetTypes.map((type: any) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Nome</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            name="name"
            placeholder="Ex.: Radio base sala tecnica"
            required
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Status</span>
            <select
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              defaultValue="active"
              name="status"
            >
              {assetStatuses.map((status: any) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Criticidade</span>
            <select
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              defaultValue="medium"
              name="criticality"
            >
              {assetCriticalities.map((criticality: any) => (
                <option key={criticality.value} value={criticality.value}>
                  {criticality.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Localizacao</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            name="location"
            placeholder="Ex.: Sala tecnica, torre, rack, setor"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Descricao</span>
          <textarea
            className="mt-1 min-h-24 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]"
            name="description"
            placeholder="Observacoes, funcao do ativo, dependencia ou contexto operacional."
          />
        </label>

        <button
          className="h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]"
          type="submit"
        >
          Criar ativo
        </button>
      </div>
    </form>
  );
}
