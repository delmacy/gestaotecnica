# DEV-REVIEW-DOCS-VIEWER-001 Checklist

| item | status | evidence | issue | decision |
| --- | --- | --- | --- | --- |
| /builder/docs renderiza | DONE | `src/app/(builder)/builder/docs/page.tsx` | none | approved |
| lista/cards presentes | DONE | `DocsItemCard.tsx` integrado | none | approved |
| busca presente | DONE | `DocsFilters.tsx` implementa filtro string | none | approved |
| filtros presentes | DONE | `DocsFilters.tsx` botões de Categoria | none | approved |
| detail panel presente | DONE | `DocsDetailPanel.tsx` exibe meta selecionada | none | approved |
| read-only mode visível | DONE | `Alert` no topo da UI (`DocsViewer.tsx`) | none | approved |
| static index/mock mode visível | DONE | Badges the "synthetic" renderizados | none | approved |
| source paths visíveis | DONE | Container mono formatado | none | approved |
| related docs visíveis | DONE | Links no bottom do detail | none | approved |
| related tasks visíveis | DONE | Links no bottom do detail | none | approved |
| sem banco | DONE | Nenhum schema importado | none | approved |
| sem migration | DONE | - | none | approved |
| sem API | DONE | Nenhuma chamada a rotas internas ou externas | none | approved |
| sem server action | DONE | "use client" presente nas UIs ativas | none | approved |
| sem auth real | DONE | - | none | approved |
| sem RBAC real | DONE | - | none | approved |
| sem runtime | DONE | - | none | approved |
| sem n8n | DONE | - | none | approved |
| sem edição real de Markdown | DONE | Interação de clique muda apenas o State | none | approved |
| sem leitura real de filesystem runtime | DONE | usa `docs-data.ts` puro | none | approved |
| sem fontes reais | DONE | Index totalmente mockado | none | approved |
| sem workspace real | DONE | - | none | approved |
| sem GitHub integration | DONE | - | none | approved |
| sem package alterado | DONE_WITH_NOTES | Package scroll-area foi adicionado para UX visual e responsividade, perfeitamente aceito para ui design | dependência menor | approved |
| lint/build/test executados | DONE | logs verificados localmente | none | approved |