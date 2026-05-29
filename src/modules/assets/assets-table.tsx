import Link from "next/link";
import {
  getAssetCriticalityLabel,
  getAssetStatusLabel,
  getAssetTypeLabel,
} from "./constants";

type AssetRow = {
  id: string;
  code: string;
  name: string;
  type: string;
  status: string;
  criticality: string;
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
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Nenhum ativo cadastrado
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          Cadastre o primeiro ativo para vincular demandas e futuras OS.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-[#d7dccf] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-[#f1f3ed] text-xs uppercase text-[#65705f]">
            <tr>
              <th className="px-4 py-3 font-semibold">Ativo</th>
              <th className="px-4 py-3 font-semibold">Tipo</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Criticidade</th>
              <th className="px-4 py-3 font-semibold">Localizacao</th>
              <th className="px-4 py-3 font-semibold">Criado em</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0e5d9] text-sm">
            {assets.map((asset: any) => (
              <tr key={asset.id}>
                <td className="px-4 py-4 align-top">
                  <Link
                    className="font-semibold text-[#182017] underline-offset-4 hover:underline"
                    href={`/assets/${asset.id}`}
                  >
                    {asset.name}
                  </Link>
                  <p className="mt-2 font-mono text-xs text-[#7a8474]">
                    {asset.code}
                  </p>
                </td>
                <td className="px-4 py-4 align-top">
                  {getAssetTypeLabel(asset.type)}
                </td>
                <td className="px-4 py-4 align-top">
                  {getAssetStatusLabel(asset.status)}
                </td>
                <td className="px-4 py-4 align-top">
                  {getAssetCriticalityLabel(asset.criticality)}
                </td>
                <td className="px-4 py-4 align-top">
                  {asset.location ?? "Nao informada"}
                </td>
                <td className="px-4 py-4 align-top font-mono text-xs">
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
