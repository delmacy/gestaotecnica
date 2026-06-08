# Próxima Fase — System Builder

## Fase atual de organização

```text
A documentação estratégica foi realinhada com o conceito de Frontend Parity Gate. O produto agora garante que o frontend não fique atrasado em relação ao backend para as fases Alpha (28 a 40). O foco é no "Process Candidate" e no "Builder Control Plane" com interfaces operáveis em cada passo.
```

## Prioridade Atual

A prioridade atual é continuar a fila técnica já validada no histórico de fases. A Fase 27B aprovou o Golden E2E canônico e a Fase 27C aprovou a compatibilidade visual do layout. A próxima implementação técnica autorizada é a Fase 29, condicionada à revisão ChatGPT/Jules Tester e à finalização da correção 28C, respeitando a política de Frontend Parity Gate.

**NÃO PRIORIZAR AINDA:**
```text
instalação do Paperclip
multiagente completo
auto geração de código
automação autônoma
```

## Próxima fase técnica autorizada

```text
Fase 29 — Process Builder Agent
(NÃO AVANÇAR ATÉ QUE A CORREÇÃO 28C SEJA TOTALMENTE APROVADA E REVISADA)
```

## Referência Rápida

Para iniciar a execução da Fase 29, o responsável técnico deve consultar o planejamento detalhado em:
[docs/planning/alpha/PHASE_29.md](../planning/alpha/PHASE_29.md)

## Gate adicional obrigatório

Antes de iniciar qualquer fase nova, Jules Dev e Jules Tester devem consultar:

[docs/planning/FRONTEND_PARITY_GATE.md](../planning/FRONTEND_PARITY_GATE.md)

Nenhuma fase que altere backend, banco, domínio, workflow, capability, form,
rule, aprovação ou integração deve ser considerada completa sem declarar o
impacto frontend correspondente ou registrar um gap frontend explícito.
