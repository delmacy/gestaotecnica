# Evidence Matrix - Technical Service Intake (Pilot)

| evidence_id | observation_id | evidence_type | description | supports_fact | sensitivity | sanitization | confidence | gap |
|---|---|---|---|---|---|---|---|---|
| EV-SIM-001 | OBS-SIM-001, OBS-SIM-003 | message | Print simulado de WhatsApp do cliente relatando falha | Ocorrência do contato e conteúdo bruto | high | yes (simulated) | medium | Falso (Sintético). Precisa de print real anonimizado. |
| EV-SIM-002 | OBS-SIM-002 | spreadsheet | Linha simulada em planilha de controle paralela | Registro intermediário manual | medium | yes (simulated) | medium | Falso (Sintético). Precisa de exporte de linha real da planilha de controle. |
| EV-SIM-003 | OBS-SIM-004 | work_order_record | Print simulado de OS cadastrada no sistema | A formalização da ordem ocorreu | medium | yes (simulated) | medium | Falso (Sintético). Precisa de dump ou print de OS real do sistema. |
| EV-SIM-004 | OBS-SIM-006 | photo | Foto simulada de equipamento reparado | Execução realizada e reportada | low | no | high | Falso (Sintético). Precisa de exemplo real de foto de evidência aceita. |
| EV-SIM-005 | OBS-SIM-007, OBS-SIM-008 | system_log | Histórico de status alterado para "Validado" e "Encerrado" | Ação de fechamento da OS | low | no | high | Falso (Sintético). Precisa de log real de aprovação no sistema legado. |
