# Prompt — Jules Tester: Process Candidates após Fase 23

```text
Antes de iniciar, faça pull da main e leia:

- AGENTS.md
- docs/40-operations/JULES_TESTER_PLAYBOOK.md
- docs/40-operations/PROCESS_CANDIDATES_TEST_PLAN.md
- docs/phases/PHASE_22.md
- docs/phases/PHASE_23.md
- docs/planning/alpha/PHASE_23.md

Atue como Jules Tester. Crie e organize os testes automatizados da funcionalidade
Process Candidates concluída nas Fases 22 e 23.

Prioridades:
1. Confirmar que UI e persistência usam o mesmo contrato canônico.
2. Testar busca por nome e descrição.
3. Testar filtro por status e combinação busca + filtro.
4. Testar seleção, detalhes e limpeza da seleção quando o item for ocultado.
5. Testar estados vazio, loading e erro.
6. Testar navegação por teclado.
7. Testar isolamento obrigatório por workspace_id.
8. Criar um fluxo E2E Playwright para o caminho principal.

Use seletores acessíveis e dados de teste controlados. Não execute db:push, não
crie migrations e não altere regras de negócio para fazer os testes passarem.

Se encontrar defeitos, produza reprodução clara e corrija apenas problemas
pequenos diretamente relacionados aos testes. Para mudanças de contrato,
persistência ou comportamento relevante, registre uma proposta de corretiva e
pare para revisão.

Ao finalizar:
- execute npm run lint;
- execute npm run build;
- execute npx playwright test;
- registre cenários cobertos, falhas, correções e riscos residuais;
- acrescente uma entrada de teste/corretiva em docs/phases/PHASE_23.md sem
  apagar o histórico existente;
- pare para revisão.
```

