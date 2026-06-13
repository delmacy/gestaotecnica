# Agent Factory Hardening Preflight

| requirement | current_implementation | status | evidence | problem | repair_action | target_package |
|---|---|---|---|---|---|---|
| schema existente | Parcial | partial | src/agent-work/schema.ts existe | Faltam constraints e colunas completas | Atualizar schema | HARDEN-PKG-01 |
| tabelas existentes | Parcial | partial | tabelas básicas | faltam claims, receipts etc | Criar tabelas | HARDEN-PKG-01 |
| constraints ausentes | Sim | missing | Não há checks complexos no DB | Colisões podem ocorrer | Adicionar constraints | HARDEN-PKG-01 |
| serviços reais | Não | mock | index.ts com mocks | Funções mockadas | Implementar lógica real | HARDEN-PKG-02 a 05 |
| serviços parciais | Sim | partial | claimMock | Incompleto | Completar claims e readiness | HARDEN-PKG-02, 03 |
| CLI real | Não | mock | cli/index.ts | Mocks hardcoded | Implementar CLI com opções | HARDEN-PKG-05 |
| comandos mock | Sim | implemented | echo OK | test agent-work:db:check é mock | Remover mocks | HARDEN-PKG-05, 09 |
| seeds existentes | Não | missing | N/A | Faltam seeds reais | Adicionar seeds | HARDEN-PKG-06 |
| packages existentes | Sim | partial | WAVES, WAYS | Não são persistidos e avaliados adequadamente | Revisar work packages | HARDEN-PKG-06 |
| paths inválidos | Sim | partial | docs assumem paths incorretos | Paths divergem de src | Auditar paths reais | HARDEN-PKG-03, 06 |
| testes que realmente usam banco | Não | missing | testes unitários simples | Testes não conectam com test db | Criar test isolation | HARDEN-PKG-09 |
| testes que passam sem executar | Sim | implemented | echo OK | Falsa sensação de readiness | Trocar por checks reais | HARDEN-PKG-09 |
| dry-run real | Não | missing | script dry-run.ts | Apenas output texto | Implementar logic dry-run | HARDEN-PKG-10 |
| dry-run simulado | Sim | implemented | scripts/agent-work-dry-run.ts | Mocks apenas | Refatorar dry-run | HARDEN-PKG-10 |
| ReviewPackage ausente | Sim | missing | schema.ts não tem review package | Necessário para Scoped Review | Adicionar entidades de review | HARDEN-PKG-04 |
| operations docs ausentes | Sim | missing | Faltam guides para Documentator | Adicionar playbooks reais | HARDEN-PKG-07 |
| AGENTS.md não atualizado | Sim | missing | Não menciona role-based execution de factory | Atualizar AGENTS.md | HARDEN-PKG-05 |
