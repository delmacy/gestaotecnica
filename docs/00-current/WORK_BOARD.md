# Work Board — System Builder

## 1. Estado atual

| Campo                           | Valor                                        |
| ------------------------------- | -------------------------------------------- |
| Fase técnica atual              | Fase 30B — Gateway Receipts UI               |
| Fase documental atual           | Frontend Parity Gate aplicado ao bloco Alpha |
| Última fase técnica implementada| Fase 30                                      |
| Status da última fase           | READY WITH RESERVATIONS                      |
| Última fase frontend aprovada   | Fase 29B                                     |
| Próxima fase frontend vinculada | Fase 30B                                     |
| Responsável técnico             | Jules Dev                                    |
| Responsável documental          | Jules Documental                             |
| Revisor                         | ChatGPT / Jules Tester                       |
| Dono do projeto                 | Delmacy                                      |

## 2. Trilhas de trabalho

| Trilha                | Responsável      | Status      | Observação                                    |
| --------------------- | ---------------- | ----------- | --------------------------------------------- |
| Documentação/contexto | Jules Documental | Concluída   | Replanejamento Alpha por contratos de feature |
| Implementação         | Jules Dev        | Pendente    | Implementará a Fase 30B                       |
| Revisão               | ChatGPT          | Sob demanda | Revisa merges e coerência                     |
| Decisão de produto    | Delmacy          | Ativo       | Aprova direção e prioridades                  |

## 3. Fila técnica

1. Fase 30 — Gateway Metadata, Correlation ID, Idempotency — Concluída com ressalva
2. Fase 30B — Gateway Receipts UI — Próxima autorizada
3. Fase 31 — n8n Signal Inbox Backend — Bloqueada até 30B
4. Fase 31B — Signal Inbox UI — Planejada
5. Fase 32 — Observation Pipeline Backend — Planejada
6. Fase 32B — Observation Review UI — Planejada

## 4. Fila documental

| Ordem | Documento/Ação               | Status    | Responsável      | Objetivo                                                                 |
| ----: | ---------------------------- | --------- | ---------------- | ------------------------------------------------------------------------ |
|     1 | Planejamento MVP (17-20)     | Histórico | Jules Documental | Mantido como referência de evolução anterior.                            |
|     2 | Frontend Parity Gate (28-40) | Concluída | Jules Documental | Replanejado fases Alpha 28-40 para garantir UI para cada backend avanço. |
|     3 | Próximo refinamento          | Pendente  | Jules Documental | Ajustar documentação caso a Fase 28 revele gaps no Agent Gateway.        |

## 5. Bloqueios

A Fase 31 está bloqueada até a conclusão da Fase 30B.

## 6. Decisões recentes

| Data  | Decisão                          | Impacto                                                                                                                                                                        |
| ----- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Atual | Golden E2E aprovado              | A Fase 27B criou seed canônico e teste ponta a ponta do ciclo candidato -> publicação -> instância -> avanço.                                                                  |
| Atual | Layout compatível aprovado       | A Fase 27C criou shell visual sem alterar contratos de backend.                                                                                                                |
| Atual | Fila Alpha com paridade frontend | O bloco alpha foi replanejado com Frontend Parity Gate, incluindo fases B para UIs correspondentes. A Fase 28 está autorizada; fases posteriores aguardam conclusão e revisão. |

## 7. Handoff para Jules Dev

Planejamento futuro disponível (NÃO IMPLEMENTAR AINDA):

- `docs/planning/alpha/PHASE_29.md` até `PHASE_40.md`.

- Registro histórico das fases: `docs/phases/`
- Fase atual deve apontar para seu arquivo histórico correspondente.
- Handoff para Jules Dev deve incluir:
  - planning file;
  - phase record file.

**Atenção Jules Dev:** Antes de começar a implementar ou ler qualquer arquivo, você **deve** atualizar o seu ambiente git local executando um `git pull` na branch correta para garantir que pegou as últimas atualizações geradas pelo Jules Documental.

```text
Próxima fase técnica: Fase 30B — Agent Receipts UI

Consulte o documento principal de planejamento de onde deve partir o prompt exato para a sua implementação:

docs/planning/alpha/PHASE_30B.md

Registro:
docs/phases/PHASE_30B.md

NÃO AVANCE PARA FASES FUTURAS. Cumpra a 30B e retorne o resultado.
```

## 8. Última revisão ChatGPT

| Campo          | Valor                                  |
| -------------- | -------------------------------------- |
| Última revisão | Fase 30 concluída com ressalvas de E2E |
| Resultado      | Aguardando                             |
| Observações    | Fase 30B autorizada. Fase 31 bloqueada.|
