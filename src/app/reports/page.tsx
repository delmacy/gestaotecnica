import Link from "next/link";
import { RecentOrdersTable } from "@/modules/reports/recent-orders-table";
import { ReportForm } from "@/modules/reports/report-form";
import { ReportsList } from "@/modules/reports/reports-list";
import { ReportFilter } from "@/modules/reports/report-filter";
import {
  getOperationalReportData,
  getReports,
} from "@/modules/reports/queries";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    type?: string;
    page?: string;
    start?: string;
    end?: string;
  }>;
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page || "0");
  const limit = 20;
  const offset = page * limit;

  const [data, reports] = await Promise.all([
    getOperationalReportData(),
    getReports({
      type: params.type,
      startDate: params.start ? new Date(params.start) : undefined,
      endDate: params.end ? new Date(params.end) : undefined,
      limit: limit + 1,
      offset,
    }),
  ]);

  const hasMore = reports.length > limit;
  const reportsToDisplay = reports.slice(0, limit);

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#65705f]">
                Leitura gerencial
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-[#111510]">
                Relatorios
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4d5848]">
                Visao consolidada de demandas, OS, ativos, horas apontadas e
                pendencias de turno.
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
            {data.cards.map((item: any) => (
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

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="space-y-8">
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-[#111510]">
                Status das OS
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#5b6655]">
                Distribuicao atual por etapa operacional.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.serviceOrders.map((item: any) => (
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

          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-[#111510]">
                OS recentes
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#5b6655]">
                Ultimas ordens abertas no fluxo operacional.
              </p>
            </div>
            <RecentOrdersTable orders={data.recentOrders} />
          </div>
        </div>

        <aside className="space-y-6">
          <ReportForm />
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-[#111510]">
                Snapshots
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#5b6655]">
                Relatorios gerados e persistidos.
              </p>
            </div>
            <ReportFilter currentType={params.type} />
            <ReportsList
              reports={reportsToDisplay}
              currentPage={page}
              hasMore={hasMore}
              filters={{ type: params.type, start: params.start, end: params.end }}
            />
          </div>
        </aside>
      </section>
    </main>
  );
}
