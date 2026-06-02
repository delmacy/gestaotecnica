# Próxima Fase — System Builder

## Fase atual de organização

```text
Fase 12B — Organização documental e memória do projeto
```

## Próxima fase técnica planejada

```text
Fase 12 — Serviço de persistência de Process Definition
```

## Objetivo da Fase 12

Criar service/repository server-side para persistir:

* `workflow.process_definitions`;
* `workflow.process_versions`.

Sem conectar UI.
Sem criar API.
Sem criar runtime real.
Sem criar eventos.
Sem criar registry.

## Arquivos prováveis da Fase 12

```text
src/features/workflow/definitions/
  process-definition.repository.ts
  process-definition.service.ts
  process-definition.errors.ts
  process-definition.fixtures.ts
  index.ts
```

## Critérios de aceite da Fase 12

* service cria definition + version;
* service cria nova version;
* valida input antes de persistir;
* serializa BuilderDraft;
* não acessa `public.*`;
* não conecta UI;
* não cria API;
* não cria runtime;
* não cria events;
* não cria registry.

## Bloqueios conhecidos

* Confirmar padrão de DB client existente antes de criar repository.
* Evitar duplicar client Drizzle.
* Não executar `db:push` sem autorização.
