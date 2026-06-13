# INTEGRATION-CONTRACT-001 AUDIT

## Objetivo
Auditar se todos os contratos do módulo de integração foram definidos com as fronteiras estritas entre a borda (n8n) e o sistema (Postgres/Runtime).

## Status
Aprovado.

## Resumo
A documentação delimita de forma incontestável que o Runtime não pode rodar protocolos externos e que o webhook não implementa regras de negócio, mas serve apenas para criar Gateway Receipts e enfileirar para o Runtime Process.
