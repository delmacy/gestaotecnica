"use client";

import { useState } from "react";
import { getInventoryStatusLabel, getMovementTypeLabel } from "./constants";

type Item = Awaited<ReturnType<typeof import("./queries").getInventoryItems>>[number];
type Movement = Awaited<ReturnType<typeof import("./queries").getInventoryMovements>>[number];

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(value);
}

export function InventoryManager({ items, movements }: { items: Item[]; movements: Movement[] }) {
  const [filter, setFilter] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase()) ||
    item.sku.toLowerCase().includes(filter.toLowerCase())
  );

  const displayedMovements = selectedItemId
    ? movements.filter(m => items.find(i => i.id === selectedItemId)?.sku === m.itemSku)
    : movements;

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#111510]">Itens</h2>
          <input
            className="h-9 border border-[#c8d0bf] bg-white px-3 text-xs"
            placeholder="Filtrar itens..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="space-y-3">
          {filteredItems.length === 0 && <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm text-sm">Nenhum item encontrado.</div>}
          {filteredItems.map((item) => (
            <article
              className={`cursor-pointer border p-5 shadow-sm transition-colors ${selectedItemId === item.id ? "border-[#4d5848] bg-[#f0f2ed]" : "border-[#d7dccf] bg-white hover:bg-[#fbfcf8]"}`}
              key={item.id}
              onClick={() => setSelectedItemId(selectedItemId === item.id ? null : item.id)}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#111510]">{item.sku} - {item.name}</h2>
                  <p className="mt-1 text-sm text-[#5b6655]">{getInventoryStatusLabel(item.status)} | {item.category ?? "Sem categoria"}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="border border-[#b9c6ac] px-2 py-1 font-mono text-xs text-[#506247]">{item.quantityOnHand} {item.unit}</span>
                  {item.lot && <span className="text-[10px] font-mono text-[#6e7a66]">Lote: {item.lot}</span>}
                </div>
              </div>
              <p className="mt-3 text-sm text-[#5b6655]">Minimo: {item.minimumQuantity} | Local: {item.location ?? "Nao informado"}</p>
              {selectedItemId === item.id && (
                <div className="mt-4 border-t border-[#d7dccf] pt-4 text-xs text-[#4d5848]">
                   <p><strong>Fornecedor:</strong> {item.supplierName ?? "Nao vinculado"}</p>
                   <p className="mt-1"><strong>Ativo:</strong> {item.assetName ? `${item.assetCode} - ${item.assetName}` : "Nao vinculado"}</p>
                   {item.notes && <p className="mt-2 italic">"{item.notes}"</p>}
                   <p className="mt-3 font-semibold text-[#1f2a1c]">Clique para ver todas as movimentacoes</p>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#111510]">
            {selectedItemId ? `Historico: ${items.find(i => i.id === selectedItemId)?.sku}` : "Movimentacoes"}
          </h2>
          {selectedItemId && (
            <button
              className="text-xs text-[#5b6655] underline hover:text-[#111510]"
              onClick={() => setSelectedItemId(null)}
            >
              Ver todas
            </button>
          )}
        </div>
        <div className="space-y-3">
          {displayedMovements.length === 0 && <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm text-sm">Nenhuma movimentacao registrada.</div>}
          {displayedMovements.map((movement) => (
            <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={movement.id}>
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-[#111510]">{getMovementTypeLabel(movement.movementType)} de {movement.quantity}</h2>
                <span className="text-xs text-[#6e7a66]">{formatDate(movement.occurredAt)}</span>
              </div>
              <p className="mt-1 text-sm text-[#5b6655]">{movement.itemSku} - {movement.itemName}</p>
              {movement.reason && <p className="mt-2 text-sm font-medium text-[#3a4435]">Motivo: {movement.reason}</p>}
              <p className="mt-3 text-sm text-[#5b6655]">OS: {movement.serviceOrderCode ?? "Nao vinculada"} | Responsavel: {movement.performedByName ?? "Nao informado"}</p>
              {movement.notes ? <p className="mt-2 text-sm leading-6 text-[#4d5848] italic">"{movement.notes}"</p> : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InventoryItemsList({ items }: { items: Item[] }) {
   return <div className="text-sm text-red-500">Use InventoryManager component instead.</div>
}

export function InventoryMovementsList({ movements }: { movements: Movement[] }) {
   return <div className="text-sm text-red-500">Use InventoryManager component instead.</div>
}
