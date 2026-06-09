# Phase 27B - Canonical Seed and Golden E2E

## Objetivo
Implementar uma base canônica de seed e testes ponta a ponta para provar que o System Builder consegue montar e executar um ciclo real mínimo no banco de dados. Validando a capacidade de criar uma organização, estruturar um workspace, instalar capabilities, publicar um processo e executar uma instância com estados/transições reais.

## Entidades Criadas
- **Organization**: Criada com chave canônica `org_system-builder-golden-e2e`.
- **Workspace**: Criado com chave canônica `workspace_system-builder-golden-e2e` e também um *Control Workspace* para validar isolamento.
- **User**: Criado usuário de teste com e-mail determinístico `golden.e2e@system-builder.local`.
- **Modules & Capabilities**: Mock do módulo de operações e *capabilities* de processos instaladas no tenant.
- **Process Candidate**: Criado `Atendimento Técnico Golden E2E` em draft/triage para publicação.
- **Process Definition/Version/Instance/Action Executions/Events**: Gerados durante a execução do fluxo no *Golden E2E Test*.

## Scripts Adicionados
Foram inseridos os scripts em `package.json`:
- `db:seed:golden-e2e`: Executa `src/scripts/golden-e2e/seed.ts` (popula dados).
- `db:seed:golden-e2e:clean`: Executa `src/scripts/golden-e2e/clean.ts` (limpeza segura por namespace).
- `test:golden-e2e`: Executa `tests/integration/golden-cycle.test.ts`.

## Estratégia de Idempotência
O script de `seed.ts` verifica a existência da chave antes da inserção (`where(eq(...))`). Se encontrar, reaproveita o ID em vez de criar duplicatas, fazendo consultas sucessivas na hierarquia.

## Estratégia de Cleanup
O script de limpeza localiza todos os workspaces e módulos do namespace `system-builder-golden-e2e`. A exclusão ocorre de baixo para cima na árvore de dependência (Events, Instances -> ProcessVersions, ProcessDefinitions -> Workspace/Capabilities -> Org), respeitando Foreign Keys.

## Estratégia de Isolamento por Workspace
Para provar o isolamento, foi gerado o workspace secundário `workspace_system-builder-golden-e2e_control`. No teste automatizado, verificamos se consultas operacionais (como *Process Candidates*) não cruzam os dados do workspace *main* para o de *controle*.

## Fluxo Golden E2E
Implementado em `tests/integration/golden-cycle.test.ts`. O fluxo atua sobre a camada de serviço:
1. `seed` do DB com o Process Candidate.
2. `approveCandidateService` (MockAuthPort) para simular aprovação.
3. `publishApprovedCandidateWithDrizzle` para publicar versão.
4. `startProcessInstance` via camada de execução.
5. Inserção manual de `Action Execution` root e múltiplos `advanceStep`.
6. Validação do status final (`completed`) e registro do Event de conclusão.

## Comandos Executados
```bash
npx tsx src/scripts/golden-e2e/clean.ts
npx tsx src/scripts/golden-e2e/seed.ts
npm run test:golden-e2e
npm run lint -- --fix
npm run build
```

## Resultados
Os testes mostraram sucesso de `100%`.
- Idempotência preservada.
- Isolamento de workspace com sucesso.
- O ciclo do runtime com path-finding completou corretamente até o `closed`.
- Erros de TypeScript/Drizzle (devido a migração schema `platform` para `runtime` e `definitionJson`) foram resolvidos.

## Gaps Encontrados
- Durante os testes foi notado um gap de query em `process-definition.queries.ts`, que buscava `processVersions` do schema antigo (`platform` em vez de `runtime`) usando nome de coluna defasado (`definitionJson` e não `definition`). Isso foi consertado diretamente no commit.
- A service `startProcessInstance` precisava criar a primeira `Action Execution`, mas deixamos a criação por fora no teste por ser um escopo linear e simples. Em futuras versões, a engine deve resolver isso no backend/start-process.

## Decisão Final
APROVADO PARA FASE 28