# Checklist de Submissão de Fontes Reais

Este documento acompanha o pacote de solicitação de fontes. O PO ou Responsável pelo Cliente deve preencher/verificar a coluna "status" e outras informações antes do envio, e a equipe de análise atualizará o "aprovado para análise" ao receber.

**Processo:** Technical Service Intake

| ID Fonte | Fonte Solicitada | Qtde Mínima | Status | Responsável | Sensibilidade | Anonimização Feita? | Consentimento Necessário? | Recebido em | Aprovado p/ Análise | Observações |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| SRC-01 | Exemplos de chamados/mensagens reais | 3 | pending | | Alta (PII) | [ ] | Sim | | | Pode ser print de WhatsApp borrado ou texto copiado com nomes trocados. |
| SRC-02 | Linhas da planilha atual de controle | 5 | pending | | Média/Alta | [ ] | Sim | | | Exportação Excel/CSV com colunas PII removidas. |
| SRC-03 | Print de uma OS no sistema atual | 1 | pending | | Baixa/Média | [ ] | Sim | | | Borrar dados do cliente, mas manter os labels/nomes dos campos visíveis. |
| SRC-04 | Respostas do roteiro humano - Dispatcher | 1 set | pending | | Baixa | [ ] | Sim | | | Preencher `INTERVIEW_CAPTURE_FORM.md`. |
| SRC-05 | Respostas do roteiro humano - Técnico | 1 set | pending | | Baixa | [ ] | Sim | | | Preencher `INTERVIEW_CAPTURE_FORM.md`. |
| SRC-06 | Respostas do roteiro humano - Supervisor | 1 set | pending | | Baixa | [ ] | Sim | | | Preencher `INTERVIEW_CAPTURE_FORM.md`. |
| SRC-07 | Aceite formal (Consentimento) | 1 | pending | | N/A | [ ] N/A | Sim | | | Arquivo `CONSENT_TEMPLATE.md` assinado/preenchido. |

## Status Permitidos para a Tabela

Ao preencher ou atualizar a tabela, utilize um dos seguintes status:
- `pending`: Fonte aguardando envio pelo cliente.
- `received`: Fonte recebida, mas ainda não validada pela equipe de análise.
- `needs_sanitization`: Fonte recebida, mas continha dados reais sensíveis não anonimizados (precisa ser reenviada limpa).
- `approved_for_analysis`: Fonte recebida, limpa e adequada para ser usada na modelagem.
- `rejected`: Fonte inadequada, fora de escopo ou inválida para a análise.
- `not_available`: O cliente informou que não possui essa fonte ou não pode fornecê-la (exige registro de gap e workaround).
