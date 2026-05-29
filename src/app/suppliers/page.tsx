import { SupplierContractForm, SupplierForm } from "@/modules/suppliers/supplier-forms";
import { SupplierContractsList, SuppliersList } from "@/modules/suppliers/suppliers-list";
import {
  getSupplierContracts,
  getSupplierOptions,
  getSupplierSummary,
  getSuppliers,
} from "@/modules/suppliers/queries";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  const [suppliers, contracts, summary, options] = await Promise.all([
    getSuppliers(),
    getSupplierContracts(),
    getSupplierSummary(),
    getSupplierOptions(),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-6 py-8 text-[#1c211b] lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header>
          <p className="font-mono text-xs uppercase text-[#65705f]">Governanca de suprimentos</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#111510]">Fornecedores e contratos</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5b6655]">Cadastro de fornecedores, contatos, categorias e contratos ligados a equipes tecnicas.</p>
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
          <SupplierForm />
          <SupplierContractForm options={options} />
        </section>
        <section className="grid gap-6 xl:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-[#111510]">Fornecedores</h2>
            <SuppliersList suppliers={suppliers} />
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold text-[#111510]">Contratos</h2>
            <SupplierContractsList contracts={contracts} />
          </div>
        </section>
      </div>
    </main>
  );
}
