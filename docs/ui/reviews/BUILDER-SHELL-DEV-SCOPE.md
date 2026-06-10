# Builder Shell Dev Scope

## 1. Objetivo do desenvolvimento permitido
Prover a infraestrutura visual (layout global) para o System Builder Platform, estabelecendo a navegação entre submódulos base, independentemente de integrações reais de backend estarem concluídas.

## 2. Arquivos candidatos prováveis
- `src/app/builder/layout.tsx`
- `src/app/builder/page.tsx`
- `src/components/shell/Sidebar.tsx`
- `src/components/shell/Topbar.tsx`

## 3. Componentes candidatos
- Estrutura de Menu/Navegação
- Breadcrumbs Dinâmicos
- Workspace Selector (UI)
- User Profile/Auth State Dropdown (UI simulada)
- System Mode/Status Badges

## 4. Rotas candidatas
- `/builder`
- `/builder/tasker` (placeholder/layout apenas se a stack permitir sem dependências da view do tasker)
- `/builder/capabilities` (placeholder)

## 5. Dados permitidos
- Uso explícito de mock data para navegação e estado de usuário (ex: sessão persistente estática para Platform Admin).
- Mock de lista de workspaces ou contexto de tenant.
- Dados estáticos para renderizar a sidebar e menus de módulos.

## 6. Dados proibidos
- Integração real com banco de dados para estado de layout no primeiro PR.
- Integração de autenticação complexa (ex: fluxos JWT completos, OAuth providers externos não configurados globalmente em fixture).
- API Routes ou integrações reais de Runtime ou API Gateway.
- Permissões definitivas reais usando banco (RBAC técnico complexo).

## 7. Regras visuais obrigatórias
- **Top Bar:** Com indicador claro de Workspace Context e Status (ex: "Sintético/Demo").
- **Sidebar:** Deve renderizar módulos futuros em estado *disabled* (Workflow Builder, Form Builder, etc).
- **Conteúdo Principal:** Deve preparar um slot `<main>` estruturado para injetar as views dos módulos.

## 8. Critérios de aceite
- O dev cria o layout sem causar falhas no build do Next.js.
- O componente Layout é agnóstico a banco de dados.
- Ao rodar a aplicação, o usuário vê o Shell estático e navega (ainda que de forma placeholder) pelas rotas do Grupo A.
- Um indicador explícito de "Synthetic Mode" ou "Demo" está visível no Shell.

## 9. Testes esperados
- Teste unitário para componentes de menu/breadcrumbs demonstrando a estrutura correta (ex: verificar presença de módulos disabled vs enabled).

## 10. Gatilhos de parada
Se, durante o desenvolvimento:
- Houver exigência imprevista de chamadas reais ao banco em componentes de servidor de layout que bloqueie renderização base.
- Houver necessidade de capturar fontes reais de um cliente piloto.
- A configuração do n8n, API Gateway ou auth layer de produção for um impeditivo técnico para o render.
**Ação:** O Dev deve interromper o progresso no requisito técnico e relatar em Review, optando sempre por dados mockados.