import { getStatusLabel, getCategoryLabel } from "./constants";
import { HistoryTimeline } from "./history-timeline";
import { updateAssetStatus } from "./actions";
import { ASSET_STATUSES } from "./constants";

type AssetDetailProps = {
  asset: {
    id: string;
    code: string;
    name: string;
    category: string;
    status: string;
    location: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  history: any[];
};

export function AssetDetail({ asset, history }: AssetDetailProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-lg">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-base font-semibold text-slate-900">Informações Básicas</h3>
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {getCategoryLabel(asset.category)}
              </span>
            </div>
            <div className="px-6 py-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-slate-500">Código</dt>
                <dd className="mt-1 text-sm font-mono text-slate-900">{asset.code}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Nome</dt>
                <dd className="mt-1 text-sm text-slate-900">{asset.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Localização</dt>
                <dd className="mt-1 text-sm text-slate-900">{asset.location ?? "Não informada"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Cadastrado em</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(asset.createdAt)}
                </dd>
              </div>
            </div>
          </div>

          <div className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-lg">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">Histórico de Atividades</h3>
            </div>
            <div className="px-6 py-6">
              <HistoryTimeline history={history} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-lg">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">Status Atual</h3>
            </div>
            <div className="px-6 py-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xl font-bold text-slate-900">{getStatusLabel(asset.status)}</span>
              </div>

              <form action={updateAssetStatus} className="space-y-4">
                <input type="hidden" name="id" value={asset.id} />
                <div className="space-y-2">
                  <label htmlFor="status" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Alterar Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={asset.status}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    {ASSET_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="note" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Observação
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    rows={3}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Motivo da alteração..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                >
                  Atualizar Status
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
