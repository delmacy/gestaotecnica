import { updateSupplierStatus } from "./actions";
import {
  getContractStatusLabel,
  getSupplierStatusLabel,
  supplierStatuses,
} from "./constants";

type Supplier = Awaited<ReturnType<typeof import("./queries").getSuppliers>>[number];
type Contract = Awaited<ReturnType<typeof import("./queries").getSupplierContracts>>[number];

function formatMoney(cents: number | null) {
  if (!cents) return "Nao informado";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

function formatDate(value: Date | null) {
  if (!value) return "Nao definida";
  return new Intl.DateTimeFormat("pt-BR").format(value);
}

function SupplierStatusForm({ id, current }: { id: string; current: string }) {
  return (
    <form action={updateSupplierStatus} className="flex gap-2">
      <input name="id" type="hidden" value={id} />
      <select className="h-10 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue={current}>
        {supplierStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
      </select>
      <button className="h-10 bg-[#1f2a1c] px-4 text-sm font-semibold text-white" type="submit">Atualizar</button>
    </form>
  );
}

export function SuppliersList({ suppliers }: { suppliers: Supplier[] }) {
  if (suppliers.length === 0) return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhum fornecedor cadastrado.</div>;
  return (
    <div className="space-y-3">
      {suppliers.map((supplier: any) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={supplier.id}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#111510]">{supplier.name}</h2>
              <p className="mt-1 text-sm text-[#5b6655]">{getSupplierStatusLabel(supplier.status)} | {supplier.category ?? "Sem categoria"}</p>
            </div>
            <SupplierStatusForm id={supplier.id} current={supplier.status} />
          </div>
          <p className="mt-3 text-sm text-[#5b6655]">Documento: {supplier.documentNumber ?? "Nao informado"} | Contato: {supplier.contactName ?? "Nao informado"}</p>
          <p className="mt-1 text-sm text-[#5b6655]">Email: {supplier.contactEmail ?? "Nao informado"} | Telefone: {supplier.contactPhone ?? "Nao informado"}</p>
          {supplier.notes ? <p className="mt-2 text-sm leading-6 text-[#4d5848]">{supplier.notes}</p> : null}
        </article>
      ))}
    </div>
  );
}

export function SupplierContractsList({ contracts }: { contracts: Contract[] }) {
  if (contracts.length === 0) return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhum contrato registrado.</div>;
  return (
    <div className="space-y-3">
      {contracts.map((contract: any) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={contract.id}>
          <h2 className="text-lg font-semibold text-[#111510]">{contract.title}</h2>
          <p className="mt-1 text-sm text-[#5b6655]">{getContractStatusLabel(contract.status)} | {contract.supplierName} | {formatMoney(contract.valueCents)}</p>
          <p className="mt-3 text-sm text-[#5b6655]">Numero: {contract.contractNumber ?? "Nao informado"} | Equipe: {contract.teamName ?? "Nao definida"}</p>
          <p className="mt-1 text-sm text-[#5b6655]">Vigencia: {formatDate(contract.startsAt)} a {formatDate(contract.endsAt)}</p>
          {contract.scope ? <p className="mt-2 text-sm leading-6 text-[#4d5848]">{contract.scope}</p> : null}
        </article>
      ))}
    </div>
  );
}
