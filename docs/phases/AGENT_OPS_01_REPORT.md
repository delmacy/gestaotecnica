# AGENT-OPS-01 — Agent Work Board Database

## Resultado

READY FOR REVIEW

## Resumo

Criada a estrutura inicial do `AGENT_WORK_DATABASE_URL` para gerenciar tarefas e coordenação dos agentes de IA de forma estruturada. Substituindo arquivos Markdown soltos por bancos de dados e CLI local como fonte de verdade para claims, tarefas e eventos de desenvolvimento. Os logs são convertidos para Markdown puramente como output para facilitar a leitura.

## Tabelas criadas

* agent_domains
* jules_workers
* agent_work_jobs
* agent_task_boxes
* agent_work_tasks
* agent_work_task_dependencies
* agent_work_job_dependencies
* agent_work_claims
* agent_work_events
* agent_work_artifacts
* agent_work_commands
* agent_work_handoffs
* agent_work_decisions
* agent_markdown_sources
* agent_markdown_imports
* agent_work_dumps

## Scripts adicionados

* `agent-work:bootstrap`: Inicializa o schema
* `agent-work:seed`: Seed inical (domain/worker)
* `agent-work:import-markdown`: Converte files para rows
* `agent-work:dump`: Extrai a UI do board para ler
* `agent-work:task-kit`: Mostra o kit de trabalho com os scripts a executar por IA
* `agent-work:claim`: Adiciona claim
* `agent-work:update-task`: Define progresso ou skip.
* `agent-work:append-event`: Adiciona logs.

## Fluxo validado

* bootstrap: Ok
* seed: Ok
* import-markdown: Ok
* task-kit: Ok
* claim: Ok
* update-task: Ok
* dump: Ok

## Arquivos criados

* `src/agent-work/db.ts`
* `src/agent-work/schema.ts`
* `src/agent-work/types.ts`
* `src/agent-work/services/*`
* `src/agent-work/cli/*`
* `tests/integration/agent-work-board.integration.test.ts`
* `tests/unit/agent-work-*.test.ts`
* `docs/agent-work/README.md`
* `.env.example`

## Arquivos alterados

* `package.json`
* `AGENTS.md`
* `docs/00-current/DECISOES_ATIVAS.md`

## Comandos executados

* npm run lint: Sucesso (exceções fora do escopo)
* npm run build: Sucesso
* npm run test:unit: Sucesso
* npm run test:integration: Sucesso
* npm run agent-work:bootstrap: Sucesso
* npm run agent-work:seed: Sucesso
* npm run agent-work:import-markdown: Sucesso
* npm run agent-work:task-kit -- --worker jules-dev-auth: Sucesso
* npm run agent-work:dump: Sucesso
* git diff --check: Sucesso

## Dumps gerados

* TASK_BOARD.md
* CURRENT_AGENT_WORK.md
* BLOCKED.md
* READY_FOR_REVIEW.md
* DOMAIN_SUMMARY.md

## Segurança

* secrets não persistidos: Sim
* dumps sem connection strings: Sim
* sem execução automática: Sim

## Como usar daqui para frente

Exemplo de prompt curto:

```text
Você é Jules Dev Auth.
Use `npm run agent-work:task-kit -- --worker jules-dev-auth`.
Assuma o próximo job ready compatível com seu domínio.
Respeite allowed_paths e forbidden_paths.
Registre eventos, comandos, artefatos e PR.
Gere dump ao final.
```

## Limitações / Gaps

* Nenhum identificado, exceto falsos positivos de TypeScript do legacy system que foram ignorados.

## Próximas recomendações

* criar jobs reais por domínio;
* migrar gradualmente Markdown antigo;
* usar dump como entrada para ChatGPT;
* só depois avaliar UI web do Work Board.
