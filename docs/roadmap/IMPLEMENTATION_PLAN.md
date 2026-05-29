# Roadmap de Implantacao do System Builder

Este plano divide a construcao em fases pequenas para permitir entregas com
contextos menores e criterios de aceite objetivos.

## Macrovisao

Fundacao conceitual -> separacao plataforma/cliente -> infraestrutura de dados
-> metamodelo -> engine minima -> formularios dinamicos -> documentos e
rastreabilidade -> blueprints -> admin builder -> canvas -> integracoes -> IA
assistiva.

## Fase 1: Fundacao documental do repositorio

Objetivo: transformar manifesto, constituicao e ontologia em documentos oficiais.

Entregaveis:

- `docs/foundation/MANIFESTO.md`
- `docs/foundation/AI_CONSTITUTION.md`
- `docs/foundation/ONTOLOGY.md`
- `docs/foundation/MASTER_BLUEPRINT_PROMPT.md`
- `AGENTS.md`

Criterio de aceite: qualquer IA ou desenvolvedor entende o que e o System
Builder, o que ele nao e, como deve decidir e quais principios nao pode violar.

## Fase 2: Separacao conceitual entre plataforma e cliente

Objetivo: formalizar System Builder como fabrica e clientes/blueprints como
produtos da fabrica.

Entregaveis:

- `docs/architecture/PLATFORM_VS_CLIENT.md`
- `docs/architecture/BLUEPRINTS_AND_DEPLOYMENTS.md`

Criterio de aceite: o repo deixa claro onde fica plataforma, blueprint,
deployment e runtime.

## Fase 3: Estrategia de repositorios e pacotes

Objetivo: decidir monorepo inicial ou repositorios separados.

Entregavel:

- `docs/architecture/REPOSITORY_STRATEGY.md`

Estrutura-alvo sugerida:

```text
/apps/system-builder
/apps/gestao-tecnica
/packages/core
/packages/workflow
/packages/documents
/packages/storage
/packages/modules
/packages/blueprints
```

Criterio de aceite: esta claro onde ficam core, app cliente, modulos,
blueprints, engine e integracoes.

## Fase 4: Separacao de bancos de dados

Objetivo: separar banco da plataforma e banco do cliente/runtime.

Entregaveis:

- `system_builder_dev`
- `gestao_tecnica_dev`
- `docs/database/DATABASE_STRATEGY.md`

Criterio de aceite: plataforma e dados operacionais nao compartilham a mesma
fonte de verdade.

## Fase 5: Estrategia de schemas

Objetivo: criar schemas PostgreSQL base.

Entregavel:

- `database/init/001_create_schemas.sql`

Schemas System Builder:

- `builder`
- `registry`
- `blueprints`
- `modules`
- `integrations`
- `audit`

Schemas runtime:

- `identity`
- `workspace`
- `workflow`
- `documents`
- `storage`
- `audit`
- `integrations`
- `notifications`

Criterio de aceite: schemas existem e estao documentados.

## Fase 6: Workspace e identidade minima

Objetivo: criar base multi-workspace.

Entregaveis:

- `workspace.workspaces`
- `identity.users`
- `workspace.workspace_members`
- `identity.roles`
- `identity.permissions`

Criterio de aceite: toda operacao futura pode ser vinculada a `workspace_id`.

## Fase 7: Registry de capacidades e modulos

Objetivo: registrar capacidades organizacionais e modulos.

Entregaveis:

- `registry.capabilities`
- `registry.modules`
- `registry.module_versions`
- `registry.module_capabilities`

Criterio de aceite: e possivel registrar uma capacidade, um modulo e uma versao.

## Fase 8: Metamodelo inicial de processos

Objetivo: criar estrutura relacional para processos.

Entregaveis:

- `workflow.process_definitions`
- `workflow.process_versions`
- `workflow.states`
- `workflow.transitions`
- `workflow.actions`

Criterio de aceite: e possivel cadastrar um processo simples sem executa-lo.

## Fase 9: Instancias de processo e payload separado

Objetivo: criar estrutura para execucoes reais.

Entregaveis:

