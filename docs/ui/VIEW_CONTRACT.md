# View Contract

Este documento atua como o contrato operacional mestre para o desenvolvimento de UI (superfícies front-end). Não é apenas uma lista de superfícies, mas um conjunto rigoroso de requisitos que cada superfície deve declarar e aprovar antes de qualquer desenvolvimento técnico ser iniciado.

## Superfícies Prioritárias (Grupo A)

As seguintes superfícies são consideradas prioritárias para a estruturação do System Builder:

- **Builder Shell (`BUILDER_SHELL.md`):** Superfície raiz e principal da plataforma. Atua como o container de navegação para todos os demais módulos.
- **Tasker Board (`TASKER_BOARD.md`):** Superfície de coordenação do desenvolvimento do System Builder. Rota candidata: `/builder/tasker`.
- **Capability Explorer (`CAPABILITY_EXPLORER.md`):** Visualização de capabilities. Rota candidata: `/builder/capabilities`.
- **Registry View (`REGISTRY_VIEW.md`):** Visão técnica documental e read-only do catálogo de capabilities e suas dependências. Rota candidata: `/builder/registry`.
- **Docs Viewer (`DOCS_VIEWER.md`):** Visão navegável e organizada dos documentos centrais em modo read-only. Rota candidata: `/builder/docs`.
- **Process Mirroring Intake (`PROCESS_MIRRORING_INTAKE.md`):** O Process Mirroring Intake deve ser o primeiro módulo prático para estruturar a coleta e organização de informações sobre processos observados. Rota candidata: `/builder/process-mirroring`.
- **Gap Tracker (`GAP_TRACKER.md`):** Superfície para organizar lacunas de coleta, análise e validação que impedem o espelhamento de processos. Rota candidata: `/builder/process-mirroring/gaps`.
- **Process Mirror Board (`PROCESS_MIRROR_BOARD.md`):** Visualização do espelho de processos.
- **As-Is Mirror Board (`AS_IS_MIRROR.md`):** Visualização do processo espelhado em estado atual (As-Is). Rota candidata: `/builder/process-mirroring/as-is`.
- **UI Contracts Viewer (`UI_CONTRACTS_VIEWER.md`):** Visualização de contratos de UI da plataforma de forma navegável e estruturada. Rota candidata: `/builder/ui-contracts`.
- **Form Builder (`FORM_BUILDER.md`):** Superfície visual de design e estruturação de schemas de formulários do System Builder. Rota candidata: `/builder/form-builder`.
- **View Builder (`VIEW_BUILDER.md`):** Superfície mockada de design-only para montar views mockadas a partir de static schemas locais. Rota candidata: `/builder/view-builder`.
- **Workflow Builder (`WORKFLOW_BUILDER.md`):** Superfície mockada de design-only para montar blueprints e fluxos. Rota candidata: `/builder/workflow-builder`.

## Superfícies Secundárias (Grupo B)
- **Governance Matrix (`GOVERNANCE_MATRIX.md`):** Superfície mockada de design-only para montar a matriz de governança. Rota candidata: `/builder/governance-matrix`.
- **Operator Guide (`OPERATOR_GUIDE.md`):** Superfície mockada read-only/static de design-only para montar o guia de usuário. Rota candidata: `/builder/operator-guide`.
- **Enterprise Map (`ENTERPRISE_MAP.md`):** Superfície mockada de design-only para visualização sintética da interconexão entre capacidades operacionais, processos, sistemas e papéis. Rota candidata: `/builder/enterprise-map`.


*(As demais superfícies encontram-se documentadas no diretório `docs/ui/surfaces/` e seguem o fluxo de priorização definido no backlog).*

## Padrão Obrigatório de Contrato por Superfície

Cada superfície documentada (e.g., nos arquivos `.md` sob `docs/ui/surfaces/`) deve declarar explicitamente os seguintes campos:

- **surface_id:** Identificador único (ex: `UI-SURF-001`).
- **surface_name:** Nome claro e descritivo da superfície.
- **purpose:** Propósito de negócio ou técnico da superfície.
- **persona:** A pessoa ou ator que opera esta superfície (ex: Admin, Requester, Technician).
- **route_candidate:** A proposta de URL ou local onde essa superfície será acessada (ex: `/admin/capabilities`).
- **scope:** Limite operacional (o que esta superfície cobre e o que deixa de fora).
- **workspace_or_global:** Declara se a UI opera num contexto de `workspace` ou se é `global`.
- **related_capabilities:** Capabilities associadas a esta superfície (ex: `organization`, `requests`).
- **data_inputs:** Dados requeridos de fora (ex: Formulários, Filtros).
- **data_outputs:** Como os dados são salvos ou enviados adiante.
- **commands:** Comandos principais que a interface dispara (ex: Aprovar, Rejeitar, Avançar passo).
- **empty_state:** O que a UI mostra quando não há dados.
- **loading_state:** Como a UI se comporta no aguardo dos dados.
- **error_state:** Tratamento e visualização de erros.
- **success_state:** Exibição do sucesso na operação.
- **permissions:** Roles e permissões do usuário requeridas.
- **audit_events:** Eventos gerados que impactam a trilha de auditoria.
- **evidence_required:** Necessidades de evidências associadas, como fotos ou notas.
- **frontend_risks:** Possíveis riscos de UX, performance ou complexidade.
- **e2e_test_expectation:** Expectativa do teste de ponta-a-ponta (ex: 'O Technician abre a tela, preenche o log e vê a success screen').
- **implementation_status:** O status real da implementação da UI. Deve ser preenchido usando os status permitidos.

## Status Permitidos para implementation_status

Cada superfície DEVE ser categorizada usando um destes status estritos:

- **documented:** Contrato conceitual desenhado; não avaliado nem validado.
- **needs_validation:** Depende de dados operacionais reais ou de validação humana antes do design ou dev.
- **blocked:** Bloqueado por alguma outra dependência técnica ou de negócio.
- **ready_for_design:** Contrato provado; pronto para design de UI ou arquitetura.
- **ready_for_dev_after_gate:** Pronto para codificação de UI; mas *somente* depois de gates específicos abertos. (Nota: Nenhuma superfície receberá este status nas fases documentais iniciais, como UI-CON-001).

## Regras
- Frontend desconectado de task, contrato ou workspace é estritamente proibido.
- Se uma UI usar dados sintéticos na documentação, ela não pode ser considerada confirmada (deve ser `needs_validation`).
- Qualquer alteração a essas superfícies ou suas regras requer uma reavaliação dos contratos de capability e do processo.
