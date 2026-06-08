# Feature Contract — Fase 33
## 1. Identificação
- Fase: 33
- Nome: Living Procedures Backend
- Tipo: Backend
- Dependências: N/A
- Fase frontend vinculada: Fase 33B
- Status: Planejada refinada

## 2. Objetivo
Entidade `living_procedures` atrelada a uma versão de processo.

## 3. Problema que resolve
Associa documentação de procedimentos aos workflows (Process Versions).

## 4. Escopo permitido
- Tabelas e Service de Living Procedures.

## 5. Fora de escopo
- Gerador IA de documentos.

## 6. Entidades e contratos
- Entidade: `living_procedures`
- Campos: `id`, `workspace_id`, `process_definition_id`, `process_version_id`, `title`, `body_markdown`, `status` (draft | published | archived), `created_by_id`, `updated_by_id`, `created_at`, `updated_at`.
- Regra: procedimento publicado DEVE apontar para versão publicada de processo.

## 7. Estados e transições
- draft -> published.

## 8. Services, repositories e actions esperados
- CRUD Actions.

## 9. UI esperada
N/A

## 10. Testes obrigatórios
- Unit e integrações de vínculo de chave.

## 11. Frontend impact
- Gap frontend pendente: 33B.

## 12. Critérios de aceite
- Procedimento só pode publicar se processo for published.

## 13. Regra de parada
Testes de regra passando.

## 14. Prompt para Jules Dev
`Implementar persistência de Living Procedures (Fase 33) vinculando com versões publicadas de processo.`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- Versionamento atrelado.
