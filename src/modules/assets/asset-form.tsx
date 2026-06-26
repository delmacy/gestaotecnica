import { ASSET_STATUSES, ASSET_CATEGORIES } from "./constants";
import { createAsset, updateAsset } from "./actions";

type AssetFormProps = {
  asset?: {
    id: string;
    code: string;
    name: string;
    category: string;
    status: string;
    location: string | null;
    responsibleId: string | null;
  };
  assetTypes?: { value: string; label: string }[];
};

export function AssetForm({ asset, assetTypes }: AssetFormProps) {
  const isEditing = !!asset;
  const categories = assetTypes ?? ASSET_CATEGORIES;

  return (
    <form action={isEditing ? updateAsset : createAsset} className="space-y-6">
      {isEditing && <input type="hidden" name="id" value={asset.id} />}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="code" className="text-sm font-medium text-slate-700">
            Código do Ativo *
          </label>
          <input
            type="text"
            id="code"
            name="code"
            required
            disabled={isEditing}
            defaultValue={asset?.code}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500"
            placeholder="Ex: EQ-001"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Nome do Ativo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={asset?.name}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Ex: Notebook Dell Latitude"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium text-slate-700">
            Categoria *
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={asset?.category}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={asset?.status ?? "available"}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            {ASSET_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="location" className="text-sm font-medium text-slate-700">
            Localização
          </label>
          <input
            type="text"
            id="location"
            name="location"
            defaultValue={asset?.location ?? ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Ex: Escritório Central - Sala 202"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none"
        >
          {isEditing ? "Salvar Alterações" : "Cadastrar Ativo"}
        </button>
      </div>
    </form>
  );
}
