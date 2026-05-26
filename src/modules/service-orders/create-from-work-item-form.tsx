import { createServiceOrderFromWorkItem } from "./actions";
import type { ServiceOrderTypeValue } from "./constants";

export function CreateServiceOrderFromWorkItemForm({
  workItemId,
  serviceOrderTypes,
}: {
  workItemId: string;
  serviceOrderTypes: Array<{
    value: ServiceOrderTypeValue;
    label: string;
  }>;
}) {
  return (
    <form
      action={createServiceOrderFromWorkItem}
      className="border border-[#d7dccf] bg-white p-5 shadow-sm"
    >
      <input name="workItemId" type="hidden" value={workItemId} />
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Criar OS</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Gere uma ordem de servico a partir desta demanda.
        </p>
      </div>

      <label className="mb-4 block">
        <span className="text-sm font-medium text-[#273025]">Tipo de OS</span>
        <select
          className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
          name="type"
          defaultValue="manutencao"
        >
          {serviceOrderTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-[#273025]">Objetivo da OS</span>
        <textarea
          className="mt-1 min-h-24 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]"
          name="objective"
          placeholder="Objetivo tecnico da execucao. Se vazio, usa a descricao da demanda."
        />
      </label>

      <button
        className="mt-4 h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]"
        type="submit"
      >
        Criar OS
      </button>
    </form>
  );
}
