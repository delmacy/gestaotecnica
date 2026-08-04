# UX-NAV-04 — Builder Identity and Durable Workspace Selection

Status: `in_progress`

## Objetivo

Unificar identidade autenticada do Builder, portfólio de organizações/workspaces e seleção durável de workspace entre Builder, admin e runtime.

## Resultado de produto

O usuário vê somente workspaces em que possui membership, seleciona um deles, recarrega a aplicação e mantém o mesmo contexto autorizado em todas as áreas.

## Entrega concluída

`UX-NAV-04-001` criou a fundação de banco e use cases para `builder.workspace_selections`, organização probe, três workspaces, membership e seleção persistida.

## Escopo restante

- resolver usuário pela sessão;
- expor identidade e portfólio por API/use case autorizado;
- persistir seleção por ação do servidor;
- propagar o workspace selecionado para Builder, admin e runtime;
- criar UI de troca e feedback de estados;
- provar recarregamento e rejeição de workspace sem membership.

## Regra de autoridade

PostgreSQL é a fonte de verdade da seleção. Cookie pode identificar sessão e `localStorage` pode otimizar UI, mas nenhum deles concede membership ou substitui a seleção validada no servidor.

## Definição de pronto

O mesmo usuário seleciona qualquer um dos três workspaces autorizados, recarrega Builder/admin/runtime e mantém o contexto; tentativa de selecionar workspace não autorizado falha e gera evidência auditável.
