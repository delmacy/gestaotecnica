# Variantes e Exceções Preliminares (Process Variants and Exceptions)

## Contexto
Este documento lista desvios possíveis e fluxos alternativos do caminho feliz estabelecido no rascunho de observações sintéticas (`AS_IS_MIRROR_DRAFT.md`). **Todas as variantes aqui listadas são CANDIDATAS**, ou seja, hipóteses que necessitam ser validadas nas entrevistas descritas em `HUMAN_VALIDATION_SCRIPT.md`.

## Matriz de Variantes

| variant_id | description | trigger | affected_steps | frequency_assumption | risk | related_capabilities | requires_validation |
|---|---|---|---|---|---|---|---|
| VAR-001 | Chamado com foto inicial | Cliente anexa evidência (foto) diretamente na primeira mensagem. | Etapas 2 e 3 (Pula o pedido de foto). | Média | Baixo. (Acelera triagem). | Communication, Documents | Sim |
| VAR-002 | Chamado sem foto inicial | Cliente relata problema mas não anexa nada para provar o defeito. | Etapa 3 (Atendente precisa pausar o fluxo e solicitar a imagem). | Alta | Médio (Pode criar fila de pendências longa na triagem). | Communication, Requests | Sim |
| VAR-003 | Chamado resolvido por orientação sem OS | O atendente instrui o cliente por WhatsApp (ex: reinicie o modem) e o problema some. | Etapas 4, 5, 6, 7, 8, 9 são abortadas. | Média | Alto se a interação não for registrada no sistema; vira "trabalho fantasma". | Knowledge/Guidance, Service History | Sim |
| VAR-004 | Chamado que vira OS | Triagem constata a necessidade real de deslocamento. O fluxo normal continua. | Etapa 5 (Início oficial no sistema). | Alta (Happy Path real). | Baixo. | Work Orders, Execution | Sim |
| VAR-005 | Técnico executa sem atribuição formal | O técnico está perto do cliente, atende via WhatsApp, e só depois se cria a OS "retroativamente". | Etapas 5 e 6 (Inversão de ordem ou pulo completo). | Baixa/Média | Crítico. Fura toda a SoD (Governança) e controle de SLA. | Audit, Work Orders, Governance | Sim |
| VAR-006 | Evidência rejeitada pelo supervisor | A foto enviada na Etapa 7 é borrada, ou incompleta. | Etapa 8 (Feedback para o técnico voltar e corrigir). | Baixa | Médio. Gera retrabalho logístico. | Quality Control, Audit | Sim |
| VAR-007 | Encerramento sem validação formal | Fim de expediente ou sistema fora do ar, técnico ou supervisor fecha sem atrelar a foto correta. | Etapas 8 e 9 (Fechamento forçado). | Baixa | Alto. Risco de faturar indevidamente ou ter auditoria falha do cliente final. | System Governance, Rules Engine | Sim |

## Notas para a Validação
* O entrevistador deve apresentar essas hipóteses ao Time de Atendimento e Supervisores (ex: "Vocês já passaram pela situação de o técnico resolver sem OS? Com que frequência isso ocorre?").
