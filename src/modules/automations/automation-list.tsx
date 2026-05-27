import { runAutomationRuleManually, updateAutomationRuleStatus } from "./actions";
import {
  automationStatuses,
  getAutomationRunStatusLabel,
  getAutomationStatusLabel,
} from "./constants";

type AutomationRule = Awaited<ReturnType<typeof import("./queries").getAutomationRules>>[number];
type AutomationRun = Awaited<ReturnType<typeof import("./queries").getAutomationRuns>>[number];
type AutomationRunLog = Awaited<ReturnType<typeof import("./queries").getRecentAutomationRunLogs>>[number];

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

function RunForm({ id, status }: { id: string; status: string }) {
  return (
    <form action={runAutomationRuleManually} className="flex gap-2">
      <input name="id" type="hidden" value={id} />
      <input className="h-10 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="note" placeholder="Nota" />
      <button
        className="h-10 bg-[#1f2a1c] px-4 text-sm font-semibold text-white disabled:opacity-50"
        disabled={status !== "active"}
        type="submit"
      >
        Executar
      </button>
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
            <div className="space-y-2">
              <StatusForm id={rule.id} current={rule.status} />
              <RunForm id={rule.id} status={rule.status} />
            </div>
          </div>
          {rule.description ? <p className="mt-3 text-sm leading-6 text-[#4d5848]">{rule.description}</p> : null}
          <p className="mt-3 text-sm text-[#5b6655]">Provedor: {rule.provider ?? "Nao informado"} | Agenda: {rule.scheduleExpression ?? "Nao definida"}</p>
          <p className="mt-1 text-sm text-[#5b6655]">Endpoint: {rule.endpointUrl ?? "Nao definido"} | Ultima execucao: {formatDate(rule.lastRunAt)}</p>
        </article>
      ))}
    </div>
  );
}

export function AutomationRunsList({ runs }: { runs: AutomationRun[] }) {
  if (runs.length === 0) {
    return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhuma execucao registrada.</div>;
  }

  return (
    <div className="space-y-3">
      {runs.map((run) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={run.id}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-semibold text-[#111510]">{run.automationRuleName}</h3>
              <p className="mt-1 text-sm text-[#5b6655]">
                {getAutomationRunStatusLabel(run.status)} | {run.triggerSource} | {run.triggerType}
              </p>
            </div>
            <p className="font-mono text-xs text-[#65705f]">{formatDate(run.startedAt)}</p>
          </div>
          <p className="mt-3 text-sm text-[#5b6655]">
            Provedor: {run.provider ?? "Nao informado"} | Duracao: {run.durationMs ? `${run.durationMs}ms` : "Nao finalizada"}
          </p>
          {run.errorMessage ? <p className="mt-2 text-sm text-red-700">{run.errorMessage}</p> : null}
        </article>
      ))}
    </div>
  );
}

export function AutomationRunLogsList({ logs }: { logs: AutomationRunLog[] }) {
  if (logs.length === 0) {
    return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhum log registrado.</div>;
  }

  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <article className="border border-[#e1e5db] bg-white p-4 text-sm shadow-sm" key={log.id}>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
            <p className="font-medium text-[#111510]">{log.message}</p>
            <p className="font-mono text-xs text-[#65705f]">{formatDate(log.occurredAt)}</p>
          </div>
          <p className="mt-1 text-[#5b6655]">{log.automationRuleName} | {log.level}</p>
        </article>
      ))}
    </div>
  );
}
