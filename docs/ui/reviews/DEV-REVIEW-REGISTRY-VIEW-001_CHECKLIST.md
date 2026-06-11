# DEV-REVIEW-REGISTRY-VIEW-001 Checklist

| item | status | evidence | issue | decision |
|---|---|---|---|---|
| `/builder/registry` renderiza | DONE | Verificado no run build | - | Pass |
| lista/tabela presente | DONE | `RegistryItemCard` integrado | - | Pass |
| busca presente | DONE | `RegistryFilters` tem text input | - | Pass |
| filtros presentes | DONE | Dropdowns de status/type ok | - | Pass |
| detail panel presente | DONE | `RegistryDetailPanel` implementado | - | Pass |
| read-only mode visível | DONE | Badge fixo no header | - | Pass |
| mock mode visível | DONE | Badge de "Mock Mode" no header | - | Pass |
| source docs visíveis | DONE | Campo em detail panel | - | Pass |
| dependency rules visíveis | DONE | Seção "Dependencies" e Rules | - | Pass |
| sem banco | DONE | Source inspection ok | - | Pass |
| sem migration | DONE | Source inspection ok | - | Pass |
| sem API | DONE | Source inspection ok | - | Pass |
| sem server action | DONE | Nenhuma function exportada de acoes | - | Pass |
| sem auth real | DONE | Omitido do componente | - | Pass |
| sem RBAC real | DONE | Omitido do componente | - | Pass |
| sem runtime | DONE | Omitido do componente | - | Pass |
| sem n8n | DONE | Omitido do componente | - | Pass |
| sem edição real de Markdown | DONE | Source inspection ok | - | Pass |
| sem fontes reais | DONE | `synthetic: true` nos dados | - | Pass |
| sem workspace real | DONE | Omitido do componente | - | Pass |
| sem package alterado | DONE | `package.json` intacto | - | Pass |
| lint/build/test executados | DONE | Output de cli salvo no report | - | Pass |
