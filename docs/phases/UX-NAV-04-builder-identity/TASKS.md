# Tasks — UX-NAV-04 Builder Identity

Os IDs `Gxx` materializam gaps explicitamente registrados pela etapa 001 sem colidir com eventual catálogo numérico ainda não migrado.

| ID | Título | Dependência | Estado | Aceite resumido |
|---|---|---|---|---|
| UX-NAV-04-001 | Fundação de persistência da seleção de workspace | — | merged | tabela, seed, membership enforcement e reload por nova query |
| UX-NAV-04-G01 | Resolver identidade e portfólio pela sessão | 001 | ready | nenhum usuário dummy; somente memberships reais retornam |
| UX-NAV-04-G02 | Persistir seleção por ação/API do servidor | G01 | planned | workspace sem membership é rejeitado |
| UX-NAV-04-G03 | Propagar seleção para Builder, admin e runtime | G02 | planned | todas as superfícies usam o mesmo contexto autorizado |
| UX-NAV-04-G04 | Criar workspace switcher e estados da UI | G01..03 | planned | loading, empty, blocked, erro e sucesso explícitos |
| UX-NAV-04-G05 | Testes de integração e E2E real | G01..04 | planned | seleção sobrevive a reload e não cruza memberships |
| UX-NAV-04-G06 | Review e closeout | G05 | planned | evidência, riscos e transferência para F22 documentados |

## Transferência futura

Após closeout, a fundação deve ser referenciada por `SB-MT-04` na F22. Não duplicar tabela, seed ou use cases.
