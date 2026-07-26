import Link from "next/link";
import { notFound } from "next/navigation";
import { getIntakeRequestById, getIntakeHistory } from "@/modules/work-intake/queries";
import { resolveWorkspaceContext } from "@/platform/workspace";
import { resolveOriginContext } from "@/platform/builder/contracts/origin-context/resolve-origin-context";
import { IntakeDetail } from "@/modules/work-intake/components/IntakeDetail";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ origin?: string }>;
}

export default async function IntakeDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const searchParamsAwaited = await searchParams;
  const originPath = searchParamsAwaited.origin ?? null;
  const currentPath = `/work-intake/${id}`;
  const context = await resolveWorkspaceContext({ source: "ui" });
  const originContext = resolveOriginContext({ workspaceContext: context, currentPath, originPath });
  const [request, history] = await Promise.all([
    getIntakeRequestById(id),
    getIntakeHistory(id),
  ]);

  if (!request) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#1c211b]">
      <section className="border-b border-[#d7dccf] bg-[#fbfcf8]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href={originContext.returnPath ?? "/builder"}
              className="text-sm font-bold uppercase tracking-wider text-[#65705f] hover:text-[#111510]"
            >
              ← {originContext.returnLabel}
            </Link>
          </div>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs uppercase text-[#65705f]">Detalhes da Solicitação</p>
                {originContext.isDemo && (
                  <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                    DEMO MODE
                  </span>
                )}
                {originContext.isSynthetic && (
                  <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20">
                    SYNTHETIC MODE
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-4xl font-semibold text-[#111510]">{request.title}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
        <IntakeDetail request={request as any} history={history} />
      </section>
    </main>
  );
}
