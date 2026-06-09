# Phase 27C - Layout Shell Compatível com Páginas e Backend

## Objetivo

Implementar uma camada visual de navegação para o System Builder / Gestão Técnica sem alterar contratos de backend, actions, services, rotas dinâmicas ou schemas de banco.

A fase 27C não substitui o funcionamento da fase 27B. Ela cria uma estrutura de layout compatível com as páginas já existentes e preserva telas que precisam de composição própria, como o Builder em tela cheia.

## Diagnóstico da Fase 27B

A fase 27B está implementada no repositório em três frentes principais:

- Documento de fase em `docs/phases/PHASE_27B.md`.
- Scripts declarados em `package.json`:
  - `db:seed:golden-e2e`
  - `db:seed:golden-e2e:clean`
  - `test:golden-e2e`
- Arquivos reais de execução:
  - `src/scripts/golden-e2e/seed.ts`
  - `src/scripts/golden-e2e/clean.ts`
  - `tests/integration/golden-cycle.test.ts`

A validação encontrada confirma que a 27B deixou uma base canônica para seed, cleanup, isolamento de workspace e teste ponta a ponta do ciclo candidato -> publicação -> instância -> avanço de estados.

## Alterações Implementadas

### 1. Novo AppShell global

Arquivo criado:

```txt
src/components/layout/AppShell.tsx
```

O componente adiciona:

- Sidebar desktop para navegação estrutural.
- Navegação horizontal responsiva em telas menores.
- Agrupamento por domínio:
  - Operação
  - System Builder
  - Gestão Técnica
  - Governança
- Detecção de rota ativa via `usePathname`.
- Uso dos tokens visuais já existentes em `globals.css`, como `background`, `foreground`, `sidebar`, `primary`, `muted`, `border` e `card`.

### 2. Integração com RootLayout

Arquivo alterado:

```txt
src/app/layout.tsx
```

O `RootLayout` agora envolve o conteúdo com:

```tsx
<AppShell>{children}</AppShell>
```

Isso mantém a estrutura do App Router do Next.js e evita mudanças em cada página isolada.

### 3. Compatibilidade com páginas especiais

O `AppShell` preserva layout bruto para rotas que não devem receber shell global:

```txt
/auth
/builder
/api-docs
```

Motivo:

- `/auth`: telas de login/setup devem permanecer limpas e sem navegação operacional.
- `/builder`: o Builder usa `BuilderLayout` próprio em tela cheia, com canvas, painéis laterais e preview. Envolver essa rota em outro shell quebraria espaço útil e composição visual.
- `/api-docs`: documentação Swagger costuma exigir tela própria e largura livre.

## Compatibilidade com Backend

Nenhuma alteração foi feita em:

- schemas Drizzle;
- queries;
- services;
- server actions;
- endpoints;
- runtime engine;
- seed/cleanup da fase 27B;
- teste `golden-cycle`.

A fase 27C é uma camada de apresentação e navegação. Portanto, o backend permanece compatível com a implementação anterior.

## Rotas Navegadas no Shell

O shell aponta para páginas já existentes no repositório, incluindo:

- `/`
- `/work-items`
- `/service-orders`
- `/schedules`
- `/assets`
- `/workforce`
- `/builder`
- `/candidates`
- `/workspace-config`
- `/skills`
- `/search`
- `/operations`
- `/planning`
- `/maintenance-plans`
- `/inventory`
- `/documents`
- `/reports`
- `/admin`
- `/admin/users`
- `/admin/workspaces`
- `/admin/workflows`
- `/compliance`

## Decisões Técnicas

### Por que não alterar todas as páginas agora?

As páginas existentes têm padrões mistos de espaçamento (`p-6`, `p-8`, `h-screen`, `h-[calc(...)]`). Alterar tudo de uma vez aumentaria risco de regressão visual e quebraria fluxos que ainda dependem de dimensões específicas.

A 27C cria uma base segura: navegação e shell primeiro, refatoração fina de páginas depois.

### Por que usar exceção para o Builder?

O Builder já é uma aplicação dentro da aplicação. Ele tem:

- header próprio;
- modo Builder/Preview;
- canvas central;
- painel de blocos;
- painel inspetor;
- painel de validação;
- ações de draft e publicação.

Por isso, ele continua em tela cheia e acessível pelo menu, sem ser embrulhado pelo shell global.

## Critérios de Aceite

- O projeto possui shell visual global para páginas operacionais.
- O Builder mantém tela cheia e funcionamento independente.
- Login/setup não recebem navegação indevida.
- A documentação Swagger não é comprimida pelo shell.
- Nenhuma camada de backend foi alterada.
- A fase 27B permanece rastreável e não foi sobrescrita.

## Próxima Fase Recomendada

### Phase 27D - Normalização Visual de Páginas

Refatorar gradualmente as páginas para um padrão único:

- `PageHeader`
- `PageSection`
- `MetricCard`
- `EmptyState`
- `DataToolbar`
- `StatusBadge`
- `ResponsiveDataGrid`

Essa fase deve tratar cada família de página separadamente, começando por:

1. Dashboard e operação.
2. Work items e service orders.
3. Administração.
4. Builder candidates.
5. Runtime dinâmico.

## Decisão Final

APROVADO COMO FASE 27C DE COMPATIBILIDADE VISUAL.
