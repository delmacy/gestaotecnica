# Backlog Operacional

| ID | Módulo | Título | Tipo | Prioridade | Status | Dependências | Aceite resumido | Agente |
|---|---|---|---|---|---|---|---|---|
| DOC-002 | doc | Revisar segunda rodada documental | documentation | critical | done | nenhuma | modelos e status coerentes | Revisor documental |
| TASKER-001 | tasker | Validar fluxo de transição de tasks | architecture | high | done | DOC-002 | uma task percorre ready até done com evidência | Jules Doc |
| PM-PILOT-001 | process_mirroring | Selecionar processo piloto | decision | high | done | DOC-002 | escopo, consentimento e participantes definidos | Analista de Processo |
| PM-PILOT-002 | process_mirroring | Capturar fontes e observações piloto | documentation | high | review | PM-PILOT-001 | fontes e observações rastreáveis | Analista de Processo |
| PM-PILOT-003 | process_mirroring | Validar espelho e gaps piloto | documentation | high | done  | PM-PILOT-002 | ValidatedProcess ou ressalvas registradas | Analista + cliente |
| CAP-VAL-001 | capabilities | Revisar fronteiras das 24 capabilities | architecture | high | ready | DOC-002 | sobreposições e dependências decididas | Arquiteto |
| CAP-VAL-002 | capabilities | Validar capabilities no piloto | contract | high | backlog | PM-PILOT-003, CAP-VAL-001 | matches e gaps registrados | Arquiteto |
| UI-CON-001 | ui | Refinar contratos de superfícies prioritárias | contract | medium | ready | DOC-002 | persona, estados e E2E esperado definidos | UX/Arquiteto |
| EA-PILOT-001 | enterprise_architecture | Criar mapas do piloto | architecture | medium | backlog | PM-PILOT-003, CAP-VAL-002 | mapas possuem fonte, owner e gaps | Arquiteto |
| GOV-PILOT-001 | governance | Validar papéis e SoD do piloto | decision | medium | backlog | EA-PILOT-001 | matriz aprovada com conflitos | Security Reviewer |
| ENA-PILOT-001 | enablement | Criar guia e checklist piloto | documentation | medium | backlog | GOV-PILOT-001 | operador executa cenário simulado | Enablement |
| DEV-READINESS-001 | tasker | Auditar prontidão para execução futura | test | high | blocked | CAP-VAL-002, UI-CON-001, GOV-PILOT-001 | decisão READY/NOT READY para Dev | Jules Tester |
