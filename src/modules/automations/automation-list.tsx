import { updateAutomationRuleStatus } from "./actions";
import { automationStatuses, getAutomationStatusLabel } from "./constants";

type AutomationRule = Awaited<ReturnType<typeof import("./queries").getAutomationRules>>[number];

function formatDate(value: Date | null) {
  if (!value) return "Nunca executada";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(value);
}

function StatusForm({ id, current }: { id: string; current: string }) {
  return (
    <form action={updateAutomationRuleStatus} className="flex gap-2">
      <input name="id" type="hidden" value={id} />
      <select className="h-10 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue={current}>
        {automationStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
      </select>
      <button className="h-10 bg-[#1f2a1c] px-4 text-sm font-semibold text-white" type="submit">Atualizar</button>
    </form>
  );
}

export function AutomationRulesList({ rules }: { rules: AutomationRule[] }) {
  if (rules.length === 0) return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhuma automacao registrada.</div>;
  return (
    <div className="space-y-3">
      {rules.map((rule) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={rule.id}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#111510]">{rule.name}</h2>
              <p className="mt-1 text-sm text-[#5b6655]">{getAutomationStatusLabel(rule.status)} | {rule.triggerType}</p>
            </div>
            <StatusForm id={rule.id} current={rule.status} />
          </div>
          {rule.description ? <p className="mt-3 text-sm leading-6 text-[#4d5848]">{rule.description}</p> : null}
          <p className="mt-3 text-sm text-[#5b6655]">Provedor: {rule.provider ?? "Nao informado"} | Agenda: {rule.scheduleExpression ?? "Nao definida"}</p>
          <p className="mt-1 text-sm text-[#5b6655]">Endpoint: {rule.endpointUrl ?? "Nao definido"} | Ultima execucao: {formatDate(rule.lastRunAt)}</p>
        </article>
      ))}
    </div>
  );
}
