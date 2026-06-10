# PM-PILOT-001: Technical Service Intake Pilot

## 1. Nome do processo piloto
Entrada de chamado técnico

## 2. Motivo da escolha
O fluxo de entrada de chamados técnicos testa uma ampla variedade de capabilities universais (solicitações, comunicação, gestão de pessoas, ordens de trabalho, etc.) sem precisar inicialmente de transações complexas de faturamento ou integrações profundas com sistemas legados externos.

## 3. Escopo incluído
- Triagem do chamado
- Conversão em ordem de serviço
- Atribuição ao técnico apropriado
- Execução
- Registro de evidência de conclusão
- Validação
- Encerramento

## 4. Fora de escopo
- Faturamento (financeiro)
- Compras de equipamentos/materiais (procurement)
- Acordos de Nível de Serviço (SLA) avançados e multas

## 5. Participantes esperados
- Solicitante (Cliente/Usuário Final)
- Atendente/Triador
- Técnico (Executor)
- Supervisor (Validador)

## 6. Fontes esperadas
- Relatos de operadores (entrevistas sobre como o trabalho é feito hoje)
- Exemplo de chamado atual (print/mensagem)
- Planilha existente de acompanhamento de chamados
- Mensagens de comunicação via WhatsApp/E-mail (fictícias se houver dados sensíveis)
- Fluxo verbal de decisão de triagem
- Histórico de ordens (amostra anonimizada)

## 7. Evidências esperadas
- O registro textual e visual (prints/mensagens anonimizadas) que demonstra a transferência de informações entre Solicitante, Atendente e Técnico.
- Linhas de planilha que representam o estado atual do chamado.

## 8. Riscos de observação
- Obter dados pessoais reais de clientes durante a captura de exemplos.
- Achar que o processo relatado verbalmente é igual à realidade (viés do operador).
- Assumir automações não-existentes.

## 9. Consentimento e limites
- Qualquer observação precisará do consentimento explícito dos observados (atendentes e técnicos).
- Dados sensíveis reais (telefones, nomes completos de clientes) serão substituídos por dados fictícios (ex: "Cliente A").

## 10. Capabilities candidatas
- `requests` (A solicitação inicial)
- `communication` (A troca de mensagens)
- `people` (Identificação do solicitante e técnico)
- `work_orders` (A ordem de serviço criada após triagem)
- `documents` (O anexo com o print do problema)
- `audit` (Rastreabilidade de quem aprovou/encerrou)
- `scheduling` (Definição da janela de atendimento)
- `governance` (Garantir que o técnico não pode auto-aprovar validação)
- `enablement` (Checklists de execução do chamado)

*Nota: Estas capabilities são candidatas e só serão confirmadas na fase de extração e mapeamento.*

## 11. Superfícies de UI impactadas
- Área do Solicitante (Formulário de Abertura)
- Inbox de Atendimento/Triagem
- Fila de Trabalho do Técnico
- Painel de Supervisão (Validação e Encerramento)

## 12. Papéis envolvidos
- `Requester`
- `Dispatcher` (Triagem)
- `Technician`
- `Supervisor`

## 13. Permissões preliminares
- Requester pode apenas criar chamados e ver o próprio status.
- Dispatcher pode transformar chamado em OS e atribuir.
- Technician pode atualizar status e registrar evidências.
- Supervisor pode validar e encerrar a OS.

## 14. Instruções operacionais preliminares
- Quando a observação iniciar, documentar o "caminho feliz" primeiro.
- Não documentar desvios excessivos no primeiro ciclo.
- Se o processo observado pular a "Validação" para ir direto a "Encerramento", registrar o pulo; não inventar a etapa.

## 15. Critério de aceite do piloto
- O piloto foi definido, e há consenso sobre o escopo e consentimento necessários para prosseguir para a etapa de captura de observações reais.

## 16. Próximas tasks desbloqueadas
- `PM-PILOT-002` - Capturar fontes e observações piloto.
