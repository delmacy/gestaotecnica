# TASKER-001: Validar fluxo de transição de tasks

## Task escolhida para teste de fluxo
`DOC-002: Revisar segunda rodada documental` e `TASKER-001: Validar fluxo de transição de tasks`

## Estado inicial
No início do sprint, o backlog exibia `DOC-002` no status `review` (já submetido pelo agente documental) e `TASKER-001` no status `ready` para iniciar o fluxo.

## Transições simuladas ou documentadas
1. **backlog -> ready**: O Product Owner (ou Tasker, com autorização) move uma tarefa (`PM-PILOT-001` na próxima etapa).
2. **ready -> in_progress**: O Agente assume a tarefa, indicando que a execução documental está acontecendo.
3. **in_progress -> review**: O Agente gera as evidências necessárias. `DOC-002` exigiu `docs/tasker/reviews/DOC-002_REVIEW.md`. O documento foi gerado e revisado.
4. **review -> done**: O revisor aprova a documentação. Aqui, o `DOC-002_REVIEW.md` indicou `APPROVED_FOR_TASKER`. Agora as tasks correspondentes podem ir para `done` nos boards.

## Evidências exigidas para done
Para que o fluxo seja validado:
- Uma tarefa não pode ir para `done` sem a geração do artefato correspondente (neste caso, arquivos de revisão e arquivos de modelo piloto).
- Tarefas futuras (`PM-PILOT-002`, `DEV-READINESS-001`) devem permanecer em seus devidos estados (`ready` / `blocked`).

## Critérios de aceite
- O Tasker consegue criar os documentos adequados sem alterar código em `src/**` ou infraestrutura.
- A rastreabilidade das ações é garantida por documentação Markdown no diretório `docs/tasker/` e `docs/process_mirroring/`.

## Limites do Tasker
- **Não há código:** Nenhuma alteração é permitida no diretório `src/`, banco de dados, nem arquivos de infraestrutura (como `package.json`).
- **Organização e Delegação:** O papel limita-se a transitar dados nos painéis (`GLOBAL_WORK_BOARD.md`, `BACKLOG.md`) e registrar os resultados de coordenação. A execução técnica de implementação será de `Jules Dev`, bloqueada no momento por `DEV-READINESS-001`.

## Próxima task recomendada
`PM-PILOT-001` - Selecionar processo piloto, usando a coerência avaliada em `DOC-002` e o fluxo demonstrado em `TASKER-001`.
