# Próxima Fase — System Builder

## Fase atual de organização

```text
A documentação estratégica foi realinhada. O produto agora foca na tese do "Process Candidate" e no "Builder Control Plane" (Fase 20+).
```

## Prioridade Atual (Foco Documental / Implementação Inicial Alpha)

A próxima fase deve priorizar as fundações do control plane, sem invadir multiagente ou paperclip:
```text
Builder Control Plane Shell
Process Candidates
UI manual de Process Candidates
modelo documental de Process Candidate
preparação agent-ready
```

**NÃO PRIORIZAR AINDA:**
```text
instalação do Paperclip
multiagente completo
auto geração de código
automação autônoma
```

## Próxima fase técnica autorizada na fila do MVP/Transição

```text
Fase 20 — Builder Control Plane Shell
(Consulte o WORK_BOARD para status detalhado das pendências anteriores)
```

## Referência Rápida

Para iniciar a execução da Fase 20, o responsável técnico deve consultar o planejamento detalhado em:
[docs/planning/alpha/PHASE_20.md](../planning/alpha/PHASE_20.md)

## Gate adicional obrigatório

Antes de iniciar qualquer fase nova, Jules Dev e Jules Tester devem consultar:

[docs/planning/FRONTEND_PARITY_GATE.md](../planning/FRONTEND_PARITY_GATE.md)

Nenhuma fase que altere backend, banco, domínio, workflow, capability, form,
rule, aprovação ou integração deve ser considerada completa sem declarar o
impacto frontend correspondente ou registrar um gap frontend explícito.
