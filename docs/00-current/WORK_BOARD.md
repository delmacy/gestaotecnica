# Work Board — System Builder

## 1. Estado atual

| Campo | Valor |
|---|---|
| Fase técnica atual | Replanejamento Alpha |
| Fase documental atual | Frontend Parity Gate aplicado ao bloco Alpha |
| Última fase técnica aprovada | Fase 29 |
| Última fase visual aprovada | Fase 29B |
| Próxima fase técnica | Fase 30 |
| Próxima fase frontend vinculada | Fase 30B |
| Responsável técnico | Jules Dev |
| Responsável documental | Jules Documental |
| Revisor | ChatGPT |
| Dono do projeto | Delmacy |

## 2. Trilhas de trabalho

| Trilha | Responsável | Status | Observação |
|---|---|---|---|
| Documentação/contexto | Jules Documental | Concluída | Replanejamento Alpha por contratos de feature |
| Documentação/contexto | Jules Documental | Concluída | DDD Maturity Alignment - Feature contracts passam a exigir contexto de domínio, invariantes e use cases. |
| Implementação | Jules Dev | Pendente | Implementará a fase técnica 30 |
| Revisão | ChatGPT | Sob demanda | Revisa merges e coerência |
| Decisão de produto | Delmacy | Ativo | Aprova direção e prioridades |

## 3. Fila técnica

| Ordem | Bloco | Fase | Status | Objetivo Resumido |
|---:|---|---|---|---|
| 1 | Runtime/Seed | Fase 27B | Concluída | Seed canônico e Golden E2E |
| 2 | Layout | Fase 27C | Concluída | Shell visual compatível com backend e páginas |
| 3 | Gateway | Fase 28 | Pendente | Agent Gateway Backend |
| 4 | Gateway UI | Fase 28B | Planejada | Agent Gateway Control Plane UI |
| 5 | Alpha | Fases 29-40 | Planejadas | Evolução com Frontend Parity Gate |

## 4. Fila documental

| Ordem | Documento/Ação | Status | Responsável | Objetivo |
|---:|---|---|---|---|
| 1 | Planejamento MVP (17-20) | Histórico | Jules Documental | Mantido como referência de evolução anterior. |
| 2 | Frontend Parity Gate (28-40) | Concluída | Jules Documental | Replanejado fases Alpha 28-40 para garantir UI para cada backend avanço. |
| 3 | DDD Maturity Alignment | Concluída | Jules Documental | Feature contracts passam a exigir contexto de domínio, invariantes e use cases. |
| 4 | Próximo refinamento | Pendente | Jules Documental | Ajustar documentação caso a Fase 30 revele gaps no Agent Gateway. |

## 5. Bloqueios

Nenhum bloqueio ativo.

## 6. Decisões recentes

| Data | Decisão | Impacto |
|---|---|---|
| Atual | Golden E2E aprovado | A Fase 27B criou seed canônico e teste ponta a ponta do ciclo candidato -> publicação -> instância -> avanço. |
| Atual | Layout compatível aprovado | A Fase 27C criou shell visual sem alterar contratos de backend. |
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
Próxima fase técnica: Fase 30 — Gateway Metadata, Correlation ID, Idempotency

Consulte o documento principal de planejamento de onde deve partir o prompt exato para a sua implementação:

docs/planning/alpha/PHASE_30.md

Registro:
docs/phases/PHASE_30.md

NÃO AVANCE PARA FASES FUTURAS. Cumpra a 30 e retorne o resultado.
```

## 8. Última revisão ChatGPT

| Campo | Valor |
|---|---|
| Última revisão | Aguardando |
| Resultado | Aguardando |
| Observações | Fase 28 autorizada com Fase 28B vinculada para paridade frontend. |
