# TASK-ID — Título da tarefa

## Objetivo

Descreva o resultado esperado.

## Escopo permitido

- `src/...`
- `tests/...`

## Escopo proibido

- `.github/workflows/**`
- arquivos de secrets ou configuração de produção

## Critérios de aceite

- [ ] comportamento implementado;
- [ ] testes relevantes adicionados ou atualizados;
- [ ] lint, typecheck, arquitetura, testes e build aprovados.

## Validação

```bash
npm run lint
npm run typecheck
npm run check:architecture
npm run test:unit
npm run test:integration
npm run build
```

## Risco

`low`, `medium` ou `high`.
