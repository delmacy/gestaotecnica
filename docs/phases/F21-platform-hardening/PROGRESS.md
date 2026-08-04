# Progresso — F21 Platform Hardening

Atualizado em: 2026-08-04
Estado da fase: `in_progress`
Task de segurança atual: `SB-CR-09`
Tasks abertas observadas: `SB-BI-10`, `SB-PF-01`, `SB-PF-02`

## Resumo

A primeira onda de isolamento e autenticação avançou para a `main`: remoção de cópia duplicada, escopo de work-items por workspace, JWT com claims de workspace, remoção da API key global e auditoria mais ampla de queries. Também há entregas parciais de tooling.

A fase ainda não atingiu o gate de saída. Falta proteção de banco, prova integrada de isolamento, fechamento dos grupos de performance, CI, qualidade e observabilidade.

## Registro inicial consolidado

| Task(s) | Implementação observada | Integração | Validação | Estado |
|---|---|---|---|---|
| SB-CR-01 | diretório duplicado removido | commit na `main` | conferir ausência em clone limpo | merged |
| SB-CR-02..05 | queries principais de work-items escopadas | commits na `main` | teste cruzado entre workspaces ainda requerido | merged |
| SB-CR-06 | coluna/contratos de workspace alterados | commit na `main` | reconciliar descrição, migration, assinaturas e callers | merged |
| SB-CR-07 e CR-10 | JWT por workspace e remoção de chave global | commits na `main` | cenários autorizado/negado e rotação de secrets | merged |
| SB-CR-08 | auditoria de queries por workspace | commit mais recente da `main` em 2026-08-04 | revisão independente e suíte multi-tenant | merged |
| SB-BI-01, 05, 07, 09 | typecheck, versão Next, ignores do orquestrador e ESLint | commits na `main` | executar gates em checkout limpo | merged |
| SB-BI-10 | comando de validação consolidada | PR #995 | aguardando integração e execução reproduzível | review |
| SB-PF-01 | invalidação de cache em service-orders | PR #996 | aguardando integração | review |
| SB-PF-02 | invalidação de cache em workforce | PR #997 | aguardando integração | review |

## Bloqueios e riscos

1. `SB-CR-09` ainda não possui implementação consolidada de proteção no banco.
2. Não há evidência única provando que tenant A não acessa tenant B em todas as superfícies críticas.
3. PRs empilhados podem mascarar dependências e dificultar merge/rollback.
4. Commits agregam referências a várias tasks; a evidência deve separar o que cada diff realmente entregou.
5. Grupos D e E continuam essencialmente planejados.

## Próximos passos

1. executar `SB-CR-09` como migration + testes de dois tenants;
2. revisar e validar `SB-CR-01..10` como pacote de segurança;
3. integrar ou rebasear PRs #995–#997 na ordem explícita;
4. concluir grupo B e C antes de liberar refatorações amplas;
5. criar closeout por grupo A–E e closeout final da fase.

## Evidências de referência

- commits `SB-CR-*` e `SB-BI-*` presentes na `main` em 2026-08-04;
- PR #995 — `SB-BI-10`;
- PR #996 — `SB-PF-01`;
- PR #997 — `SB-PF-02`;
- planejamento legado da F21 em PR documental correspondente.
