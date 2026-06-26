# Boundaries: Approval Workflow Module

## Propósito
Prover um domínio universal para solicitações de aprovação, permitindo que qualquer objeto do sistema seja submetido a um fluxo de decisão (aprovar/rejeitar) com rastreabilidade completa e isolamento de workspace.

## Escopo Autorizado
- Gestão de solicitações de aprovação (Approval Requests).
- Suporte a tipos de objetos permitidos: `service_order`, `work_item`, `document`, `asset`.
- Validação de existência e workspace do objeto submetido.
- Máquina de estados: `pending` -> `approved` / `rejected` / `cancelled`.
- Histórico append-only de eventos por workspace.
- UI para fila de pendências e análise detalhada.

## Proibições e Limites
- **Auto-aprovação:** O solicitante não pode aprovar a própria solicitação.
- **Cross-tenant:** Não é permitido ler ou decidir sobre solicitações de outros workspaces.
- **Idempotência:** Não são permitidas múltiplas solicitações `pending` para o mesmo objeto no mesmo workspace.
- **Atomicidade:** Transições de estado devem confirmar o status `pending` antes da mutação.
- **Persistence:** Uso transitório da tabela `builder.process_candidates` com `origin = 'approval'`.

## Isolamento
- O módulo reside em `src/modules/approvals/`.
- Depende de `src/platform/` para infraestrutura de ações e eventos.
- Não altera o núcleo de `service-orders` ou outros módulos de negócio.
