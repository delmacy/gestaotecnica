# Fase 19C — Integrar eventos no runtime service

## Objetivo
- registrar `process.started` ao iniciar processo;
- registrar `step.completed` ao avançar step;
- registrar `process.completed` ao concluir processo;
- não criar webhook/n8n.

## Contexto
Agora, a Engine que roda manual e síncrona nos Blocos 17/18 também deve "pingar" nosso Event Repository do 19B durante suas transações críticas para emitir a rastreabilidade nativa do MVP.

## Arquivos permitidos
- `src/features/workflow/runtime/runtime.service.ts`

## Arquivos proibidos
- UI, Actions web.

## Regras
- O Write do evento deve acontecer dentro da transação SQL (`db.transaction`) com o Drizzle se possível, atando o registro da ação e do log num único momento consistente.

## Etapas
1. No método `startInstance`, injete `appendEvent("process.started")`.
2. No `advanceStep`, injete logs e verificações de completion.

## Validações
- Testes locais que garantam que os requests de services inseriram nas tabelas.

## Relatório final esperado
Listagem dos exatos blocos nos Services onde foram atados os Appenders.

## Regra de parada
O service foi enriquecido e coeso, fim.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/context-packs/runtime-events.md

Fase 19C — Integrar eventos no runtime service

Objetivo:
Dar telemetria/rastreabilidade real ao Runtime Service atrelando as emissões mapeadas na 19B dentro dos pipelines de negócio já construídos.

Escopo:
- Arquivos: `src/features/workflow/runtime/runtime.service.ts`

Não alterar:
Outboxes assíncronos (não implemente!).

Regras:
1. Na mesma transação SQL (`tx`) que commita uma instância, dê append no evento de Started. Idem para Steps e Finalização.

Etapas:
1. Injete as chamadas do Event Repository nos métodos do Runtime Service já estruturados.

Validações:
Lógica TS impecável, dependências atendidas.

Relatório final:
Em quais serviços/linhas lógicas as chamadas foram espelhadas.

Regra de parada:
Terminou a injeção nos controllers lógicos, feche PR.
```