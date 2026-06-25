# Baseline Comum - Frentes 20 Etapas (Marco P0)

Este documento registra o baseline comum das seis frentes de trabalho para o System Builder, tirando uma "fotografia" do estado atual do repositório. O Marco P0 **não resolve os gates nem executa auditorias profundas**; ele apenas serve como ponto de partida estável e limpo para ordenar o paralelismo das frentes.

## 1. Referência do Baseline
- **Branch base:** `main`
- **Commit base (SHA):** `f5b7e117f937451b7fb3419831a7289d01dd58e7`

## 2. Matriz de Comandos (Validação de Baseline)

| Comando | Estado | Duração Aprox. | Evidência / Motivo |
|---|---|---|---|
| `npm ci` | EXECUTADO / PASSOU | 48s | Dependências instaladas (696 pacotes) com alguns warnings de peer dependencies. |
| `npm run lint` | EXECUTADO / FALHOU | ~10s | 647 problemas (54 errors, 593 warnings), majoritariamente `@typescript-eslint/no-explicit-any` e `@typescript-eslint/no-unused-vars`. |
| `npm run check:architecture` | EXECUTADO / PASSOU | ~5s | Validação de arquitetura aprovada (domínio obrigatório `src/platform` encontrado). |
| `npm run test:unit` | EXECUTADO / FALHOU | ~14s | 817 testes, 815 passaram, 2 falharam (`trace-receipt-hashing.test.ts` por descrições curtas em `@ts-expect-error`). |
| `npm run test:integration` | EXECUTADO / FALHOU | ~3s | 21 testes, 7 passaram, 14 falharam (falta de URL de banco isolado e queries falhas no banco dummy). |
| `npm run build` | EXECUTADO / PASSOU | ~25s | Compilou com sucesso (Next.js), geração de páginas estáticas concluída. |
| `npm run db:bootstrap` | EXECUTADO / FALHOU | ~1s | `getaddrinfo ENOTFOUND dummy` (esperado devido ao uso de dummy database local sem serviço ativo). |
| `npm run db:validate` | EXECUTADO / PASSOU | ~1s | Migrações validadas e seguras para prosseguir (nenhuma operação `--force`). |
| `npm run test:e2e` | EXECUTADO / FALHOU | ~2s | Falha na execução do Playwright (`Executable doesn't exist`) e erro `getaddrinfo ENOTFOUND dummy`. |

## 3. Estado Atual (Fotografia)
- **DB/Migration State:** Validação estática passa (`db:validate`). Scripts executáveis falham no sandbox (`db:bootstrap`, `test:integration`, `test:e2e`) por dependerem de um banco de dados real ativo (`ENOTFOUND dummy`).
- **Contratos Compartilhados:** Aprovados pela validação de arquitetura em `src/platform`.
- **PRs Abertos (relacionados ao baseline):** Apenas este PR documental atual de captura do baseline.
- **Riscos e Bloqueios:** O ambiente sandbox do Executor não possui PostgreSQL embutido nem os binários do Chromium instalados por padrão, limitando a execução verde total de ponta a ponta. Isso não é um bloqueio para as frentes, mas exige considerar a limitação ao interpretar CI/CD real vs sandbox.
- **Mapa das 6 Frentes:**
  1. Persistência
  2. Workflow / Actions
  3. Segurança
  4. Builder UI
  5. Gestão Técnica
  6. Qualidade / CI
