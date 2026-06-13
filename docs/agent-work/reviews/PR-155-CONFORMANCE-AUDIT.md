# PR 155 Conformance Audit

## 1. Requested Output
Executar a fase "AGENT-FACTORY-CONFORMANCE-REPAIR-001" (Agent Factory Parallel Work 001) para implementar a fundação completa para as "Execution Waves" e "Work Packages" que os agentes Jules irão utilizar.

## 2. Actual Output
A PR #155 modificou apenas dependências (package.json e package-lock.json) e acrescentou testes em mock que testam código contido nos próprios testes, sem implementar nenhum código produtivo de domínio, persistência, banco ou CLI.

## 3. Missing Output
- `src/agent-work/**`
- `docs/agent-work/**`
- `docs/modules/**`
- Configuração do Drizzle para persistência isolada de agente.
- JULES_BOOTSTRAP
- Work Packages
- Execution Waves
- Implementação de claims e leases.
- Heartbeat e colisão de concorrência.
- Task Kit real (CLI/serviço).
- Activity/Integration receipts.
- Documentador, Integrador e playbook de agentes.

## 4. Invalid Output
Os testes `tests/unit/agent-work-markdown-import.test.ts` e `tests/unit/agent-work-task-kit.test.ts` não testam módulos de src/, configurando "testes simulados". A biblioteca `drizzle-orm` e `zod` foram tratadas incorretamente no `package.json`.

## 5. Regression Risk
Sem a fundação, os agentes não terão "lock transacional" nos Work Packages, o que aumenta drasticamente a chance de colisões em execuções paralelas. A falta do "Task Kit" impede os Jules workers de inicializar corretamente suas tasks e respeitar ownership.

## 6. Repair Action
Executar sequencialmente do RECOVERY-PKG-00 ao RECOVERY-PKG-09 para construir todo o código e os testes que foram pulados. Começar corrigindo as dependências e eliminando os mocks, para então construir a persistência, o domínio e a CLI.
