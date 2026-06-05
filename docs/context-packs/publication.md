# Context Pack: Publication

## 1. Objetivo do Domínio
O ciclo de vida final da modelagem de Workflow. Marca o momento no qual um rascunho de definição ("Draft") em `process_versions` passa para o status "Published", certificando que o processo é válido, formal e consumível operacionalmente por instâncias de Runtime.

## 2. Arquivos Principais
- `src/features/workflow/definitions/process-publication.actions.ts` (ou similar criado na Fase 16)
- `src/features/workflow/definitions/process-definition.service.ts` (operações de mark-as-published)

## 3. Decisões Ativas
- A operação de publicação apenas altera metadados na base (como status do registro em `process_versions`).
- Uma publicação bem-sucedida finaliza o ciclo primário do System Builder (o MVP de modelagem).

## 4. Anti-Escopo
- A publicação **NÃO** deve disparar eventos de inicialização. Ela apenas viabiliza a execução do modelo no futuro.

## 5. Próximas Fases Relacionadas
- Fase 17A em diante onde instâncias de Runtime (Execução) irão consultar ativamente quais são as versões Published para iniciar seus fluxos lógicos correspondentes.