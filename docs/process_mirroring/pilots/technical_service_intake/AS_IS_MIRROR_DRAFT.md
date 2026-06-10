# As-Is Mirror Draft - Technical Service Intake (Pilot)

## 1. Resumo do processo observado/simulado
Este documento reflete a operação atual (As-Is) com base em observações sintéticas do fluxo de entrada de chamados técnicos. O solicitante envia problemas por WhatsApp, o atendente faz triagem manual via planilha, converte em OS, repassa ao técnico fora do sistema, e o encerramento exige validação de foto pelo supervisor.

## 2. Sequência As-Is
1. Solicitante envia mensagem reportando falha.
2. Atendente avalia a mensagem.
3. Atendente pergunta por foto (se faltar).
4. Atendente copia informações para uma planilha de controle.
5. Atendente/Triador cadastra os dados no sistema formalizando a OS.
6. Triador avisa o técnico (muitas vezes de forma verbal ou chat paralelo).
7. Técnico vai ao local, executa serviço e envia foto de conclusão.
8. Supervisor avalia a foto e clica em "Validar" no sistema.
9. Supervisor clica em "Encerrar" no sistema.

## 3. Atores e papéis
* Solicitante (`Requester`): Inicia o processo e responde perguntas.
* Atendente/Triador (`Dispatcher`): Opera a planilha e o sistema, atua como ponte.
* Técnico (`Technician`): Executa o serviço de fato.
* Supervisor (`Supervisor`): Garante que o serviço foi bem feito através da avaliação de evidências.

## 4. Ferramentas usadas
* WhatsApp: Comunicação com o cliente e com os técnicos.
* Excel/Planilha Google: Controle paralelo ("shadow IT") de chamados não formalizados ou fila de trabalho.
* Sistema Legado/Atual: Onde a OS "oficial" vive e onde ocorre o encerramento formal.

## 5. Artefatos produzidos
* Mensagem de solicitação (texto/foto).
* Linha na planilha de triagem.
* Ordem de Serviço (OS) cadastrada.
* Foto de evidência de conclusão.

## 6. Estados implícitos percebidos
* "Aguardando foto do cliente" (na mente do atendente, muitas vezes).
* "Na planilha, mas não no sistema" (gap temporário de visibilidade).
* "Técnico ciente, mas não atribuído formalmente" (estado oral).

## 7. Decisões observadas
* Abertura ou não de OS (Dispatcher): Decide se o problema exige envio de técnico ou pode ser resolvido com uma orientação via chat.
* Validação da foto (Supervisor): Decide se o reparo atende aos padrões de qualidade ou se o técnico precisa refazer.

## 8. Exceções possíveis
* Cliente relata problema sem clareza.
* Cliente não possui foto do problema.
* Técnico avisa por telefone que concluiu mas esqueceu a foto.
* Supervisor recusa a evidência enviada.

## 9. Workarounds
* Uso de planilha para controlar a fila antes da inserção no sistema oficial (Sistema atual é lento ou exige preenchimento que o cliente ainda não passou).
* Avisar o técnico por chat/verbal (Sistema oficial não notifica o técnico adequadamente).

## 10. Gaps de evidência
* Todas as observações até o momento são SINTÉTICAS/SIMULADAS.
* Não temos prints reais de como os atendentes estruturam a planilha.
* Não sabemos quais campos do sistema legado são de preenchimento obrigatório e atrapalham a criação de OS.

## 11. Pontos que precisam de validação humana
* O supervisor de fato valida a foto para 100% dos chamados antes de encerrar, ou só para técnicos novatos/por amostragem?
* Qual o tempo médio (SLA) aceito entre a anotação na planilha e a conversão em OS?
* O técnico consegue ver o registro no sistema ou depende exclusivamente do WhatsApp do triador?
