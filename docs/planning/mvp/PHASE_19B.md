# Fase 19B — Schema/repository de eventos mínimos

## Objetivo
- criar ou mapear tabela simples de eventos (se já existir no schema target);
- repository para append/list isolado;
- não criar pub/sub ou outbox.

## Contexto
Temos o tipo do evento, precisamos de uma forma de dar 'append' na base de logs. Esse repository é um Write-Only/Read-List muito simples, sem loops de notificação paralelos.

## Arquivos permitidos
- `src/features/workflow/runtime/events.repository.ts`
- Se for criar tabela nova, apenas adicione em Schema do runtime. (Se aplicável sob aprovação, ou reuso de logs existentes mapeados).

## Arquivos proibidos
- Server actions lógicas.

## Regras
- O Repository recebe um DB Drizzle por Injeção e isola por tenant.

## Etapas
1. Identifique a tabela no schema (ex: `workflow.events` ou a legacy se for o mandato estrito da arquitetura local mapeada).
2. Construa a função `appendEvent` e `listEventsByInstance`.

## Validações
- Queries seguras, filtradas.

## Relatório final esperado
As operações SQL construídas via Drizzle na camada event.

## Regra de parada
Ao concluir as funções Write/Read, encerrar.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/context-packs/runtime-events.md

Fase 19B — Schema/repository de eventos mínimos

Objetivo:
Criar o isolamento do Banco de Dados para gerenciar o Log Imutável de instâncias baseadas nos contratos da 19A.

Escopo:
- Arquivos: `src/features/workflow/runtime/events.repository.ts`

Não alterar:
O Service de instâncias.

Regras:
1. Utilize o padrão Repository (db injected) construindo funções `append` e `list`. O append é insert only.

Etapas:
1. Identifique o modelo na tabela do db (se inexistente crie `runtime_events` ou análogo validado com a documentação do projeto, assumindo `process_events` simples).
2. Escreva as funções do repositório.

Validações:
Comprovação no TS do Drizzle schema interligado.

Relatório final:
Relate a qual tabela física o repositório vinculou a escrita.

Regra de parada:
Repository completo e exportado.
```