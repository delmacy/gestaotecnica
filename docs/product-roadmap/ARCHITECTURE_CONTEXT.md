# Contexto arquitetural global do System Builder

Este documento deve ser lido antes de qualquer task do roadmap.

## Visão do produto

O System Builder é uma plataforma orientada a processos para modelar, configurar, publicar e operar sistemas empresariais adaptáveis. O princípio central é: **o processo é a unidade principal de organização**. Setores, pessoas, módulos e integrações participam dos processos, mas não determinam isoladamente a arquitetura.

## Separação fundamental

- **Platform/Builder:** define capabilities, processos, formulários, actions, versões, publicação e governança.
- **Runtime:** executa os processos publicados para cada workspace.
- **Cliente/Workspace:** unidade de isolamento administrativo e operacional.
- **Capability:** módulo instalável com contrato, versão, dependências e limites próprios.
- **Process Definition:** modelo versionado e publicável.
- **Process Instance:** execução concreta de um processo publicado.
- **Federated Instance:** instalação independente ou semi-independente do System Builder, vinculada por contrato explícito de confiança, suporte, distribuição de pacotes ou portabilidade.

## Decisões arquiteturais vigentes

1. O sistema é multi-tenant por workspace.
2. `workspaceId`, `actorId`, roles e ownership nunca são confiados quando vêm de formulário, body, query string ou params públicos.
3. O contexto autenticado é a fonte de verdade para tenant e actor.
4. Global User, Workspace Membership, Human Resources e Workforce são conceitos distintos.
5. Events registram auditoria e integração; não substituem a persistência principal das entidades.
6. `builder.process_candidates` é staging/persistência transitória, não destino final universal.
7. Movimentos e decisões históricas devem ser append-only quando o domínio exigir rastreabilidade.
8. Cada capability é responsável por suas próprias entidades e regras.
9. Integrações entre módulos devem ocorrer por contratos, adapters, events ou services públicos, evitando imports internos cruzados.
10. Publicações e migrações devem ser versionadas, validadas, reversíveis e observáveis.
11. Federação de instâncias é uma camada acima de tenant/workspace: nenhuma instância remota herda superuser da plataforma principal e todo vínculo precisa de contrato, escopo, revogação e auditoria.
12. Clientes devem poder operar como instância gerenciada, delegada, emancipada ou federada sem perder portabilidade de blueprints, dados autorizados e histórico essencial.

## Estado atual resumido

O projeto já possui fundações de autenticação, workspaces, manifests, actions, workflows, eventos, formulários, UI e múltiplos módulos. Entretanto, há histórico de branches contaminadas, escopos misturados, contratos incompletos e divergência entre descrições de PR e diffs reais. O novo roadmap existe para eliminar essas ambiguidades e tornar a execução por agentes determinística.

## Regras de persistência

- Preferir schemas/tabelas tipadas quando o contrato do domínio estiver estável.
- Usar `process_candidates` apenas quando a task declarar explicitamente persistência transitória.
- Sempre filtrar entidades tenant-aware por `workspaceId` e discriminator/origin quando aplicável.
- Validar parent/child por `id + workspaceId + tipo/origin`.
- Migrações precisam de profiling, dry-run, reconciliação, cutover e rollback.

## Regras de eventos

Eventos canônicos devem conter, no mínimo: workspace, actor, event type, entity type/id, occurredAt, schema version, correlation, causation, idempotency quando aplicável, payload e metadata.

## Qualidade mínima

Uma task funcional só é considerada concluída quando possui:

- escopo limpo;
- testes comportamentais;
- typecheck;
- build;
- architecture check;
- evidência do diff;
- documentação de gaps;
- rollback ou estratégia de reversão quando houver mutação persistente.

## Prioridade comercial

O objetivo das próximas sprints é fechar uma vertical comercial completa antes de ampliar o catálogo de módulos. A ordem prioritária é: governança → eventos → onboarding → capabilities → Builder → módulos → integração → persistência → observabilidade → distribuição.

## Escopo futuro de federação

A projeção de federação de instâncias está documentada em `FEDERATED_INSTANCE_SCOPE.md`. Ela deve ser tratada como trilha futura gated: primeiro fechar o caminho de dados reais e a navegação completa; depois materializar contratos de `Instance Registry`, `Federation Contract`, distribuição de blueprints, suporte remoto, emancipação/export e observabilidade federada.
