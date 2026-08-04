# Tasks — UX-NAV-03 Operator Loop

O detalhamento bruto permanece em `docs/agent-runs/**`. Este catálogo consolida as cinco fatias de produto e preserva a faixa de IDs.

| Faixa | Fatia | Estado | Evidência principal |
|---|---|---|---|
| UX-NAV-03-001..010 | Operator work intake | validated | closeout e evidence nos agent runs da faixa |
| UX-NAV-03-011..020 | Form submit to work | validated | tasks/evidence da faixa 012, 014, 016 e closeout correspondente |
| UX-NAV-03-021..030 | Approval decision and advance | validated | E2E/evidence da etapa 029 e closeout da fatia |
| UX-NAV-03-031..040 | Attachments and timeline | validated_with_blocker | closeout 040 registra limitações do ambiente real |
| UX-NAV-03-041..050 | Queue, search and draft recovery | validated_with_blocker | closeout 050; seed autenticado pendente |

## Task corretiva de fechamento

| ID | Título | Dependência | Estado | Aceite resumido |
|---|---|---|---|---|
| UX-NAV-03-C01 | Criar seed E2E autenticado e reproduzir jornada real | 001..050 | ready | rotas não redirecionam para login e leitura/mutação persistida é observada |

## Política

Não reabrir as 50 tasks funcionais para resolver apenas o ambiente de prova. A corretiva `C01` fecha o blocker transversal e atualiza o status da fase.
