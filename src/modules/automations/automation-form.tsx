import { createAutomationRule } from "./actions";
import { automationStatuses } from "./constants";

export function AutomationRuleForm() {
  return (
    <form action={createAutomationRule} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Nova automacao</h2>
      <div className="mt-4 space-y-4">
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="name" placeholder="Nome" required />
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="triggerType" placeholder="Tipo de gatilho" required />
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue="draft">
            {automationStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="provider" placeholder="Provedor" />
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="scheduleExpression" placeholder="Agenda ou regra" />
        </div>
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="endpointUrl" placeholder="Endpoint" />
        <textarea className="min-h-24 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="description" placeholder="Descricao" />
        <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Registrar automacao</button>
      </div>
    </form>
  );
}
