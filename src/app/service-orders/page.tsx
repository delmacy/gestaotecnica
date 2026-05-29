import Link from "next/link";
import {
  getServiceOrderSummary,
  getServiceOrders,
} from "@/modules/service-orders/queries";
import { ServiceOrdersTable } from "@/modules/service-orders/service-orders-table";

export const dynamic = "force-dynamic";

export default async function ServiceOrdersPage() {
  const [serviceOrders, summary] = await Promise.all([
    getServiceOrders(),
    getServiceOrderSummary(),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#65705f]">
                Modulo operacional
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-[#111510]">
                Ordens de Servico
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4d5848]">
                OS representa execucao autorizada de mao de obra tecnica,
                derivada preferencialmente de uma demanda.
              </p>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]"
              href="/"
            >
              Voltar ao painel
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {summary.map((item: any) => (
              <div
                className="border border-[#d7dccf] bg-white p-4 shadow-sm"
                key={item.label}
              >
                <p className="font-mono text-xs text-[#6e7a66]">{item.label}</p>
                <p className="mt-2 text-3xl font-semibold text-[#111510]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-[#111510]">
            OS registradas
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#5b6655]">
            Listagem das ultimas 50 ordens de servico criadas no sistema.
          </p>
        </div>
        <ServiceOrdersTable serviceOrders={serviceOrders} />
      </section>
    </main>
  );
}
