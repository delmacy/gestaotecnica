# Backlog

| ID | Módulo | Título | Tipo | Prioridade | Status | Dependências | Agente |
|---|---|---|---|---|---|---|---|
| DOC-001 | doc | Revisar reestruturação documental | documentation | critical | review | nenhuma | Revisor |
| TASKER-001 | tasker | Operar primeiro sprint modular | architecture | high | ready | DOC-001 | Jules Doc |
| PM-001 | process_mirroring | Executar piloto de espelhamento | documentation | high | ready | DOC-001 | Analista de Processo |
| CAP-001 | capabilities | Revisar catálogo universal | architecture | high | ready | DOC-001 | Arquiteto |
| EA-001 | enterprise_architecture | Criar mapa empresarial piloto | architecture | medium | backlog | PM-001, CAP-001 | Arquiteto |
| GOV-001 | governance | Validar matriz de papéis piloto | decision | medium | backlog | EA-001 | Security Reviewer |
| ENA-001 | enablement | Criar guia de operador piloto | documentation | medium | backlog | GOV-001 | Jules Doc |
| UI-001 | ui | Contratar superfícies prioritárias | contract | medium | backlog | PM-001, CAP-001 | Jules Dev |
