# Enterprise Map Contract

- **surface_id:** UI-SURF-ENT-MAP
- **surface_name:** Enterprise Map
- **purpose:** Criar uma superfície visual para representar, em modo sintético: domínios organizacionais, capabilities, processos, value streams, sistemas, aplicações, dados, documentos, papéis, responsáveis abstratos, integrações futuras, dependências, riscos, gaps, evidências e relações entre elementos. O mapa permite observar a empresa como uma rede de processos e capabilities (process-driven).
- **persona:** Platform Admin, Enterprise Architect, Workspace Admin
- **route_candidate:** `/builder/enterprise-map`
- **future_workspace_route:** `/[workspace_id]/enterprise-map`
- **scope:** Visualização agregada, global para a plataforma Builder, focada em design-only, não persistida, baseada em static mock data. Não representa uma arquitetura corporativa real.
- **workspace_or_global:** Global Builder Mock
- **related_capabilities:** `organization`, `audit` (indiretamente)
- **data_inputs:** Nenhuma inserção direta nesta tela; dados sintéticos locais (static data).
- **data_outputs:** Nenhuma.
- **commands:** Trocar blueprint, trocar perspectiva, filtrar node type, filtrar domain, filtrar readiness, filtrar data source mode, selecionar node/relationship, destacar vizinhança.
- **empty_state:** "Nenhum blueprint sintético selecionado."
- **loading_state:** Indicador de renderização de grafos/mapas visuais.
- **error_state:** Falha ao construir os relacionamentos. Sugere atualizar a página.
- **success_state:** Renderização de um diagrama ou grafo interativo conectando elementos.
- **permissions:** Acesso público ao Builder Mock (não usa permissões reais).
- **audit_events:** (Nenhum neste momento mock)
- **evidence_required:** (Nenhuma evidência real necessária no modo mock)
- **frontend_risks:** Visualização de grafos pode se tornar complexa/lenta com muitos nós se não houver agrupamento eficiente.
- **e2e_test_expectation:** O usuário entra na rota mock `/builder/enterprise-map` e interage com o seletor de blueprint e perspectivas, validando os dados estáticos na tela.
- **implementation_status:** documented

**Notes:** synthetic, design-only, not persisted, not real enterprise architecture.
