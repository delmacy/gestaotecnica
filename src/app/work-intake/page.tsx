import Link from "next/link";
import { IntakeForm } from "@/modules/work-intake/components/IntakeForm";
import { IntakeTable } from "@/modules/work-intake/components/IntakeTable";
import { getIntakeRequests } from "@/modules/work-intake/queries";

export const dynamic = "force-dynamic";

export default async function WorkIntakePage() {
  const requests = await getIntakeRequests();

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-[#65705f]">Módulo Genérico</p>
              <h1 className="mt-2 text-4xl font-semibold text-[#111510]">Work Intake</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4d5848]">
                Captura e triagem de solicitações antes da conversão em processos operacionais.
              </p>
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center border border-[#c8d0bf] bg-white px-4 text-sm font-semibold text-[#273025] shadow-sm transition hover:bg-[#f1f3ed]"
              href="/"
            >
              Voltar ao painel
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_420px] lg:px-8">
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-[#111510]">Solicitações Capturadas</h2>
            <p className="mt-1 text-sm leading-6 text-[#5b6655]">
              Listagem das solicitações aguardando triagem ou qualificação.
            </p>
          </div>
          <IntakeTable requests={requests} />
        </div>

        <aside>
          <IntakeForm />
        </aside>
      </section>
    </main>
  );
}
