# Project Manifest

## Visão do System Builder
O projeto System Builder é uma plataforma para criação de sistemas empresariais modulares baseados em processos.

## Propósito
O sistema deve evoluir a partir de documentação, work boards, instruções por módulo, tasks bem definidas e contratos.

## Princípios
- Markdown primeiro, Contrato depois, Código por último.
- O projeto não tenta implementar banco de dados avançado, API Gateway completo ou runtime dinâmico antes da estabilização dos módulos principais.

## Modularização
O projeto é dividido em módulos com fronteiras bem definidas: core, doc, tasker, ui, workflow, registry, integrations e runtime.

## Relação entre documentação, contrato e código
A documentação é a fonte da verdade. Nenhuma linha de código deve ser escrita sem uma task em Markdown e um contrato estabelecido.
