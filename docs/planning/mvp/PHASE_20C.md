# Fase 20C — Checklist de MVP

## Objetivo
- criar checklist objetivo do que compõe o MVP técnico.
- marcar status global das features base.
- não implementar nada de novo.

## Contexto
Um documento de validação (audit trail) comprobatório do pacote construído, garantindo que "A fundação está posta" antes do roadmap da V2.

## Arquivos permitidos
- `docs/00-current/MVP_CHECKLIST.md`

## Arquivos proibidos
- Código `src/`.

## Regras
- Simples arquivo de governança do escopo de negócios (Builder -> Save -> Publisher -> Instantiate -> Runner -> Events).

## Etapas
1. Mapeie todos os sub-sistemas no arquivo de Check.
2. Dê os cheques finais em cada área baseado no que Jules Dev já entregou nas fases anteriores a 20C.

## Validações
- Revisão textual.

## Relatório final esperado
Criação do MVP_CHECKLIST.

## Regra de parada
Documento consolidado.

## Prompt pronto para Jules Dev

```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md
docs/context-packs/mvp-hardening.md

Fase 20C — Checklist de MVP

Objetivo:
Gerar o documento oficial comprobatório de que todas as engrenagens vitais do projeto MVP foram instaladas, operantes e prontas para transicionar.

Escopo:
- Arquivos a criar: `docs/00-current/MVP_CHECKLIST.md`

Não alterar:
Código.

Regras:
Verifique o Board. Crie checkboxes detalhando as trilhas (Builder, Workflow, Persistence, Runtime, Events) e marque as finalizadas.

Etapas:
1. Monte o Markdown com os checks de escopo real do produto MVP construído.

Validações:
Isolamento documental total.

Relatório final:
O conteúdo do Checklist criado.

Regra de parada:
Commit fechado do documento, pare.
```