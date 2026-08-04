# Modelo operacional de agentes

## Objetivo

Permitir execução paralela e auditável sem perda de contexto, mistura de escopo ou atualização fictícia de status.

## Papéis

| Papel | Pode | Não pode |
|---|---|---|
| Planner/Documentator | estruturar fase, decompor tasks, reconciliar dependências e atualizar documentação | implementar código funcional ou declarar validação técnica sozinho |
| Implementer | executar uma task `ready`, criar testes e registrar evidências | ampliar escopo, alterar outra fase ou aprovar o próprio trabalho |
| Reviewer | revisar diff, contrato, segurança, testes e arquitetura | reescrever silenciosamente a task ou validar sem reproduzir provas |
| Tester | executar testes independentes, E2E e cenários de falha | assumir que build ou teste declarado pelo implementador foi executado |
| Integrator | atualizar branch, resolver integração autorizada e preparar merge | misturar tasks ou fazer merge com gates falhos |
| Governor/Supervisor | selecionar task liberada, aplicar gates e manter a state machine | inferir conclusão apenas por nome de branch, commit ou PR |

Quando houver poucos agentes, uma pessoa pode acumular papéis, mas implementação e validação final devem permanecer separadas sempre que possível.

## Ciclo de uma task

```text
1. Select
2. Bootstrap
3. Plan
4. Implement
5. Self-check
6. Review
7. Test
8. Merge
9. Validate
10. Update progress
```

### 1. Select

O supervisor seleciona somente task com estado `ready` e dependências cumpridas.

### 2. Bootstrap

O agente deve:

- atualizar a branch base;
- ler `AGENTS.md`;
- ler `docs/current/STATUS.md` e `ROADMAP.md`;
- ler os três arquivos da fase;
- confirmar allowlist, denylist e critérios de aceite;
- registrar o SHA base.

### 3. Plan

O implementador registra brevemente:

- arquivos previstos;
- contratos afetados;
- impacto de banco, backend, frontend e operações;
- testes que provarão o resultado;
- riscos ou ambiguidades.

Se a task exigir alterar escopo, ela volta para planejamento. O agente não improvisa a ampliação.

### 4. Implement

- uma task por branch;
- branch criada da `main` ou da branch-base explicitamente autorizada;
- nenhum arquivo fora da allowlist;
- migrations rastreáveis;
- nenhuma identidade, workspace, role ou ownership confiada a input público;
- impacto de frontend registrado mesmo em task exclusivamente backend.

### 5. Self-check

Antes de abrir PR:

- revisar `git diff --name-only`;
- confirmar ausência de arquivos de outras tasks;
- executar testes aplicáveis;
- executar lint, typecheck, build e architecture checks disponíveis;
- preencher evidência honesta, inclusive falhas e testes não executados.

### 6. Review

O reviewer verifica:

- aderência ao contrato da task;
- escopo real do diff;
- isolamento de workspace e autorização;
- migrations e compatibilidade;
- frontend parity;
- qualidade e suficiência dos testes;
- coerência entre descrição, diff e evidência.

### 7. Test

O tester reproduz os critérios de aceite. Falha de ambiente deve ser distinguida de falha de produto e registrada como blocker reproduzível.

### 8. Merge

A task pode chegar a `merged` quando:

- review foi aprovado;
- checks obrigatórios passaram ou exceção foi formalmente aceita;
- a branch está atualizada;
- o PR contém somente a task.

### 9. Validate

Depois do merge, a task chega a `validated` somente quando a prova exigida foi executada contra a versão integrada ou quando o contrato declarar validação pré-merge suficiente.

### 10. Update progress

O PR ou um PR documental associado atualiza:

- `TASKS.md`;
- `PROGRESS.md`;
- `current/STATUS.md`, apenas se o estado da fase mudou.

## Paralelismo

Tasks podem rodar em paralelo somente quando:

- não possuem dependência entre si;
- allowlists não se sobrepõem materialmente;
- não criam migrations concorrentes no mesmo schema;
- não alteram o mesmo contrato público;
- o supervisor definiu a ordem de integração.

## Branches e PRs

Padrão:

```text
<fase>/<task-id>-<slug>
```

Exemplos:

```text
F21/SB-CR-09-runtime-rls
UX-NAV-04/UX-NAV-04-002-session-binding
ST-S01/ST-S01-008-closeout
```

PRs empilhados são permitidos apenas quando a dependência é explícita no `TASKS.md`. O PR deve declarar a base temporária e ser retargetado para a `main` após a dependência ser integrada.

## Context packs

Cada execução deve receber somente:

- identidade da fase e task;
- arquivos de contrato relevantes;
- allowlist e denylist;
- critérios de aceite;
- SHA base;
- comandos de validação;
- links para decisões necessárias.

Evite prompts gigantes com toda a história do projeto. A documentação canônica deve permitir descoberta determinística.

## Regra de parada

O agente para e devolve `blocked` quando:

- dependência não está integrada;
- contrato contradiz arquitetura vigente;
- precisa alterar arquivo fora do escopo;
- não consegue provar autorização ou isolamento;
- dados reais necessários não estão disponíveis;
- a solução exigiria reconstruir componente existente sem inventário.
