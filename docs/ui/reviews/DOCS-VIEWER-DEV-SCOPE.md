# Docs Viewer Dev Scope

## 1. Objetivo do Desenvolvimento Permitido
Implementar a interface visual navegável para o Docs Viewer usando exclusivamente renderização client-side acoplada a um índice estático mockado.

## 2. Arquivos Candidatos Prováveis
- `src/app/(builder)/builder/docs/page.tsx`
- `src/components/builder/docs/DocsViewer.tsx`
- `src/components/builder/docs/DocsItemCard.tsx`
- `src/components/builder/docs/DocsDetailPanel.tsx`
- `src/components/builder/docs/DocsFilters.tsx`
- `src/components/builder/docs/docs-data.ts`
- `src/components/builder/docs/docs-types.ts`

## 3. Componentes Candidatos
- Container principal (DocsViewer).
- Cards de documentos e lista.
- Painel de filtro e busca de texto.
- Painel lateral de detalhe do doc selecionado.
- Badges e tipografia utilitária.

## 4. Dados Mock/Static Index Permitidos
Dados estruturados em `docs-data.ts` que implementem os tipos especificados no contrato (DocsItem, categoria, path, relações de outros artefatos do repositório).

## 5. Dados Proibidos
- Chamadas para `fs.readFileSync` no front-end ou api para obter conteúdo dinâmico em tempo de execução.
- Banco de dados (`Drizzle/Prisma`).

## 6. Regras Visuais Obrigatórias
- Aviso explícito: "Docs Viewer is read-only and uses static mock index".
- Diferenciação visual para categorias de docs.

## 7. Regras de Interação Read-Only
- Selecionar item.
- Mostrar detalhes.
- Interações de input limitadas a filtrar a visualização da listagem de cards. Nenhuma edição nos metadados ou conteúdo do card é permitida.

## 8. Critérios de Aceite
- Rota `/builder/docs` renderiza perfeitamente no Builder Shell.
- Busca e filtros operam perfeitamente sobre o array mockado no `docs-data.ts`.
- Painel de detalhe reflete os dados corretos do card clicado.
- Nenhuma dependência não aprovada foi incluída.

## 9. Testes Esperados
- Testes unitários para a busca/filtro (se isolada) ou apenas validação de lint e build no projeto, conforme aplicável no contexto MVP client-side.

## 10. Gatilhos de Parada
- Se, por acaso, um requisito sugerir ou forçar integração para ler o markdown usando bibliotecas de node no browser, interrompa e simule os metadados.
- Se for pedida implementação de login verdadeiro no NextAuth para exibir as docs.