import { AutomationRuleForm } from "@/modules/automations/automation-form";
import { AutomationRulesList } from "@/modules/automations/automation-list";
import { getAutomationRules, getAutomationSummary } from "@/modules/automations/queries";

export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
  const [rules, summary] = await Promise.all([
    getAutomationRules(),
    getAutomationSummary(),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-6 py-8 text-[#1c211b] lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 xl:grid-cols-[380px_1fr]">
        <aside className="space-y-5">
          <header>
            <p className="font-mono text-xs uppercase text-[#65705f]">Integracoes</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#111510]">Automacoes</h1>
            <p className="mt-2 text-sm leading-6 text-[#5b6655]">
              Registro governado de gatilhos, endpoints e rotinas antes da execucao automatica.
            </p>
          </header>
          <section className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {summary.map((metric) => (
              <div className="border border-[#d7dccf] bg-white p-4 shadow-sm" key={metric.label}>
                <p className="font-mono text-xs text-[#6e7a66]">{metric.label}</p>
                <p className="mt-2 text-3xl font-semibold text-[#111510]">{metric.value}</p>
              </div>
            ))}
          </section>
          <AutomationRuleForm />
        </aside>
        <section>
          <h2 className="mb-4 text-xl font-semibold text-[#111510]">Regras registradas</h2>
          <AutomationRulesList rules={rules} />
        </section>
      </div>
    </main>
  );
}
