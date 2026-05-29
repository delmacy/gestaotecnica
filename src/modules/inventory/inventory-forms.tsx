import { createInventoryItem, createInventoryMovement } from "./actions";
import { inventoryItemStatuses, inventoryMovementTypes } from "./constants";

type Options = Awaited<ReturnType<typeof import("./queries").getInventoryOptions>>;

export function InventoryItemForm({ options }: { options: Options }) {
  return (
    <form action={createInventoryItem} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Novo item</h2>
      <div className="mt-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="sku" placeholder="SKU" required />
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="name" placeholder="Nome" required />
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="category" placeholder="Categoria" />
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue="available">{inventoryItemStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="quantityOnHand" type="number" defaultValue="0" />
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="minimumQuantity" type="number" defaultValue="0" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="unit" placeholder="Unidade" defaultValue="un" />
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="location" placeholder="Localizacao" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="supplierId" defaultValue=""><option value="">Sem fornecedor</option>{options.suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="assetId" defaultValue=""><option value="">Sem ativo</option>{options.assets.map((a) => <option key={a.id} value={a.id}>{a.code} - {a.name}</option>)}</select>
        </div>
        <textarea className="min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="notes" placeholder="Observacoes" />
        <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Criar item</button>
      </div>
    </form>
  );
}

export function InventoryMovementForm({ options }: { options: Options }) {
  return (
    <form action={createInventoryMovement} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Nova movimentacao</h2>
      <div className="mt-4 space-y-4">
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="itemId" required defaultValue=""><option value="">Selecione o item</option>{options.items.map((i) => <option key={i.id} value={i.id}>{i.sku} - {i.name}</option>)}</select>
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="movementType" defaultValue="adjustment">{inventoryMovementTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select>
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="quantity" type="number" min="1" placeholder="Quantidade" required />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="serviceOrderId" defaultValue=""><option value="">Sem OS</option>{options.serviceOrders.map((o) => <option key={o.id} value={o.id}>{o.code} - {o.title}</option>)}</select>
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="acquisitionNeedId" defaultValue=""><option value="">Sem aquisicao</option>{options.acquisitions.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}</select>
        </div>
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="performedById" defaultValue=""><option value="">Responsavel nao definido</option>{options.users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select>
        <textarea className="min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="notes" placeholder="Observacoes" />
        <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Registrar movimentacao</button>
      </div>
    </form>
  );
}
