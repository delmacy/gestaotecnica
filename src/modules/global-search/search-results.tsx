import Link from "next/link";
import type { GlobalSearchDTO } from "./contracts/search-dto";

export function SearchResults({
  query,
  searchResponse,
}: {
  query: string;
  searchResponse: GlobalSearchDTO;
}) {
  if (query.trim().length < 2) {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Digite pelo menos 2 caracteres
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          Busque por codigo, titulo, ativo, tecnico, solicitante ou especialidade.
        </p>
      </div>
    );
  }

  if (searchResponse.state === "empty") {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Nenhum resultado encontrado
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          {searchResponse.message ?? "Tente outros termos de busca."}
        </p>
      </div>
    );
  }

  if (searchResponse.state === "blocked") {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Busca indisponível
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          {searchResponse.message ?? "Serviço temporariamente indisponível."}
        </p>
      </div>
    );
  }

  if (searchResponse.state === "demo") {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Demonstração — Busca Global
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          {searchResponse.message ?? "Dados de demonstração."}
        </p>
      </div>
    );
  }

  if (searchResponse.state === "synthetic") {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Busca Global — {searchResponse.label}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          Dados sintéticos para validação.
        </p>
      </div>
    );
  }

  const { data } = searchResponse;
  const hasResults =
    data.workItems.length > 0 ||
    data.serviceOrders.length > 0 ||
    data.assets.length > 0 ||
    data.technicians.length > 0;

  if (!hasResults) {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">
          Nenhum resultado encontrado
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#5b6655]">
          Tente outros termos de busca.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Demandas</h2>
        <div className="mt-4 space-y-3">
          {data.workItems.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Sem demandas encontradas.</p>
          ) : (
            data.workItems.map((item) => (
              <Link
                className="block border border-[#e0e5d9] bg-[#fbfcf8] p-4 hover:bg-[#f1f3ed]"
                href={item.url}
                key={item.id}
              >
                <p className="font-semibold text-[#182017]">{item.title}</p>
                <p className="mt-2 text-sm text-[#5b6655]">
                  {item.subtitle}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">OS</h2>
        <div className="mt-4 space-y-3">
          {data.serviceOrders.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Sem OS encontradas.</p>
          ) : (
            data.serviceOrders.map((order) => (
              <Link
                className="block border border-[#e0e5d9] bg-[#fbfcf8] p-4 hover:bg-[#f1f3ed]"
                href={order.url}
                key={order.id}
              >
                <p className="font-semibold text-[#182017]">{order.title}</p>
                <p className="mt-2 text-sm text-[#5b6655]">
                  {order.subtitle}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Ativos</h2>
        <div className="mt-4 space-y-3">
          {data.assets.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Sem ativos encontrados.</p>
          ) : (
            data.assets.map((asset) => (
              <Link
                className="block border border-[#e0e5d9] bg-[#fbfcf8] p-4 hover:bg-[#f1f3ed]"
                href={asset.url}
                key={asset.id}
              >
                <p className="font-semibold text-[#182017]">{asset.title}</p>
                <p className="mt-2 text-sm text-[#5b6655]">
                  {asset.subtitle}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="border border-[#d7dccf] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111510]">Tecnicos</h2>
        <div className="mt-4 space-y-3">
          {data.technicians.length === 0 ? (
            <p className="text-sm text-[#5b6655]">Sem tecnicos encontrados.</p>
          ) : (
            data.technicians.map((technician) => (
              <div className="border border-[#e0e5d9] bg-[#fbfcf8] p-4" key={technician.id}>
                <p className="font-semibold text-[#182017]">{technician.title}</p>
                <p className="mt-2 text-sm text-[#5b6655]">
                  {technician.subtitle}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
