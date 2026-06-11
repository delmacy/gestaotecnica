# Registry View Dev Scope

## 1. Objetivo do desenvolvimento permitido
Implementar a superfície `/builder/registry` como uma visão read-only do catálogo de capabilities e suas dependências. O desenvolvimento deve focar apenas em UI estática consumindo dados sintéticos locais (mock data).

## 2. Arquivos candidatos prováveis
- `src/app/(builder)/builder/registry/page.tsx`
- `src/components/builder/registry/RegistryView.tsx`
- `src/components/builder/registry/RegistryItemCard.tsx`
- `src/components/builder/registry/RegistryDetailPanel.tsx`
- `src/components/builder/registry/RegistryFilters.tsx`
- `src/components/builder/registry/registry-data.ts`
- `src/components/builder/registry/registry-types.ts`

## 3. Componentes candidatos
- UI base (cards, lista, painel).
- Busca e Filtros (text search e type/status dropdowns).
- Badges e representações visuais de risco.

## 4. Dados mockados permitidos
- Capacidades estruturadas (Capability Index, Capability Model, Dependency Rules).
- Links fictícios ou referências a arquivos Markdown existentes.
- Status e níveis de risco simulados.

## 5. Dados proibidos
- Consultas ao banco de dados PostgreSQL real.
- Consultas reais a arquivos Markdown via Node `fs` (tudo deve ser mock inline).
- Auth/User data real (usar mocks se necessário).

## 6. Regras visuais obrigatórias
- Layout Master-Detail.
- Aviso claro de "Mock Mode" e "Read-Only".

## 7. Regras de interação simuladas/read-only
- Navegação entre itens altera o item selecionado no state local, abrindo o painel detalhe.
- Nenhuma ação de save, delete ou install.

## 8. Critérios de aceite
- A página carrega sem erros.
- A lista de mock data é renderizada.
- O clique em um card abre detalhes com dependências.
- Filtros e buscas funcionam no array em memória.

## 9. Testes esperados
- Build TypeScript sem erros.
- Lint aprovado.
- (Opcional, mas recomendado) Snapshot ou smoke test unitário renderizando o componente principal.

## 10. Gatilhos de parada
- Necessidade de adicionar pacotes pesados de grafos (usar apenas representação textual/lista para dependências por enquanto).
- Qualquer bloqueio exigindo banco de dados.