- `workflow.process_instances`
- `workflow.process_payloads`

Criterio de aceite: uma instancia governa metadados e o payload JSONB carrega
dados variaveis.

## Fase 10: Eventos imutaveis de workflow

Objetivo: criar trilha de auditoria minima.

Entregavel:

- `workflow.events`

Criterio de aceite: toda criacao de instancia gera evento.

## Fase 11: Engine minima de execucao

Objetivo: criar use cases basicos de operacao.

Entregaveis:

- `createProcessInstance`
- `getAvailableActions`
- `executeAction`
- `changeState`
- `appendEvent`
- `updatePayload`

Criterio de aceite: por codigo ou API, e possivel criar instancia, executar
acao, mudar estado, atualizar payload e registrar evento.

## Fase 12: Form Builder por metadados

Objetivo: criar definicao relacional de formularios dinamicos.

Entregaveis:

- `workflow.field_definitions`
- `workflow.forms`
- `workflow.form_fields`

Campos iniciais:

- `text`
- `textarea`
- `number`
- `date`
- `select`
- `boolean`
- `file_reference`

Criterio de aceite: e possivel definir um formulario sem alterar codigo.

## Fase 13: Renderizacao de formulario dinamico

Objetivo: renderizar formularios a partir do banco.

Entregaveis:

- `DynamicFormRenderer`
- `DynamicFieldRenderer`

Criterio de aceite: formulario salvo no banco aparece na UI, salva valores em
`workflow.process_payloads.data` e respeita validacoes iniciais.

## Fase 14: Action Registry

Objetivo: criar catalogo de actions disponiveis.

Entregaveis:

- `workflow.action_registry`
- `workflow.action_executions`

Actions iniciais:

- `workflow.update_payload`
- `workflow.change_state`
- `workflow.assign_responsible`
- `notifications.send`
- `documents.attach_file`
- `integrations.call_webhook`

Criterio de aceite: e possivel associar uma action a uma transicao ou etapa.

## Fase 15: Notificacoes internas minimas

Objetivo: permitir notificacoes operacionais internas.

Entregaveis:

- `notifications.notifications`
- `notifications.notification_templates`
- `notifications.send`

Criterio de aceite: executar uma action consegue gerar notificacao interna.

## Fase 16: Storage com MinIO

Objetivo: integrar armazenamento de arquivos.

Entregaveis:

- `storage.objects`
- `uploadObject`
- `getSignedUrl`
- `deleteObject`
- `calculateChecksum`

Criterio de aceite: upload salva bytes no MinIO e metadados no PostgreSQL.

## Fase 17: Modulo documental minimo

Objetivo: transformar arquivos em documentos rastreaveis.

Entregaveis:

- `documents.documents`
- `documents.document_versions`
- `documents.document_links`

Criterio de aceite: e possivel criar documento, anexar versao e vincular a uma
instancia de processo.

## Fase 18: Canhoto de rastreabilidade documental

Objetivo: criar base de verificacao documental.

Entregavel:

- `documents.trace_receipts`

Criterio de aceite: uma versao documental pode gerar codigo de verificacao, URL
e payload para QR.

## Fase 19: Timeline operacional

Objetivo: visualizar historico de uma instancia.

Entregavel:

- `ProcessInstanceTimeline`

Fontes:

- `workflow.events`
- `documents.document_links`
- `workflow.action_executions`

Criterio de aceite: usuario ve criacao, mudancas de estado, actions, payload e
documentos.

## Fase 20: Blueprint Loader inicial

Objetivo: carregar blueprints versionados.

Entregaveis:

- `blueprints.blueprints`
- `blueprints.blueprint_versions`
- `blueprints.blueprint_installations`
- loader YAML/JSON

Criterio de aceite: blueprint pode ser importado e registrado no banco.

## Fase 21: Primeiro blueprint aplicado

Objetivo: modelar um primeiro sistema setorial como blueprint, sem transforma-lo
na plataforma.

Entregavel:

- `blueprints/technical-operations`

Criterio de aceite: o blueprint pode ser instalado em um workspace e criar
capacidades, processos e formularios iniciais.

