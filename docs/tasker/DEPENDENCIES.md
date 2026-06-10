# Dependencies and Gaps

| ID | Origem | Dependência/gap | Motivo | Estado | Próxima ação |
|---|---|---|---|---|---|
| DEP-001 | Process Mirroring | organização e processo piloto reais | validar modelos contra realidade | open | dono do produto selecionar piloto |
| DEP-001a| Process Mirroring | fontes reais do piloto | documentação atual usou dados sintéticos; faltam dados reais | open | aguardando fornecimento de dados reais pelo cliente com base em HUMAN_VALIDATION_SCRIPT |
| DEP-002 | Capabilities | revisão de fronteiras e sobreposições | documentação inicial não prova universalidade | resolved | executar CAP-VAL-001 |
| DEP-003 | UI | contratos por superfície e persona | não autorizar frontend genérico | open | executar UI-CON-001 |
| DEP-004 | Governance | matriz de papel/permissão/SoD do piloto | RBAC técnico não deve preceder modelo | open | executar GOV-PILOT-001 |
| DEP-005 | Runtime futuro | workflow publicado, eventos e receipts aprovados | execução não pode usar draft | blocked | aguardar DEV-READINESS-001 |
| DEP-006 | Integrações futuras | normalização, autenticação e idempotência contratadas | payload externo não entra direto no domínio | blocked | criar task após piloto |
| DEP-007 | Implementação futura | decisão explícita READY FOR DEV | READY FOR TASKER_EXECUTION não autoriza código | blocked | Jules Tester auditar |
