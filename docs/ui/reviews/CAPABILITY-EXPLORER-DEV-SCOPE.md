# Capability Explorer - Limites e Escopo de Desenvolvimento

Este documento define os limites de escopo e os requisitos aceitos para a task `DEV-CAPABILITY-EXPLORER-001`, autorizada via `DEV-READINESS-CAPABILITY-EXPLORER-001` com status **READY_FOR_DEV_WITH_LIMITS**.

## 1. Objetivo do desenvolvimento permitido
Implementar a interface do **Capability Explorer** na rota `/builder/capabilities` para navegação, busca, filtragem e simulação de ativação de capabilities a partir de um catálogo fixo mockado, provando os conceitos de UI sem conexões de banco de dados ou runtime.

## 2. Arquivos candidatos prováveis
- `src/app/(builder)/builder/capabilities/page.tsx`
- `src/components/builder/capabilities/CapabilityExplorer.tsx`
- `src/components/builder/capabilities/CapabilityCard.tsx`
- `src/components/builder/capabilities/CapabilityDetailPanel.tsx`
- `src/components/builder/capabilities/CapabilityFilters.tsx`
- `src/components/builder/capabilities/capability-data.ts`
- `src/components/builder/capabilities/capability-types.ts`

## 3. Componentes candidatos
- **Filtros e Busca:** Componente de topo/lateral com barra de busca e seletores (Select/Dropdown).
- **Lista/Grid:** Renderizador principal da lista de capabilities utilizando cards.
- **Card de Capability:** Apresentando título, descrição curta, status, prioridade (MVP Core) e categoria.
- **Painel de Detalhes:** Drawer lateral ou Modal expandido com as listas de `depends_on`, `used_by`, `owns_entities`, riscos (`boundary_risk`) e links documentais.

## 4. Dados mockados permitidos
Toda a listagem de capacidades deve ser lida a partir de um array fixo exportado em `capability-data.ts`. Este mock deve refletir a tipagem estipulada em `CAPABILITY_EXPLORER_MOCK_DATA_CONTRACT.md`.

## 5. Dados proibidos
- Integração Drizzle ORM ou qualquer tabela de banco (ex: `SELECT * FROM capabilities`).
- Geração real de módulos (Registry Edition / Versioning).
- Auth/RBAC real vinculado a contas/banco.
- Alteração no workspace real de clientes (Gestão Técnica).
- Fontes Reais anonimizadas ou PIIs.

## 6. Regras visuais obrigatórias
- Diferenciar visualmente capacidades que são do "MVP Capability Core" (`mvp_priority: critical/high`).
- Apresentar as categorias com ícones ou badges (`foundation`, `work-management`, etc).
- Diferenciar os status com cores (ex: `future` inativo/cinza, `documented` pronto/verde).
- Exibir alertas amarelos para `boundary_risk` no painel de detalhes.

## 7. Regras de interação simuladas
- A ação de **"Request Install"** ou **"Enable"** deve ser mantida apenas no estado local (`useState` ou similar) alterando a chave `install_state` para `simulated_requested` naquele momento.
- Se uma capability possuir o status de `future` ou `blocked`, o botão de request deve ficar oculto ou `disabled`.
- O clique nos links documentais pode direcionar para links fictícios internos (ex: `href="#"` ou rotas neutras).

## 8. Critérios de aceite
- O app compila sem erros TypeScript no build do Next.js.
- A tela responde adequadamente à busca textual pelo slug/nome.
- Os filtros reduzem a lista corretamente na UI.
- O Drawer lateral funciona em mobile e desktop para exibir os detalhes.
- O mock obedece aos contratos definidos.

## 9. Testes esperados
- Teste básico E2E com Playwright em `/builder/capabilities` verificando a presença de "requests" e o funcionamento da busca textual.
- Unit Test opcional para as funções de filtro local de array, se aplicável.

## 10. Gatilhos de parada
Se houver indícios de necessidade de banco de dados, auth real, persistência, alteração real de workspace, edição real de arquivos markdown dinamicamente, interrompa e comunique através de comentário, NÃO implemente APIs reais para esta superfície nesta fase.