# UX-NAV-03 — Operator Loop

Status: `validated_with_blocker`

## Objetivo

Fechar jornadas operacionais completas entre intake, criação de trabalho, decisões/aprovações, anexos/timeline, busca, filas, SLA e recuperação de rascunhos.

## Resultado de produto

Um operador autenticado navega por trabalho real dentro do workspace selecionado, executa ações e consulta receipts sem dados sintéticos silenciosos.

## Escopo consolidado

- intake de trabalho do operador;
- formulário para criação de trabalho;
- decisão/aprovação e avanço;
- anexos e timeline;
- busca global;
- filas, SLA e recuperação de rascunhos;
- estados real, synthetic, demo, empty e blocked explicitamente distintos.

## Limitação conhecida

O closeout da etapa 050 registrou que o E2E contra banco real ficou bloqueado porque o perfil de sessão esperado não estava presente no seed, resultando em redirect para login.

## Definição de fechamento definitivo

Executar a jornada contra seed reproduzível com usuário autenticado e dados persistidos, sem alterar o escopo funcional já fechado.
