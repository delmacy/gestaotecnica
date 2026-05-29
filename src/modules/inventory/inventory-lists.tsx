import { getInventoryStatusLabel, getMovementTypeLabel } from "./constants";

type Item = Awaited<ReturnType<typeof import("./queries").getInventoryItems>>[number];
type Movement = Awaited<ReturnType<typeof import("./queries").getInventoryMovements>>[number];

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(value);
}

export function InventoryItemsList({ items }: { items: Item[] }) {
  if (items.length === 0) return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhum item em estoque.</div>;
  return (
    <div className="space-y-3">
      {items.map((item: any) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={item.id}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#111510]">{item.sku} - {item.name}</h2>
              <p className="mt-1 text-sm text-[#5b6655]">{getInventoryStatusLabel(item.status)} | {item.category ?? "Sem categoria"}</p>
            </div>
            <span className="border border-[#b9c6ac] px-2 py-1 font-mono text-xs text-[#506247]">{item.quantityOnHand} {item.unit}</span>
          </div>
          <p className="mt-3 text-sm text-[#5b6655]">Minimo: {item.minimumQuantity} | Local: {item.location ?? "Nao informado"} | Fornecedor: {item.supplierName ?? "Nao vinculado"}</p>
          <p className="mt-1 text-sm text-[#5b6655]">Ativo: {item.assetName ? `${item.assetCode} - ${item.assetName}` : "Nao vinculado"}</p>
          {item.notes ? <p className="mt-2 text-sm leading-6 text-[#4d5848]">{item.notes}</p> : null}
        </article>
      ))}
    </div>
  );
}

export function InventoryMovementsList({ movements }: { movements: Movement[] }) {
  if (movements.length === 0) return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhuma movimentacao registrada.</div>;
  return (
    <div className="space-y-3">
      {movements.map((movement: any) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={movement.id}>
          <h2 className="text-lg font-semibold text-[#111510]">{getMovementTypeLabel(movement.movementType)} de {movement.quantity}</h2>
          <p className="mt-1 text-sm text-[#5b6655]">{movement.itemSku} - {movement.itemName} | {formatDate(movement.occurredAt)}</p>
          <p className="mt-3 text-sm text-[#5b6655]">OS: {movement.serviceOrderCode ?? "Nao vinculada"} | Aquisicao: {movement.acquisitionTitle ?? "Nao vinculada"} | Responsavel: {movement.performedByName ?? "Nao informado"}</p>
          {movement.notes ? <p className="mt-2 text-sm leading-6 text-[#4d5848]">{movement.notes}</p> : null}
        </article>
      ))}
    </div>
  );
}
