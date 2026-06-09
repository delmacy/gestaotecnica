# Alpha Routing Policy

## Decisão
Foi escolhida a Opção A: **Workspace ativo por contexto**.

## Justificativa
O AppShell atual já trabalha com seleção de contexto na interface sem forçar o ID do workspace na URL. Isso mantém a estabilidade das rotas e simplifica o MVP e o Alpha.

## Rotas Padrão
As funcionalidades estarão disponíveis em rotas raízes relativas à área autenticada, baseando-se no workspace armazenado no contexto:
- `/candidates`
- `/inbox`
- `/observations`
- `/procedures`
- `/changes`
- `/improvements`
- `/dashboard`
- `/admin/gateway`
- `/admin/agents`
- `/admin/security`

As implementações de UI nas Fases Alpha devem respeitar esse padrão.
