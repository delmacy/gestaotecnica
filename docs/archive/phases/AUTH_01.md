# AUTH-01 — Authentication and Access Profiles Stabilization

## Objetivo
Corrigir e estabilizar a autenticação do System Builder, criando três perfis claros de login/acesso: builder, admin e operador.

## Domínio / DDD
Bounded Context: Identity and Access Context
Ubiquitous Language: User, Auth Account, Auth Session, Access Profile, Platform Builder Admin, Organization Admin, Organization Operator
Aggregate/Entity principal: User, AuthSession
Value Object: AccessProfile

## Escopo permitido
Alteração em módulo de auth, actions, cookies, e inserção do accessProfile na tabela users.

## Fora de escopo
NextAuth/Auth.js, OAuth, permissões granulares/RBAC, SSO.

## Perfis canônicos
- builder
- admin
- operador

## Rotas e permissões
- Public: `/auth/*`
- Builder-only: `/admin`, `/builder`, etc
- Admin organization: `/operations`, etc
- Operador: `/operations`, etc

## Execução 001 — Jules Dev — 2026-06-08
Status: Concluída
Arquivos criados: `src/modules/auth/access-profiles.ts`, `src/modules/auth/authorization.ts`, `docs/phases/AUTH_01.md`, tests
Arquivos alterados: `src/db/legacy/schema.ts`, `src/modules/auth/actions.ts`, `src/proxy.ts`, `src/app/admin/page.tsx`, `src/app/operations/page.tsx`, `src/app/(builder)/builder/page.tsx`
Comandos executados: `db:generate`, `db:push`, lint, build, test:unit, test:integration, playwright.
Resultado do lint: Passou com warnings não relacionados
Resultado do build: Sucesso
Resultado dos testes: Sucesso
Bloqueios: Nenhum
Observações: Modificação em testes de integração para evitar timeout de DB no ambiente runner.

Frontend impact:
- Área afetada: Login e Roteamento
- Rota(s): `/auth/login`, `/admin`, `/operations`
- Usuário/persona: builder, admin, operador
- Workspace/global: Todos
- Estados cobertos: Acesso logado, não logado, e acessos negados por perfil
- Teste visual/E2E: E2E Playwright de credenciais inválidas incluído e passado
- Gap frontend pendente: O menu lateral ainda não se oculta de acordo com o perfil por estar restrito a client side (layout/appshell). Depende de ações/guards nas pages.

Decisão: Fase 30B pausada temporariamente para focar nessa estabilização fundamental.
