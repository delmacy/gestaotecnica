# Contrato de evidência

Evidência conecta o contrato da task ao resultado real. Ela deve ser reproduzível e proporcional ao risco.

## Evidência mínima

```yaml
task_id: SB-XX-00
base_sha: <sha>
implementation_sha: <sha|null>
pr: <url|number|null>
files_changed: []
acceptance_results: []
commands_run: []
commands_not_run: []
manual_checks: []
security_checks: []
data_checks: []
frontend_checks: []
blockers: []
reviewer: null
validated_at: null
```

## Resultado por comando

Cada comando deve registrar:

- comando exato;
- ambiente relevante;
- código de saída;
- resumo do resultado;
- link para log ou artefato quando necessário.

## Níveis de prova

| Risco | Prova esperada |
|---|---|
| documentação | links válidos, consistência e ausência de duplicidade |
| UI | screenshot ou E2E, estados vazio/loading/erro/permissão |
| domínio/backend | testes unitários e integração do contrato |
| banco/migration | migration aplicada em banco limpo e upgrade; rollback ou estratégia de recuperação |
| autenticação/autorização | cenários permitido e negado; identidade resolvida no servidor |
| multi-tenant | teste com pelo menos dois workspaces/tenants e tentativa explícita de acesso cruzado |
| eventos/auditoria | persistência, imutabilidade, actor, workspace e correlation |
| fluxo crítico | E2E real ou blocker honesto e reproduzível |

## Estados e evidência

| Transição | Evidência necessária |
|---|---|
| `ready → in_progress` | SHA base, branch e responsável |
| `in_progress → review` | diff, self-check e comandos executados |
| `review → merged` | revisão aprovada e checks obrigatórios |
| `merged → validated` | critérios de aceite reproduzidos na integração |
| qualquer → `blocked` | condição objetiva, reprodução e próximo passo |
| qualquer → `superseded` | task substituta e decisão explícita |

## Honestidade operacional

- Não declarar teste executado quando apenas foi planejado.
- Não chamar fixture de dado real.
- Não esconder redirect, fallback, warning ou erro de ambiente.
- Não usar build limpo como prova de regra de negócio.
- Não considerar presença de código como prova de jornada utilizável.

## Localização

O `PROGRESS.md` da fase contém o resumo e links. Evidências consolidadas podem ficar em:

```text
docs/phases/<FASE>/evidence/<TASK-ID>.md
```

Logs brutos ou context packs gerados automaticamente podem permanecer em `docs/agent-runs/`, mas não substituem a evidência consolidada.
