# As-Is Validation Matrix

## Contexto
Esta matriz avalia as etapas observadas no fluxo provisório (`AS_IS_MIRROR_DRAFT.md`), indicando a confiança baseada nas fontes e evidências atualmente disponíveis. Devido à dependência de dados simulados (PM-PILOT-002), nenhuma etapa pode ser dada como validada até a obtenção de consentimento e artefatos operacionais concretos.

## Matriz de Validação

| validation_id | as_is_step | source_observations | supporting_evidence | confidence | validation_status | requires_human_confirmation | related_gap | notes |
|---|---|---|---|---|---|---|---|---|
| VAL-01 | 1. Solicitante envia mensagem reportando falha. | OBS-001 (Simulada) | WhatsApp Mock | Baixa (Sintético) | needs_human_confirmation | Sim | GAP-001 | Faltam prints reais de solicitações; não sabemos se há um padrão ou desestruturação completa. |
| VAL-02 | 2. Atendente avalia a mensagem. | OBS-002 (Simulada) | Nenhum | Baixa (Sintético) | needs_human_confirmation | Sim | GAP-002 | A triagem mental não tem registro; apenas a linha da planilha. |
| VAL-03 | 3. Atendente pergunta por foto (se faltar). | OBS-003 (Simulada) | WhatsApp Mock | Baixa (Sintético) | needs_human_confirmation | Sim | GAP-001 | Ocorre sempre ou só em alguns tipos de falha? |
| VAL-04 | 4. Atendente copia informações para uma planilha de controle. | OBS-004 (Simulada) | Planilha Mock | Baixa (Sintético) | needs_human_confirmation | Sim | GAP-002 | Quais colunas são realmente preenchidas na prática (versus as planejadas)? |
| VAL-05 | 5. Atendente/Triador cadastra os dados no sistema formalizando a OS. | OBS-005 (Simulada) | OS Legacy Mock | Baixa (Sintético) | needs_human_confirmation | Sim | GAP-003 | Necessitamos de um print da tela real para entender campos obrigatórios e layout. |
| VAL-06 | 6. Triador avisa o técnico. | OBS-006 (Simulada) | Mensagem Mock | Baixa (Sintético) | needs_human_confirmation | Sim | GAP-004 | Como o técnico realmente é acionado se ele não usa o sistema ativamente? |
| VAL-07 | 7. Técnico vai ao local, executa serviço e envia foto de conclusão. | OBS-007 (Simulada) | Foto Mock | Baixa (Sintético) | needs_human_confirmation | Sim | GAP-004 | A foto vai para o WhatsApp ou o sistema? E quando não há internet? |
| VAL-08 | 8. Supervisor avalia a foto e clica em "Validar" no sistema. | OBS-008 (Simulada) | Log Mock | Baixa (Sintético) | needs_human_confirmation | Sim | GAP-005 | Qual o critério exato de validação? É amostral ou censitário? |
| VAL-09 | 9. Supervisor clica em "Encerrar" no sistema. | OBS-008 (Simulada) | Log Mock | Baixa (Sintético) | needs_human_confirmation | Sim | GAP-005 | Existem consequências secundárias (ex: faturamento) após o encerramento? |

## Resumo das Exigências
- Todas as etapas baseadas em dados sintéticos (Atuais 100%) requerem `needs_human_confirmation`.
- Validação final só ocorrerá após os GAP-001 a GAP-005 serem endereçados com capturas reais ou com consentimento explícito do cliente para supor o cenário.
