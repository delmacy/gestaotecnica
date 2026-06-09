# Capability — inventory

## Core business
Controlar itens, locais, lotes e movimentos de estoque.

## Contrato resumido
| Campo | Valor |
|---|---|
| Categoria | resource |
| Entidades principais | Item, StockLocation, InventoryMovement, Lot |
| Estados principais | available, reserved, low_stock, expired |
| Processos principais | receive stock; reserve; issue; reconcile |
| Relações | work_orders, procurement, audit |
| Estado documental | review; ainda não autoriza implementação |

## Exemplo genérico
Uma peça é reservada e baixada por ordem.

## Fora de escopo
Especialização setorial, detalhes de cliente, implementação técnica e absorção silenciosa das capabilities relacionadas.

## Critérios de aceite
Fronteira compreensível; entidades e estados coerentes; processos e eventos rastreáveis; regras e UI revisadas; relações e gaps declarados.
