import { suppliers } from "@/db/schema";
import { createSupplier, createSupplierContract } from "./actions";
import { contractStatuses, supplierStatuses } from "./constants";
import type { SupplierOptions } from "./queries";

export function SupplierForm() {
  return (
    <form action={createSupplier} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Novo fornecedor</h2>
      <div className="mt-4 space-y-4">
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="name" placeholder="Nome" required />
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="documentNumber" placeholder="Documento" />
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue="prospect">{supplierStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
        </div>
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="category" placeholder="Categoria" />
        <div className="grid gap-3 sm:grid-cols-3">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="contactName" placeholder="Contato" />
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="contactEmail" placeholder="Email" />
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="contactPhone" placeholder="Telefone" />
        </div>
        <textarea className="min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="notes" placeholder="Observacoes" />
        <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Criar fornecedor</button>
      </div>
    </form>
  );
}

export function SupplierContractForm({ options }: { options: SupplierOptions }) {
  return (
    <form action={createSupplierContract} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Novo contrato</h2>
      <div className="mt-4 space-y-4">
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="title" placeholder="Titulo" required />
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="supplierId" required defaultValue="">
          <option value="">Selecione o fornecedor</option>
          {options.suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
        </select>
        <div className="grid gap-3 sm:grid-cols-3">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="contractNumber" placeholder="Numero" />
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue="draft">{contractStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="value" type="number" min="0" placeholder="Valor" />
        </div>
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="ownerTeamId" defaultValue="">
          <option value="">Sem equipe dona</option>
          {options.teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
        </select>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="startsAt" type="date" />
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="endsAt" type="date" />
        </div>
        <textarea className="min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="scope" placeholder="Escopo" />
        <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Criar contrato</button>
      </div>
    </form>
  );
}
