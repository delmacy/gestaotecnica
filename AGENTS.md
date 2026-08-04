# AGENTS.md — System Builder Platform

Diretrizes mestras para IAs e desenvolvedores atuando neste repositório.

## 1. Bootstrap obrigatório

Antes de planejar ou alterar qualquer arquivo, leia nesta ordem:

1. `docs/README.md`
2. `docs/current/STATUS.md`
3. `docs/current/ROADMAP.md`
4. `docs/phases/<FASE>/README.md`
5. `docs/phases/<FASE>/TASKS.md`
6. `docs/phases/<FASE>/PROGRESS.md`
7. `docs/agents/OPERATING_MODEL.md`
8. decisões e contratos técnicos citados pela task

`docs/archive/**` é histórico. Ele só deve ser lido quando a task apontar um documento específico e nunca é fonte de status atual.

## 2. Princípios de decisão

- **Follow the Process:** a realidade operacional precede a abstração técnica.
- **The Principle is the Process:** o valor está na fidelidade do espelhamento.
- **Understand. Mirror. Evolve:** compreenda antes de modelar; modele antes de automatizar.
- **PostgreSQL is the Source of Truth:** cache, cookie, localStorage, n8n, Paperclip e agentes não substituem o estado governado da plataforma.
- **Human approval for publication:** agentes podem observar e propor Process Candidates, mas não publicam processos autonomamente.

## 3. Arquitetura de separação

- `src/platform/`: capacidades universais e agnósticas ao negócio.
- `src/modules/`: módulos reutilizáveis.
- `src/adaptations/`: configuração por cliente, setor ou operação.
- `system-building/`: tenants, pilotos e ferramentas externas ao core quando aplicável.
- PostgreSQL unificado por schemas lógicos; não mover tabelas para contornar contratos.

O módulo universal não conhece o cliente. A adaptação instala e configura o módulo para o cliente.

## 4. Regras de código e dados

- Use schemas PostgreSQL explícitos conforme a estratégia vigente.
- `workspace_id` é obrigatório em tabelas e operações tenant-scoped.
- Actor, workspace, roles, ownership e permissions são resolvidos no servidor; nunca são confiados a input público.
- Eventos e trilhas de auditoria são append-only/imutáveis conforme contrato.
- JSONB serve a payloads flexíveis e snapshots, não à fuga de modelagem.
- Migrations são rastreáveis, reproduzíveis e possuem estratégia de recuperação.
- Dados synthetic/demo devem ser rotulados e nunca apresentados como prova real.

## 5. Paridade frontend obrigatória

Toda evolução de banco, backend, domínio, capability, workflow, form, regra, integração ou governance declara impacto na interface.

Uma task exclusivamente backend deve:

- justificar por que não há UI nesta etapa;
- criar ou referenciar gap frontend na mesma fase;
- declarar como o resultado poderá ser observado ou operado depois.

Dados operacionais pertencem ao workspace selecionado. Capabilities são globais e reutilizáveis; instalações são por workspace.

## 6. Execução de tasks

- Trabalhe somente em task `ready`.
- Uma task por branch e PR, salvo dependência empilhada declarada no `TASKS.md`.
- Use branch `<FASE>/<TASK-ID>-<slug>`.
- Registre SHA base antes de implementar.
- Respeite allowlist e denylist.
- Não amplie escopo; devolva `blocked` quando o contrato for insuficiente.
- Não reconstrua componente existente sem inventário `reuse/extend/replace`.
- Atualize `TASKS.md` e `PROGRESS.md` quando o estado mudar.
- Atualize `current/STATUS.md` somente quando a fase mudar de estado.

O contrato detalhado está em:

- `docs/agents/TASK_CONTRACT.md`
- `docs/agents/EVIDENCE_CONTRACT.md`
- `docs/agents/OPERATING_MODEL.md`

## 7. Separação de papéis

- Planner/Documentator estrutura fase e task.
- Implementer produz código e testes.
- Reviewer verifica diff, arquitetura e segurança.
- Tester reproduz critérios de aceite.
- Integrator prepara integração autorizada.
- Governor/Supervisor controla dependências e estados.

Implementador não valida sozinho o próprio trabalho quando houver agente independente disponível.

## 8. Gates antes do PR

Execute ou registre honestamente a impossibilidade de executar:

- diff e arquivos alterados;
- lint;
- typecheck;
- testes unitários/integrados aplicáveis;
- build;
- architecture checks;
- testes de autorização/tenant quando relevantes;
- estados de UI quando relevantes.

Divergência entre task, descrição do PR, diff e evidência bloqueia aprovação.

## 9. Estados

```text
planned → ready → in_progress → review → merged → validated → closed
                    ↘ blocked
planned/ready/review → superseded
```

Commit não significa validação. Merge não significa conclusão.

## 10. Documentação de referência

Fontes atuais:

- `docs/current/STATUS.md`
- `docs/current/ROADMAP.md`
- `docs/phases/**`
- `docs/agents/**`
- `docs/PROJECT_MANIFEST.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT_RULES.md`

Referências históricas podem ser usadas quando citadas explicitamente:

- `docs/archive/foundation/MANIFESTO.md`
- `docs/archive/foundation/AI_CONSTITUTION.md`
- `docs/archive/foundation/ONTOLOGY.md`
- `docs/archive/architecture/PLATFORM_VS_CLIENT.md`
- `docs/archive/planning/FRONTEND_PARITY_GATE.md`
- `docs/archive/database/SCHEMA_STRATEGY.md`

## 11. Sincronização

Todo agente atualiza o ambiente e confirma a branch/commit base antes de trabalhar. Contexto antigo de sessão não substitui `git fetch`, leitura dos documentos canônicos e verificação da task atual.
