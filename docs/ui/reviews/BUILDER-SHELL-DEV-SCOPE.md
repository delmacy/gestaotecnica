# DEV-BUILDER-SHELL-001 - Dev Scope

## 1. Objetivo do desenvolvimento permitido
Implementar a estrutura visual fundamental (Shell) do System Builder, fornecendo layout global, sistema de navegação base e containers para os futuros módulos operacionais. Esta etapa não constrói lógicas de negócio ou persistência; o foco é estabelecer a UI inicial sob dados sintéticos.

## 2. Arquivos candidatos prováveis
*Nota: Esta lista sugere possíveis caminhos para o desenvolvimento da plataforma atual (ex. Next.js). Jules Dev deve adequá-la à estrutura real do repositório.*

- `src/app/builder/layout.tsx` (Layout principal do Shell)
- `src/app/builder/page.tsx` (Dashboard/Home mockado)
- Componentes da interface (`src/components/shell/...`)
- Constantes ou fixtures para dados sintéticos (`src/lib/mocks/shell-data.ts`)

## 3. Componentes candidatos
- `ShellLayout`
- `TopBar`
- `SidebarNavigation`
- `WorkspaceSelector`
- `SyntheticModeIndicator`
- `Breadcrumbs`

## 4. Rotas candidatas
- `/builder`
- `/builder/tasker` (Apenas página com estado "Coming Soon" ou "Mock")
- `/builder/capabilities` (Apenas página placeholder)
- `/builder/registry` (Apenas página placeholder)
- `/builder/process-mirroring` (Apenas página placeholder)
- `/builder/docs` (Apenas página placeholder)
- `/builder/ui-contracts` (Apenas página placeholder)
- `/builder/settings` (Apenas página placeholder)

## 5. Dados permitidos
- Dados sintéticos criados em escopo local (`const user = { name: "Builder Architect" }`).
- Lista estática de workspaces para o seletor.
- Links hardcoded de navegação.

## 6. Dados proibidos
- Consultas diretas ao banco de dados real via Drizzle/ORM para o Shell base.
- Chamadas para API Gateway não implementadas.
- Qualquer dado de origem da "Gestão Técnica" real.

## 7. Regras visuais obrigatórias
- **Indicador de Modo Sintético:** Presença de um banner ou badge permanente, perfeitamente visível, sinalizando "Dados Sintéticos" ou "Modo Simulado" (Synthetic Mode).
- **Módulos Disabled:** Os módulos previstos como futuros (Runtime, Form Builder, etc.) devem ser exibidos na UI (ex. na sidebar), porém como inativos/desabilitados.
- **Hierarquia:** A Topbar e a Sidebar devem persistir ao longo da navegação das rotas filhas no `Main Content Area`.

## 8. Critérios de aceite
- O usuário deve conseguir acessar a rota `/builder` e ver a estrutura principal (Topbar e Sidebar).
- O alerta de modo sintético deve estar visível e claro em todas as telas sob `/builder`.
- O menu de navegação lateral deve apresentar os módulos do Grupo A ativos.
- O menu de navegação lateral deve apresentar os módulos Futuros desabilitados.
- A navegação pelas rotas candidatas (ex: `/builder/tasker`) deve ocorrer sem recarregar totalmente a página (transição SPA).

## 9. Testes esperados
- Teste E2E (Playwright, caso já configurado): Confirmar renderização do `ShellLayout`, presença do indicador de "Modo Sintético" e funcionalidade básica de roteamento/transição na sidebar (verificar o URL modificado). Não é necessário E2E completo sem banco.

## 10. Gatilhos de parada
Se houver dependência bloqueante de qualquer um dos itens listados na seção "Limites" ou "Dados proibidos" (banco real, auth real, schemas do client real), pare o desenvolvimento e atualize o Board, pois a construção do Shell base deve ser auto-contida nesta iteração.