# F22 — Multi-tenant & Workspace Foundation

Status: `blocked`

## Objetivo

Transformar o isolamento corrigido na F21 em uma fundação completa de identidade, membership, configuração, onboarding e ciclo de vida de workspaces.

## Resultado de produto

Usuários autenticados acessam somente workspaces autorizados, selecionam um workspace persistido no servidor e operam configurações e membros sem vazamento entre tenants.

## Escopo incluído

- suíte de isolamento multi-tenant;
- configurações de workspace;
- membership, convites e roles básicas;
- seleção durável de workspace;
- onboarding, feature flags, seed e lifecycle do tenant;
- exportação/importação escopada.

## Fora de escopo

- engine de Process Mirroring;
- catálogo funcional completo de capabilities;
- políticas avançadas de RBAC/SoD;
- federação entre instâncias.

## Dependências e gates

- F21 validada;
- UX-NAV-04 reconciliada como fundação da seleção durável;
- decisão formal sobre RLS e contexto do servidor.

## Regra de reutilização

A task de workspace switcher deve estender `builder.workspace_selections` e os use cases da UX-NAV-04. Cookie ou `localStorage` não podem substituir o PostgreSQL como fonte de verdade.

## Definição de pronto

Dois tenants provisionados passam por testes positivos e negativos de identidade, membership, leitura, escrita, exportação e desativação sem acesso cruzado.
