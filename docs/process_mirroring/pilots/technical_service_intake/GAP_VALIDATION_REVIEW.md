# Revisão de Gaps de Validação (Gap Validation Review)

## Contexto
Este documento classifica os gaps encontrados em `COLLECTION_GAPS.md` oriundos da captura sintética (PM-PILOT-002), avaliando seu impacto na extração de capabilities, nos contratos de UI e nas permissões (Governance).

## Matriz de Revisão

| gap_id | severity | blocks_capability_matching | blocks_ui_contract | blocks_governance | required_action | minimum_evidence_needed | can_continue_with_assumption | decision |
|---|---|---|---|---|---|---|---|---|
| GAP-001 (Falta print anonimizado cliente) | high | Sim (Incompleto) | Sim | Não | Solicitar dump anonimizado de interações reais via WhatsApp/E-mail. | 3 transcrições anonimizadas. | Não. Sem isso, a UI da frente de entrada será um chute. | BLOCKED. Requer fontes. |
| GAP-002 (Falta linha planilha controle) | high | Sim | Sim | Não | Solicitar CSV parcial ou print das colunas da planilha usada na triagem. | Nomes e formatos de 5 colunas customizadas. | Não. Impacta os campos customizáveis do System Builder. | BLOCKED. Requer fontes. |
| GAP-003 (Falta exemplo OS no sistema) | medium | Sim (Incompleto) | Não (Diretamente) | Sim | Obter print borrado de tela do sistema de OS atual. | Print exibindo campos obrigatórios legados. | Sim (Com ressalva), podemos derivar a Work Order capability base. | CONTINUE_WITH_ASSUMPTION. |
| GAP-004 (Falta validação com técnico) | high | Sim | Sim | Não | Agendar entrevista (15min) ou capturar como ele recebe o repasse. | Confirmação se usa WhatsApp vs. Sistema no celular. | Não. Desenhar a mobile capability sem saber a realidade falhará. | BLOCKED. Requer entrevista. |
| GAP-005 (Falta validação supervisor) | high | Sim | Não | Sim | Acompanhar a avaliação das fotos. | Documentação do critério de recusa ou aprovação de OS. | Não. Bloqueia as capabilities de "audit" e "governance". | BLOCKED. Requer entrevista/observação. |
| GAP-006 (Falta consentimento formal) | critical | Sim | Sim | Sim | Obter e-mail de aceite do cliente para mapear o processo e dados. | PDF ou Email salvo com o "DE ACORDO". | Não. Eticamente inaceitável. | BLOCKED. Obtenção imediata. |

## Conclusões
* **Bloqueio de Entendimento de UI:** GAP-001 e GAP-002 impedem de entender os dados de entrada (UI de intake e formulários). GAP-004 bloqueia qualquer contrato focado em Mobile/Técnicos.
* **Bloqueio de Permissão (Governance):** GAP-005 bloqueia o entendimento da "Segregação de Funções" (SoD). Se o próprio técnico pudesse aprovar a foto, não existiria GAP-005; como não sabemos as regras exatas do supervisor, a matriz de papéis (GOV-PILOT-001) fica paralisada.
* **Bloqueio Geral (Capability Matching):** GAP-006 (Falta de consentimento) sendo um item crítico paralisa totalmente a formalização do Piloto, e a ausência dos artefatos de 1, 2, 4 e 5 bloqueiam as extrações sólidas.
