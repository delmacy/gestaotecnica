# Regras de Transição: Tasker Board

Este documento define os fluxos de estado permitidos e as regras de negócio para a transição de tarefas na interface do Tasker Board.

## Transições Permitidas

As transições de status devem seguir um caminho progressivo (ou de regressão controlada). As seguintes mudanças de status são permitidas:

- `backlog` → `ready`
- `ready` → `in_progress`
- `in_progress` → `review`
- `review` → `done`
- `review` → `in_progress` (caso a revisão seja rejeitada ou necessite de ajustes)
- `blocked` → `ready` (quando o bloqueio for resolvido)
- `any` → `cancelled` (requer justificativa, e deve ocorrer de qualquer estado)

## Regras Obrigatórias e Guards

1. **Evidência para Conclusão:**
   A transição para `done` requer obrigatoriamente a existência de evidências (ex: links para arquivos markdown, PRs, relatórios de execução). Se não houver evidência registrada no card, a transição é bloqueada.

2. **Justificativa para Bloqueio:**
   Mover uma tarefa para `blocked` ou `cancelled` exige o preenchimento de um campo "motivo" ou justificativa.

3. **Responsabilidade por Execução:**
   Uma tarefa só pode transicionar para `in_progress` se houver um "agente responsável" (humano ou AI Agent) associado à tarefa.

4. **Artefatos de Revisão:**
   A transição de `in_progress` para `review` requer a submissão de um artefato de revisão (arquivo de relatório, checklist ou PR).

5. **Isolamento de Grupos:**
   Tarefas do **Grupo D** não podem ser desbloqueadas por tarefas do **Grupo A**. O progresso do Grupo D depende exclusivamente da chegada de fontes operacionais reais.

6. **Bloqueio por Fontes Reais:**
   A falta de "fontes reais" só pode colocar em status `blocked` as tarefas pertencentes ao **Grupo D**. Tarefas dos demais grupos não devem ser bloqueadas por essa dependência.

7. **Prontidão de Desenvolvimento (Readiness):**
   Tarefas de desenvolvimento (DEV tasks) exigem que a sua etapa correspondente de "readiness" (ex: DEV-READINESS) tenha sido aprovada antes de entrar em `ready` ou `in_progress`.

8. **Aprovação de Escopo:**
   A implementação real (código de UI ou backend) exige que o escopo / contrato (documentation phase) tenha sido aprovado (`done`).

9. **Sinalização Sintética:**
   Tarefas de escopo demo, UI mockada ou desenvolvimento exploratório devem ter uma flag visual ou campo marcando a tarefa como sintética, diferenciando-a das implementações que demandam runtime real.
