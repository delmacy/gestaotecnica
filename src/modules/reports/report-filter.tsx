"use server";

import Link from "next/link";
import { getReportTypeOptions } from "./queries";

export async function ReportFilter({
  currentType,
}: {
  currentType?: string;
}) {
  const reportTypes = await getReportTypeOptions();

  return (
    <form method="GET" className="mb-6 flex flex-wrap items-end gap-4 border border-[#d7dccf] bg-white p-4 shadow-sm">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-semibold uppercase text-[#65705f] mb-1">
          Filtrar por Modelo
        </label>
        <select
          name="type"
          defaultValue={currentType}
          className="h-10 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
        >
          <option value="">Todos os modelos</option>
          {reportTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="h-10 border border-[#c8d0bf] bg-[#f1f3ed] px-6 text-sm font-semibold text-[#273025] hover:bg-[#e0e5d9] transition"
      >
        Filtrar
      </button>

      {currentType && (
        <Link
          href="/reports"
          className="h-10 inline-flex items-center text-xs font-semibold text-[#7a8474] hover:text-[#1c211b] underline"
        >
          Limpar filtros
        </Link>
      )}
    </form>
  );
}
