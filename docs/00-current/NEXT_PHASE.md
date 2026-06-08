# Próxima Fase — System Builder

## Fase atual de organização

```text
A documentação estratégica foi realinhada com o conceito de Frontend Parity Gate. O produto agora garante que o frontend não fique atrasado em relação ao backend para as fases Alpha (28 a 40). O foco é no "Process Candidate" e no "Builder Control Plane" com interfaces operáveis em cada passo.
```

## Prioridade Atual

A prioridade atual é continuar a fila técnica já validada no histórico de fases. A Fase 27B aprovou o Golden E2E canônico e a Fase 27C aprovou a compatibilidade visual do layout. A próxima implementação técnica autorizada é a Fase 28, respeitando a política de Frontend Parity Gate.

**NÃO PRIORIZAR AINDA:**
```text
instalação do Paperclip
multiagente completo
auto geração de código
automação autônoma
```

## Próxima fase técnica autorizada

```text
Fase 28 — Agent Gateway Backend
Frontend vinculado: Fase 28B — Agent Gateway Control Plane UI
```

## Referência Rápida

Para iniciar a execução da Fase 28, o responsável técnico deve consultar o planejamento detalhado em:
[docs/planning/alpha/PHASE_28.md](../planning/alpha/PHASE_28.md)

## Gate adicional obrigatório

Antes de iniciar qualquer fase nova, Jules Dev e Jules Tester devem consultar:

[docs/planning/FRONTEND_PARITY_GATE.md](../planning/FRONTEND_PARITY_GATE.md)

Nenhuma fase que altere backend, banco, domínio, workflow, capability, form,
rule, aprovação ou integração deve ser considerada completa sem declarar o
impacto frontend correspondente ou registrar um gap frontend explícito.
