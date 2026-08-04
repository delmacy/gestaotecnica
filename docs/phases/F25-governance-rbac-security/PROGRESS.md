# Progresso — F25 Governance, RBAC & Security

Atualizado em: 2026-08-04
Estado da fase: `planned`
Task atual: —

## Resumo

Há autenticação, access profiles, approvals e auditoria distribuídos pelo repositório, mas ainda sem inventário único que prove o modelo de autorização completo.

## Bloqueios

- F22 não validada;
- roles de plataforma e membership roles ainda precisam ser reconciliadas;
- enforcement não foi inventariado em todas as APIs e server actions;
- relação entre approvals existentes e policy engine proposta precisa ser definida.

## Próximo passo

Criar inventário de autorização e threat model; em seguida ajustar e liberar `SB-GV-01`.
