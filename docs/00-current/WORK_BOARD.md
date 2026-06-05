# Work Board — System Builder

## 1. Estado atual

| Campo | Valor |
|---|---|
| Fase técnica atual | Fase 17A |
| Fase documental atual | Concluído planejamento até MVP (Fase 20D) |
| Última fase técnica aprovada | Fase 16 |
| Última fase documental aprovada | Fase 16C (e Planejamento 17-20) |
| Próxima fase técnica | Fase 17A |
| Próxima fase documental | Acompanhar execução da 17 e refinar detalhamento 18-20, se necessário |
| Responsável técnico | Jules Dev |
| Responsável documental | Jules Documental |
| Revisor | ChatGPT |
| Dono do projeto | Delmacy |

## 2. Trilhas de trabalho

| Trilha | Responsável | Status | Observação |
|---|---|---|---|
| Documentação/contexto | Jules Documental | Em andamento (Acompanhamento) | Planejamento gerado até a 20D |
| Implementação | Jules Dev | Pendente | Implementará a fase técnica 17A |
| Revisão | ChatGPT | Sob demanda | Revisa merges e coerência |
| Decisão de produto | Delmacy | Ativo | Aprova direção e prioridades |

## 3. Fila técnica

| Ordem | Bloco | Fase | Status | Objetivo Resumido |
|---:|---|---|---|---|
| 1 | Runtime | Fase 17A | Pendente | Runtime contracts e análise do schema existente |
| 2 | Runtime | Fase 17B | Planejada | Runtime repository de instâncias e steps |
| 3 | Runtime | Fase 17C | Planejada | Runtime service para iniciar instâncias |
| 4 | Runtime | Fase 17D | Planejada | Exposição em Server Action |
| 5 | Runtime | Fase 17E | Planejada | UI mínima para teste de instância |
| 6 | Execução | Fase 18A | Planejada | Contratos/tipos para execução de step |
| 7 | Execução | Fase 18B | Planejada | Repository para conclusão/avanço de step |
| 8 | Execução | Fase 18C | Planejada | Service de lógica básica de avanço de step |
| 9 | Execução | Fase 18D | Planejada | Exposição Server Action/UI da transição |
| 10 | Eventos | Fase 19A | Planejada | Contratos simples de eventos (started, completed) |
| 11 | Eventos | Fase 19B | Planejada | Schema e repository base de registro (append) |
| 12 | Eventos | Fase 19C | Planejada | Injeção no service de runtime |
| 13 | Eventos | Fase 19D | Planejada | Trace Receipt rudimentar |
| 14 | Hardening | Fase 20A | Planejada | Teste completo de Smoke flow |
| 15 | Hardening | Fase 20B | Planejada | Correção de 'any' críticos do Typescript |
| 16 | Hardening | Fase 20C | Planejada | Checklist final do MVP |
| 17 | Hardening | Fase 20D | Planejada | Demo E2E documentada. Fim do MVP técnico. |

## 4. Fila documental

| Ordem | Documento/Ação | Status | Responsável | Objetivo |
|---:|---|---|---|---|
| 1 | Planejamento MVP (17-20) | Concluída | Jules Documental | Preparado o pacote da arquitetura de runtime, execução e eventos. |
| 2 | Refinamentos | Pendente | Jules Documental | Ajustar prompts de 18-20 baseados em possíveis bloqueios da Fase 17. |

## 5. Bloqueios

| ID | Bloqueio | Responsável | Status | Resolução esperada |
|---|---|---|---|---|
| B-001 | Revisão pendente da 16B | ChatGPT / Delmacy | Aberto | Confirmar merge/revisão da Fase 16B antes de autorizar codificação final da Fase 17A (Runtime mínimo). |

## 6. Decisões recentes

| Data | Decisão | Impacto |
|---|---|---|
| Atual | Planejamento fechado para MVP | A carga completa técnica de blocos 17 (Runtime), 18 (Steps), 19 (Events) e 20 (Hardening) foi documentada. O pipeline do agente de desenvolvimento (Dev) está abastecido, porém contido por limites de merge estritos a cada Fase. |

## 7. Handoff para Jules Dev

```text
Próxima fase técnica: Fase 17A — Runtime contracts e análise de schema existente

Consulte o documento principal de planejamento de onde deve partir o prompt exato para a sua implementação:

docs/planning/runtime/PHASE_17A.md

NÃO AVANCE PARA FASES FUTURAS. Cumpra a 17A e retorne o resultado.
```

## 8. Última revisão ChatGPT

| Campo | Valor |
|---|---|
| Última revisão | Aguardando |
| Resultado | Aguardando |
| Observações | Esperando a validação final da documentação (16C) e do planejamento final até a Fase 20D. |
