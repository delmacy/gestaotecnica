# F26 — Workflow, Runtime & Frontend Parity

Status: `planned`

## Objetivo

Consolidar e estender o workflow/runtime existente, ligar formulários, eventos, jobs e integrações e fechar os gaps de interface para jornadas operáveis.

## Resultado de produto

Processos publicados podem ser instanciados, executados e auditados em uma interface coerente, com formulários validados, triggers controlados, jobs resilientes e documentação de API.

## Escopo incluído

- inventário e consolidação do engine existente;
- formulários dinâmicos;
- visualização de instâncias;
- triggers orientados a eventos;
- jobs assíncronos;
- binding de integração;
- design system necessário à paridade;
- auditoria frontend e E2E críticos;
- portal da API.

## Fora de escopo

- reconstruir runtime, steps e eventos já implementados sem decisão `replace`;
- permitir que integrações ignorem autorização ou governance;
- tratar n8n ou Paperclip como fonte da verdade;
- expandir federação.

## Dependências e gates

- F24 e F25 validadas;
- inventário das fases históricas 17A–20D, runtime atual, builder publishing e eventos;
- matriz de gaps backend/frontend;
- jobs e outbox da F21 estabilizados.

## Definição de pronto

Três jornadas E2E reais comprovam publicação e execução de processo, operação de work-item/OS e administração protegida por RBAC, sem fallback sintético não rotulado.