## Fase 22: Admin Builder minimo

Objetivo: criar painel administrativo da plataforma.

Entregaveis:

- `/admin/modules`
- `/admin/capabilities`
- `/admin/processes`
- `/admin/forms`
- `/admin/blueprints`

Criterio de aceite: admin consegue ver modulos, instalar blueprint, listar
processos e editar formulario basico.

## Fase 23: Process Canvas inicial

Objetivo: visualizar e editar processos.

Entregaveis:

- canvas de estados;
- transicoes;
- actions vinculadas.

Criterio de aceite: usuario visualiza um processo como fluxo e edita estados e
transicoes basicas.

## Fase 24: Integracoes e webhooks

Objetivo: permitir comunicacao com sistemas externos.

Entregaveis:

- `integrations.external_systems`
- `integrations.webhooks`
- `integrations.webhook_deliveries`
- `integrations.call_webhook`
- `integrations.receive_webhook`

Criterio de aceite: evento chama webhook externo e webhook externo cria ou
atualiza instancia.

## Fase 25: Auditoria e governanca avancada

Objetivo: fortalecer seguranca, historico e controle.

Entregaveis:

- payload diff;
- event integrity;
- action logs;
- permission audit;
- document access logs.

Criterio de aceite: toda operacao relevante responde quem fez, quando fez, o
que mudou, em qual processo, em qual documento e em qual payload.

## Fase 26: Permissoes por responsabilidade

Objetivo: implementar impessoalidade operacional.

Entregaveis:

- `responsibilities`
- `responsibility_assignments`
- `role_responsibilities`

Criterio de aceite: processos podem ser atribuidos a responsabilidades, nao
apenas usuarios.

## Fase 27: Versionamento de processos e blueprints

Objetivo: evoluir sem quebrar instancias antigas.

Regras:

- `process_versions` ficam imutaveis apos publicacao;
- instancias apontam para `process_version_id`;
- `blueprint_versions` podem ser instaladas e atualizadas.

Criterio de aceite: alterar processo cria nova versao sem corromper execucoes
antigas.

## Fase 28: IA assistiva inicial

Objetivo: adicionar IA como apoio, nao como orquestradora opaca.

Entregaveis:

- sugerir processo;
- explicar fluxo;
- detectar campos faltantes;
- sugerir actions;
- gerar documentacao do processo.

Criterio de aceite: IA sugere e documenta, mas nao executa mudancas sem
confirmacao humana.

## Fase 29: Marketplace de blueprints

Objetivo: preparar distribuicao de conhecimento reutilizavel.

Entregaveis:

- blueprint registry;
- metadata de versao;
- compatibilidade;
- fluxo de instalacao e atualizacao.

Criterio de aceite: blueprint pode ser publicado, versionado, instalado e
atualizado.

## Fase 30: Plataforma v1.0

Objetivo: consolidar o System Builder como produto funcional.

Capacidades finais:

- workspaces;
- modulos;
- processos;
- formularios dinamicos;
- payloads;
- eventos;
- documentos;
- MinIO;
- blueprints;
- admin builder;
- canvas basico;
- webhooks;
- auditoria;
- primeiro blueprint aplicado.

Criterio de aceite: e possivel criar workspace, instalar blueprint, executar
processos, anexar documentos, rastrear eventos e adaptar fluxos basicos.

## Ordem recomendada

1. Fases 1-5: fundacao e infraestrutura.
2. Fases 6-10: ontologia no banco.
3. Fases 11-14: engine e formularios.
4. Fases 15-19: notificacoes, documentos e rastreabilidade.
5. Fases 20-23: blueprints, admin e canvas.
6. Fases 24-27: integracoes, governanca e versionamento.
7. Fases 28-30: IA, marketplace e v1.0.

## Primeira sprint pratica

Comecar por:

1. Documentos oficiais.
2. Plataforma vs cliente.
3. Estrategia de repositorio.
4. Estrategia de bancos.
5. Schemas PostgreSQL.

Essa sprint prepara o terreno sem acoplar a plataforma a um caso aplicado.
