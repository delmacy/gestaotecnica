import Link from "next/link";
import { getStatusLabel, getCategoryLabel } from "./constants";

type AssetRow = {
  id: string;
  code: string;
  name: string;
  category: string;
  status: string;
  location: string | null;
  createdAt: Date;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function AssetsTable({ assets }: { assets: AssetRow[] }) {
  if (assets.length === 0) {
    return (
      <div className="border border-slate-200 bg-white p-8 text-center shadow-sm rounded-lg">
        <h2 className="text-lg font-semibold text-slate-900">
          Nenhum ativo encontrado
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Inicie o gerenciamento cadastrando seu primeiro ativo.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-slate-200 bg-white shadow-sm rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Ativo</th>
              <th className="px-6 py-3 font-semibold">Categoria</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Localização</th>
              <th className="px-6 py-3 font-semibold">Cadastro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <Link
                    className="font-semibold text-slate-900 hover:text-blue-600"
                    href={`/assets/${asset.id}`}
                  >
                    {asset.name}
                  </Link>
                  <p className="mt-1 font-mono text-xs text-slate-400">
                    {asset.code}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {getCategoryLabel(asset.category)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-700">
                    {getStatusLabel(asset.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {asset.location ?? "—"}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                  {formatDate(asset.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
