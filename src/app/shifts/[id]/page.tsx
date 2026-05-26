import Link from "next/link";
import { notFound } from "next/navigation";
import { CloseShiftForm } from "@/modules/shifts/close-shift-form";
import { getShiftStatusLabel } from "@/modules/shifts/constants";
import { ShiftEntriesList } from "@/modules/shifts/shift-entries-list";
import { ShiftEntryForm } from "@/modules/shifts/shift-entry-form";
import {
  getShiftById,
  getShiftEntries,
  getShiftLinkOptions,
} from "@/modules/shifts/queries";

export const dynamic = "force-dynamic";

type ShiftDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) return "Nao informado";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default async function ShiftDetailPage({ params }: ShiftDetailPageProps) {
  const { id } = await params;
  const [shift, entries, options] = await Promise.all([
    getShiftById(id),
    getShiftEntries(id),
    getShiftLinkOptions(),
  ]);

  if (!shift) {
    notFound();
  }

  const isClosed = shift.status === "closed";

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#65705f]">
                Livro de Turno
              </p>
              <h1 className="mt-2 max-w-4xl text-4xl font-semibold text-[#111510]">
                {shift.name}
              </h1>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]"
              href="/shifts"
            >
              Voltar para turnos
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Status</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {getShiftStatusLabel(shift.status)}
              </p>
            </div>
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Inicio</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {formatDate(shift.startedAt)}
              </p>
            </div>
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm">
              <p className="font-mono text-xs text-[#6e7a66]">Fim</p>
              <p className="mt-2 text-xl font-semibold text-[#111510]">
                {formatDate(shift.endedAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="space-y-6">
          <article className="border border-[#d7dccf] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#111510]">Resumo</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#4d5848]">
              {shift.summary ?? "Sem resumo informado."}
            </p>
          </article>

          <ShiftEntriesList entries={entries} />
        </div>

        <aside className="space-y-6">
          <ShiftEntryForm
            isClosed={isClosed}
            options={options}
            shiftId={shift.id}
          />
          <CloseShiftForm
            isClosed={isClosed}
            shiftId={shift.id}
            summary={shift.summary}
          />
        </aside>
      </section>
    </main>
  );
}
