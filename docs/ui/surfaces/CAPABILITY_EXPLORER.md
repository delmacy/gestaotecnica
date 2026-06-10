# Capability Explorer Contract

- **surface_id:** `UI-SURF-CAPABILITY-EXPLORER`
- **surface_name:** Capability Explorer
- **purpose:** A superfície para explorar, filtrar e entender o catálogo universal de capabilities do System Builder.
- **persona:** Platform Admin / Workspace Admin
- **route_candidate:** `/builder/capabilities`
- **scope:** Visualização de capabilities disponíveis, suas dependências e documentação associada. Não implementa a instalação real no runtime neste momento.
- **workspace_or_global:** Global (com visualização específica de workspace para instalação).
- **related_capabilities:** `organization` (para gerir workspaces)
- **data_inputs:** Filtros de pesquisa por nome, categoria ou status.
- **data_outputs:** Solicitações de "instalação" (simuladas por agora) ou navegação para detalhes.
- **commands:** Pesquisar, Filtrar, Ver Detalhes, Solicitar Instalação.
- **empty_state:** "Nenhuma capability encontrada para o filtro especificado."
- **loading_state:** Skeleton loaders para os cards de capability.
- **error_state:** Mensagem amigável de erro ao falhar o carregamento do catálogo com botão "Tentar novamente".
- **success_state:** Lista ou grid de cards de capabilities renderizada corretamente.
- **permissions:** Acesso restrito a administradores.
- **audit_events:** `capability.viewed`, `capability.installation_requested`
- **evidence_required:** Nenhuma para visualização.
- **frontend_risks:** Risco de confusão entre o estado "disponível no catálogo global" vs "instalado no workspace atual".
- **e2e_test_expectation:** O Platform Admin acessa o explorer, busca por 'requests', visualiza que faz parte do 'MVP Capability Core' e verifica suas dependências.
- **implementation_status:** `documented`

## O que esta superfície NÃO É:

O Capability Explorer **NÃO** é ainda:
- um instalador real de capabilities;
- um registry editor;
- um runtime configurator;
- um workspace provisioner;
- um gerador de código;
- um catálogo específico da Gestão Técnica.
