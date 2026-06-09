# Fase 17A — Runtime contracts e análise de schema existente

## Objetivo
- inspecionar schema runtime existente;
- confirmar tabelas existentes;
- criar contratos TypeScript canônicos;
- **não alterar** schema;
- não criar repository, service, server action ou UI.

## Contexto
O processo publicou sua definição base, mas a execução real necessita de uma tipagem TypeScript robusta, espelhada nas tabelas já desenhadas na base de dados (em `src/db/runtime/schema/workflow.ts`). O código desta etapa será a base para o repository que virá na Fase 17B.

## Arquivos permitidos
- `src/features/workflow/runtime/runtime.types.ts`
- `src/features/workflow/runtime/runtime.validation.ts`
- `src/features/workflow/runtime/index.ts`
- `src/features/workflow/runtime/runtime.mapper.ts` (se útil)

## Arquivos proibidos
- Qualquer edição em `src/db/runtime/schema/workflow.ts`
- UI (`src/app/**`, `src/components/**`)
- Repositories, Services, ou Server Actions.

## Regras
- Garantir que as entidades TypeScript não vazem Drizzle Types vazios ou mal acoplados. Use inferência correta e Zod caso inclua validação estrutural.

## Etapas
1. Navegue e leia `src/db/runtime/schema/workflow.ts`.
2. Em `runtime.types.ts`, escreva as interfaces de `ProcessInstance`, `ProcessInstanceInsert`, `ProcessInstanceStep` refletindo puramente o schema lido.
3. Crie `runtime.validation.ts` usando zod para payload parsing se necessário.
4. Exporte as entidades pelo `index.ts`.

## Validações
- Compile o projeto (`npm run typecheck` / build local TypeScript). Sem erros.

## Relatório final esperado
Reporte quais tipos foram construídos a partir de quais tabelas identificadas e comprove que o schema não foi alterado.

## Regra de parada
Cessar trabalho imediatamente após escrever a camada Types/Validação. Não escreva os repositórios para manipular o banco.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/NEXT_PHASE.md
docs/00-current/STATUS_DAS_FASES.md
docs/00-current/DECISOES_ATIVAS.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/00-current/WORK_BOARD.md
docs/context-packs/runtime.md

Fase 17A — Runtime contracts e análise de schema existente

Objetivo:
Inspecionar o schema já existente de runtime e derivar as interfaces TypeScript e validações estritas necessárias para sua manipulação em Fases seguintes, evitando acoplamento direto com código de Drizzle dentro dos Services de negócios.

Escopo:
- Inspecionar: src/db/runtime/schema/workflow.ts
- Arquivos a criar/alterar:
  src/features/workflow/runtime/runtime.types.ts
  src/features/workflow/runtime/runtime.validation.ts
  src/features/workflow/runtime/index.ts
  src/features/workflow/runtime/runtime.mapper.ts (apenas se achar que ajuda mapear BD para Model de Negócio)

Não alterar:
O arquivo do schema (src/db/runtime/schema/workflow.ts) NÃO deve ser alterado sob NENHUMA hipótese nesta fase. Não crie Repositories, Services ou UIs.

Regras:
Modele os tipos para a execução do processo (`process_instances` e `process_instance_steps` equivalentes) e crie `zod` schemas para validações base (como os status de pending, active, completed, failed que encontrar na base de dados).

Etapas:
1. Leia `src/db/runtime/schema/workflow.ts` para capturar os Drizzle Models.
2. Crie os Type definitions em `runtime.types.ts`.
3. Desenvolva as validações Zod.
4. Exporte.

Validações:
O compilador TypeScript deve passar integralmente.

Relatório final:
Informe quais tipos foram mapeados, confirme a inspeção dos bancos e mostre o git status limpo fora dos arquivos autorizados.

Regra de parada:
Ao terminar os tipos/index.ts. Não implemente repositórios de salvamento/leitura.
```