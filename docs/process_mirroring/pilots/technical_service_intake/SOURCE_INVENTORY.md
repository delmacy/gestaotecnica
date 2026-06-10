# Source Inventory - Technical Service Intake (Pilot)

| source_id | source_type | description | owner_or_role | sensitivity | contains_personal_data | collection_status | consent_required | sanitization_required | evidence_path_or_reference | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| SRC-SIM-001 | operator_interview | Entrevista simulada com atendente sobre fluxo de triagem | Dispatcher | low | false | synthetic_created | false | false | N/A | Exemplo sintético criado para estruturação do piloto |
| SRC-SIM-002 | message_sample | Exemplo simulado de mensagem de abertura de chamado via WhatsApp | Requester | high | true (simulated) | synthetic_created | true | true | EV-SIM-001 | Simula o envio de foto de um equipamento quebrado e endereço |
| SRC-SIM-003 | spreadsheet_row | Linha simulada em planilha de controle de ordens atual | Dispatcher | medium | true (simulated) | synthetic_created | false | true | EV-SIM-002 | Simula o registro manual temporário antes da OS formal |
| SRC-SIM-004 | verbal_flow | Relato verbal simulado de triagem para técnico | Dispatcher/Technician | low | false | synthetic_created | false | false | N/A | Exemplo de comunicação informal (Workaround) |
| SRC-SIM-005 | ticket_example | Print simulado da criação da ordem de serviço no sistema | Dispatcher | medium | true (simulated) | synthetic_created | false | true | EV-SIM-003 | Representa o formulário de OS preenchido |
| SRC-SIM-006 | execution_evidence | Foto simulada de equipamento consertado enviada pelo técnico | Technician | medium | false | synthetic_created | true | false | EV-SIM-004 | Simula a evidência final |
| SRC-SIM-007 | supervisor_validation | Nota simulada de validação no sistema ou via chat | Supervisor | low | false | synthetic_created | false | false | EV-SIM-005 | Simula a aprovação final para encerramento |
| SRC-REAL-001 | ticket_example | Print real de um chamado aberto | Dispatcher | high | true | blocked | true | true | N/A | Aguardando fornecimento pelo cliente |
| SRC-REAL-002 | spreadsheet_row | Exporte de planilha real com 5 linhas | Dispatcher | medium | true | blocked | false | true | N/A | Aguardando fornecimento pelo cliente |
| SRC-REAL-003 | execution_evidence | Print real de evidência final com aprovação | Supervisor | medium | false | blocked | true | false | N/A | Aguardando fornecimento pelo cliente |
