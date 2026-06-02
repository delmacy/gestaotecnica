# Roadmap de 100 Fases — System Builder

## 1. Objetivo do roadmap

Este roadmap orienta o desenvolvimento incremental do System Builder em fases pequenas, auditáveis e revisáveis.

> O objetivo não é implementar tudo de uma vez. O objetivo é manter direção arquitetural clara e entregar uma peça verificável por fase.

## 2. Visão por blocos

```text
Fases 1–20
MVP técnico: modelar, salvar, publicar, executar e rastrear.

Fases 21–50
Produto alfa: runtime, registry, módulos reais e Gestão Técnica como caso real.

Fases 51–80
Produto comercial inicial: onboarding, permissões, segurança, suporte e clientes controlados.

Fases 81–100
Robustez comercial: multi-tenant forte, performance, filas, auditoria, backup, observabilidade e operação recorrente.
```

## 3. Fases 1–20 — MVP técnico

| Fase | Milestone                   | Resultado esperado                                           |
| ---: | --------------------------- | ------------------------------------------------------------ |
|    1 | Documentação fundacional    | MVP, glossário, referência n8n e anti-escopo                 |
|    2 | Bootstrap de schemas        | Schemas PostgreSQL lógicos criados com segurança             |
|    3 | Tipos e catálogo do Builder | BuilderDraft, BuilderNode, BuilderEdge e catálogo de blocos  |
|    4 | Shell visual local          | Rota `/builder`, biblioteca, canvas placeholder e inspector  |
|    5 | Canvas React Flow           | Canvas real com `@xyflow/react` isolado como adaptador       |
|    6 | Inspector por tipo          | Configurações específicas por tipo de bloco                  |
|    7 | Validação visual            | Painel de erros/avisos usando `validateBuilderDraft`         |
|    8 | Ações locais de draft       | Renomear, resetar, importar/exportar JSON                    |
|    9 | Autosave local              | Persistência local em `localStorage`                         |
|   10 | Preview local               | Simulação local do processo sem runtime real                 |
|   11 | Schema de persistência      | `workflow.process_definitions` e `workflow.process_versions` |
|   12 | Service de persistência     | Service/repository para definitions e versions               |
|   13 | API/server action           | Criar/listar/carregar processo via servidor                  |
|   14 | Salvar pela UI              | Botão salvar oficialmente no Builder                         |
|   15 | Abrir processos salvos      | Lista e abertura de processos persistidos                    |
|   16 | Publicar versão             | Draft vira versão publicada e imutável                       |
|   17 | Runtime mínimo              | Criar process instance a partir de versão publicada          |
|   18 | Execução de etapas          | Avançar etapa, registrar input/output                        |
|   19 | Eventos e rastreabilidade   | Eventos básicos e trace receipt inicial                      |
|   20 | Hardening MVP               | Checklist, testes smoke e demo end-to-end                    |

## 4. Fases 21–50 — Alfa e módulos reais

| Bloco            | Fases | Entrega                                                                                           |
| ---------------- | ----: | ------------------------------------------------------------------------------------------------- |
| Runtime maduro   | 21–30 | State machine, histórico, inputs/outputs, runtime UI e auditoria                                  |
| Registry/actions | 31–40 | Capabilities, actions, event catalog, executor e outbox simples                                   |
| Módulos reais    | 41–50 | Form Builder, View Builder, Entity Builder, Helpdesk, Workforce, OS, Assets e demo Gestão Técnica |

## 5. Fases 51–80 — Comercial inicial

| Bloco                    | Fases | Entrega                                                                              |
| ------------------------ | ----: | ------------------------------------------------------------------------------------ |
| Produto comercial mínimo | 51–60 | Tenants, onboarding, usuários, templates, backup e beta fechado                      |
| Segurança e operação     | 61–70 | Auth robusta, RBAC, auditoria, logs, testes, segurança e monitoramento               |
| Comercialização          | 71–80 | Landing page, demo, documentação, contratos, preços, suporte e implantação assistida |

## 6. Fases 81–100 — Robustez comercial

| Bloco                        |  Fases | Entrega                                                                                |
| ---------------------------- | -----: | -------------------------------------------------------------------------------------- |
| Multi-cliente e governança   |  81–85 | Multi-tenant forte, políticas de acesso, ambientes e migração segura                   |
| Confiabilidade               |  86–90 | Performance, filas, retry, cache e teste de carga                                      |
| Segurança/compliance prático |  91–95 | Sessões, rate limit, auditoria forte, backup restore e retenção                        |
| Operação madura              | 96–100 | Observabilidade, painel admin, suporte, documentação final e release comercial robusto |

## 7. Pós-Fase 100

Depois da Fase 100, o projeto deixa de ser construção de produto base e passa a ser evolução de plataforma/ecossistema.

Frentes permanentes:

* SDK de integrações;
* API pública governada;
* marketplace interno de blueprints;
* onboarding comercial escalável;
* IA assistida para análise e criação;
* verticalização por nichos;
* parcerias e certificações.
