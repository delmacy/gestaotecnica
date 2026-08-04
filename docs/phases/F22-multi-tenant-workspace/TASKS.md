# Tasks — F22 Multi-tenant & Workspace Foundation

Todas as tasks permanecem bloqueadas até o gate de saída da F21.

| ID | Título | Dependência | Estado | Aceite resumido |
|---|---|---|---|---|
| SB-MT-01 | Suíte automatizada de isolamento entre tenants | F21 | blocked | tenant A não lê nem altera dados do tenant B |
| SB-MT-02 | Configurações de workspace | MT-01 | planned | settings persistidos e escopados no servidor |
| SB-MT-03 | Membership, convites e atribuição de role | MT-01 | planned | ciclo de convite e remoção auditável |
| SB-MT-04 | Workspace switcher durável | UX-NAV-04, MT-01 | planned | seleção PostgreSQL validada por membership e refletida em toda a aplicação |
| SB-MT-05 | Super-admin cross-workspace | MT-01, governance gate | planned | acesso global explícito, auditado e sem fallback implícito |
| SB-MT-06 | Onboarding de novo tenant | MT-01..04 | planned | workspace, admin, membership e seed provisionados idempotentemente |
| SB-MT-07 | Exportação e importação por workspace | MT-01, MT-06 | planned | pacote validado sem vazamento ou sobrescrita indevida |
| SB-MT-08 | Feature flags por workspace | MT-02 | planned | módulos ativados/desativados por configuração persistida |
| SB-MT-09 | Bootstrap de workspace padrão | MT-06 | planned | seed idempotente e versionado |
| SB-MT-10 | Desativação e purge de workspace | MT-01..09 | planned | desativação, retenção, purge e auditoria controlados |

## Ajustes ao planejamento legado

- `SB-MT-04` não deve usar `localStorage` como autoridade. Deve reaproveitar UX-NAV-04.
- `SB-MT-05` exige distinção entre identidade da plataforma e membership do tenant.
- `SB-MT-10` não pode depender apenas de `ON DELETE CASCADE`; deve possuir política de retenção e recuperação.
