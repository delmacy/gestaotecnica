# Parity Matrix - Capability Explorer

Esta matriz mapeia os requisitos do contrato do Capability Explorer garantindo a paridade com o que será implementado ou mockado na fase de desenvolvimento inicial da UI.

| requirement | source_document | ui_representation | mock_data_needed | status | gap | next_action |
|---|---|---|---|---|---|---|
| exibir catálogo de capabilities | CAPABILITY_REGISTRY.md | Lista/Grid de Cards | Mock `CapabilityItem[]` completo | pending | UI a desenvolver | Desenvolver grid/list em DEV |
| exibir MVP Capability Core | CAP-VAL-001_BOUNDARY_REVIEW | Badge visual de "MVP Core" ou "Critical" | Prop `mvp_priority` | pending | UI a desenvolver | Inserir campo no Mock Data do DEV |
| exibir complementares/futuras | CAP-VAL-001_BOUNDARY_REVIEW | Cards com visual inativo/acinzentado | Prop `status` (future/blocked) | pending | UI a desenvolver | Tratar estado visual desabilitado em DEV |
| filtrar por categoria | CAPABILITY_TAXONOMY.md | Componente de Filtro Lateral/Topo | Enum `CapabilityCategory` | pending | UI a desenvolver | Criar filtros dinâmicos no DEV |
| filtrar por prioridade | CAPABILITY_EXPLORER.md | Componente de Filtro Lateral/Topo | Enum `CapabilityMvpPriority` | pending | UI a desenvolver | Criar filtros dinâmicos no DEV |
| buscar por nome | CAPABILITY_EXPLORER.md | Barra de busca textual | Algoritmo de filtragem client-side | pending | UI a desenvolver | Implementar `useState` de busca |
| abrir detalhe | CAPABILITY_EXPLORER.md | Drawer Lateral (Painel Direito) | Idem ao catalog | pending | UI a desenvolver | Criar overlay/drawer no DEV |
| exibir depends_on | DEPENDENCY_RULES.md | Seção "Dependências" no Drawer | Array `depends_on: string[]` | pending | UI a desenvolver | Exibir lista de slugs |
| exibir used_by | DEPENDENCY_RULES.md | Seção "Usado Por" no Drawer | Array `used_by: string[]` | pending | UI a desenvolver | Exibir lista de slugs |
| exibir owns_entities | UNIVERSAL_ENTITY_MODEL.md | Lista de entidades próprias | Array `owns_entities: string[]` | pending | UI a desenvolver | Integrar texto ao Drawer |
| exibir does_not_own | UNIVERSAL_ENTITY_MODEL.md | Lista de dependências externas | Array `does_not_own: string[]` | pending | UI a desenvolver | Integrar texto ao Drawer |
| exibir boundary_risk | CAP-VAL-001_BOUNDARY_REVIEW | Bloco de aviso amarelo no Drawer | Array `boundary_risk: Object[]` | pending | UI a desenvolver | Desenvolver Callout customizado |
| exibir links documentais | CAPABILITY_REGISTRY.md | Links clicáveis no final do Drawer | Array `related_docs: Object[]` | pending | UI a desenvolver | Renderizar links tag |
| simular request install | CAPABILITY_EXPLORER_INTERACTION_RULES.md | Botão CTA "Request Install" | Estado em React (`install_state`) | pending | UI a desenvolver | Implementar evento simulado |
| não instalar de verdade | CAPABILITY_EXPLORER_BOUNDARIES.md | Ausência de chamadas à API de persistência | N/A | enforced | Nenhuma ação no BD | Auditar código do DEV depois |
| não editar registry | CAPABILITY_EXPLORER_BOUNDARIES.md | Ausência de inputs/forms de edição | N/A | enforced | Funcionalidade bloqueada | Auditar código do DEV depois |
| não depender de banco | DEC-SB-001.md | Utilização apenas de data layer hardcoded | Arquivo TS de Mock isolado | enforced | Sem Drizzle/Postgres | Auditar código do DEV depois |
| não depender de runtime | DEC-SB-001.md | Não criar rotas /builder/runtime ou rotas API reais | N/A | enforced | Somente rotas static/UI | Auditar código do DEV depois |
| não depender de fontes reais | DEC-SB-001.md | Nomes universais (organization, people) | Utilizar Taxonomy oficial | enforced | Dados sintéticos apenas | Validar Nomes no PR do DEV |
