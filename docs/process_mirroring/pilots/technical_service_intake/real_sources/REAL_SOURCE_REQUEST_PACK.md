# Solicitação de Fontes Reais para Process Mirroring

## 1. Objetivo da Coleta
O objetivo desta coleta é obter dados reais da operação para validar e refinar o espelho do processo atual (Process Mirroring). Isto garantirá que o sistema a ser construído atenderá às reais necessidades do dia a dia da operação, substituindo dados sintéticos/simulados por informações fidedignas.

## 2. Processo Piloto
**Processo:** Technical Service Intake (Entrada de Chamado Técnico).

## 3. Por Que Fontes Reais São Necessárias?
Para garantir que a modelagem de domínio, UI e fluxo de eventos reflitam a realidade e não apenas a visão idealizada ou testes controlados. O uso de fontes reais evita:
* Omissão de campos críticos que só existem em planilhas ou "Shadow IT".
* Interface de usuário (UI) construída de forma incompatível com quem está no campo (ex: celular sem internet).
* Regras de validação de qualidade (auditoria de fotos) fora da realidade de aprovação do supervisor.
* Retrabalho de desenvolvimento ou rejeição do sistema pelos operadores na fase de rollout.

## 4. Fontes Mínimas Solicitadas para Desbloquear o Piloto
Para dar continuidade à análise e desbloquear as próximas fases do projeto, solicitamos os seguintes itens:
1. 3 exemplos anonimizados de chamados/mensagens reais.
2. 5 linhas anonimizadas da planilha atual de controle/triagem.
3. 1 print borrado/anonimizado de uma OS no sistema atual.
4. Respostas curtas do Dispatcher/Atendente ao roteiro humano de validação.
5. Respostas curtas de 1 Técnico ao roteiro humano de validação.
6. Respostas curtas de 1 Supervisor ao roteiro humano de validação.
7. Aceite formal (consentimento) do responsável pelo processo.

## 5. Quais Dados Devem Ser Anonimizados?
Antes do envio, os seguintes dados devem ser **removidos ou mascarados**:
* Nome completo de clientes, funcionários ou terceiros.
* Telefones reais.
* CPF/RG ou qualquer documento de identificação.
* Endereços completos (rua, número, complemento).
* Placas de veículos.
* Matrículas de funcionários.
* E-mails pessoais.
* Fotos onde apareçam rostos de pessoas.
* Quaisquer outras informações sensíveis não estritamente necessárias para entender a mecânica da operação.

## 6. Quais Dados NÃO Devem Ser Enviados?
Qualquer dado que viole regras de privacidade, senhas, chaves de acesso a sistemas, informações financeiras confidenciais da empresa e dados PII (Personally Identifiable Information) sem o devido mascaramento. Não enviar bases de dados completas.

## 7. Como Enviar Exemplos com Segurança?
1. Preencha o Termo de Consentimento (`CONSENT_TEMPLATE.md`).
2. Aplique as regras de anonimização conforme o `ANONYMIZATION_GUIDE.md`.
3. Verifique se os itens enviados conferem com o `SOURCE_SUBMISSION_CHECKLIST.md`.
4. Envie os arquivos e respostas por canal seguro previamente combinado (ex: pasta de projeto na nuvem, e-mail do PO para a equipe de Process Mirroring, etc), em formato PDF, imagens PNG/JPEG ou texto.

## 8. Como Cada Fonte Será Usada?
* **Prints de chamados/mensagens:** Entender como a demanda chega, quais dados faltam no momento 0, identificar jargões.
* **Linhas da planilha:** Mapear propriedades reais de rastreamento (ex. prioridade, status temporários) antes de virar OS no sistema.
* **Print do sistema legado:** Mapear campos obrigatórios que não podem faltar no novo Intake.
* **Respostas do roteiro (entrevistas):** Subsituir fluxos "ideais" na documentação por caminhos "reais" (ex. uso de WhatsApp para aprovação).

## 9. Documentos que Serão Atualizados Após a Coleta
* `OBSERVATION_LOG.md`: Será atualizado com os novos apontamentos reais.
* `EVIDENCE_MATRIX.md`: Será preenchida com o rastreamento das fontes.
* `AS_IS_MIRROR_DRAFT.md`: Terá o fluxo atualizado de acordo com a realidade.
* `COLLECTION_GAPS.md`: Gaps que motivaram essa coleta serão resolvidos.

## 10. Tasks Desbloqueadas
O recebimento completo e aprovado destas fontes permitirá a execução de:
* **REAL-SRC-002**: Receber e analisar fontes reais anonimizadas.
* Em seguida, refinar e finalizar o fluxo permitindo o avanço para aprovação final de PM e início dos trabalhos das capacidades (CAP-VAL-002, UI e testes de prontidão DEV-READINESS-001).
