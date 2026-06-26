import { InventoryItemForm, InventoryMovementForm } from "@/modules/inventory/inventory-forms";
import { InventoryManager } from "@/modules/inventory/inventory-lists";
import {
  getInventoryItems,
  getInventoryMovements,
  getInventoryOptions,
  getInventorySummary,
} from "@/modules/inventory/queries";

export const dynamic = "force-dynamic";

export default async function InventoryPage(props: { searchParams: Promise<{ workspaceId?: string }> }) {
  const searchParams = await props.searchParams;
  const workspaceId = searchParams.workspaceId || "00000000-0000-0000-0000-000000000000";

  const [items, movements, summary, options] = await Promise.all([
    getInventoryItems(workspaceId),
    getInventoryMovements(workspaceId),
    getInventorySummary(workspaceId),
    getInventoryOptions(workspaceId),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-6 py-8 text-[#1c211b] lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex justify-between items-end">
          <div>
            <p className="font-mono text-xs uppercase text-[#65705f]">Materiais e ferramentas</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#111510]">Estoque tecnico</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5b6655]">Controle de itens, saldos, minimo operacional e movimentacoes conectadas a OS e aquisicoes.</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-mono text-[#6e7a66]">WORKSPACE ID</p>
             <p className="text-xs font-mono font-bold text-[#111510]">{workspaceId}</p>
          </div>
        </header>
        <section className="grid gap-3 sm:grid-cols-3">
          {summary.map((metric: any) => (
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm" key={metric.label}>
              <p className="font-mono text-xs text-[#6e7a66]">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold text-[#111510]">{metric.value}</p>
            </div>
          ))}
        </section>
        <section className="grid gap-5 xl:grid-cols-2">
          <InventoryItemForm options={options} workspaceId={workspaceId} />
          <InventoryMovementForm options={options} workspaceId={workspaceId} />
        </section>
        <section>
          <InventoryManager items={items} movements={movements} />
        </section>
      </div>
    </main>
  );
}
