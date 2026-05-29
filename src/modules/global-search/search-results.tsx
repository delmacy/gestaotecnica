import Link from "next/link";
import {
  getServiceOrderPriorityLabel,
  getServiceOrderStatusLabel,
} from "@/modules/service-orders/constants";
import {
  getWorkItemPriorityLabel,
  getWorkItemStatusLabel,
} from "@/modules/work-items/constants";
import { getAssetStatusLabel } from "@/modules/assets/constants";
import { getTechnicianLevelLabel } from "@/modules/workforce/constants";

type SearchResultsData = Awaited<
  ReturnType<typeof import("./queries").searchEverything>
>;

export function SearchResults({
  query,
  results,
}: {
  query: string;
  results: SearchResultsData;
}) {
  if (query.trim().length < 2) {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Digite pelo menos 2 caracteres
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          Busque por codigo, titulo, ativo, responsavel, solicitante ou especialidade.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Demandas</h2>
        <div className="mt-4 space-y-3">
          {results.workItems.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Sem demandas encontradas.</p>
          ) : (
            results.workItems.map((item) => (
              <Link
                className="block border border-[#e0e5d9] bg-[#fbfcf8] p-4 hover:bg-[#f1f3ed]"
                href={`/work-items/${item.id}`}
                key={item.id}
              >
                <p className="font-semibold text-[#182017]">{item.title}</p>
                <p className="mt-2 text-sm text-[#5b6655]">
                  {getWorkItemStatusLabel(item.status)} |{" "}
                  {getWorkItemPriorityLabel(item.priority)}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">execucao</h2>
        <div className="mt-4 space-y-3">
          {results.serviceOrders.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Sem execucao encontradas.</p>
          ) : (
            results.serviceOrders.map((order) => (
              <Link
                className="block border border-[#e0e5d9] bg-[#fbfcf8] p-4 hover:bg-[#f1f3ed]"
                href={`/service-orders/${order.id}`}
                key={order.id}
              >
                <p className="font-mono text-xs text-[#7a8474]">{order.code}</p>
                <p className="mt-1 font-semibold text-[#182017]">{order.title}</p>
                <p className="mt-2 text-sm text-[#5b6655]">
                  {getServiceOrderStatusLabel(order.status)} |{" "}
                  {getServiceOrderPriorityLabel(order.priority)}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Ativos</h2>
        <div className="mt-4 space-y-3">
          {results.assets.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Sem ativos encontrados.</p>
          ) : (
            results.assets.map((asset) => (
              <Link
                className="block border border-[#e0e5d9] bg-[#fbfcf8] p-4 hover:bg-[#f1f3ed]"
                href={`/assets/${asset.id}`}
                key={asset.id}
              >
                <p className="font-mono text-xs text-[#7a8474]">{asset.code}</p>
                <p className="mt-1 font-semibold text-[#182017]">{asset.name}</p>
                <p className="mt-2 text-sm text-[#5b6655]">
                  {asset.type} | {getAssetStatusLabel(asset.status)}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Responsavels</h2>
        <div className="mt-4 space-y-3">
          {results.technicians.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Sem responsavels encontrados.</p>
          ) : (
            results.technicians.map((technician) => (
              <div className="border border-[#e0e5d9] bg-[#fbfcf8] p-4" key={technician.id}>
                <p className="font-semibold text-[#182017]">{technician.name}</p>
                <p className="mt-1 text-sm text-[#5b6655]">{technician.email}</p>
                <p className="mt-2 text-sm text-[#5b6655]">
                  {getTechnicianLevelLabel(technician.level)} |{" "}
                  {technician.teamName ?? "Sem equipe"}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
