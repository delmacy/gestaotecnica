# Inbound Integration Contract

O processo de ingestão obedece:
1. Recebimento do payload bruto.
2. Sanitização estrita (Remoção de secrets).
3. Criação de um `Gateway Receipt`.
4. Tradução para um Evento/Comando canônico.
5. Inserção do Evento/Comando na fila do runtime para processamento.

Nenhuma regra de negócio deve ser processada no momento do Inbound.
