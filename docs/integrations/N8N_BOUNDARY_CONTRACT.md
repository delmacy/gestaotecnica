# n8n Boundary Contract

## O Papel do n8n
- **Borda Estrita:** O n8n é usado apenas como integrador de sinais e eventos com outras plataformas.
- **Não Toma Decisão:** O n8n não aprova processos, não gerencia Workspaces e não deve ter acessos diretos indiscriminados às tabelas do banco core (`tec_db`).
- **Comunicação:** O n8n conversa com a plataforma via chamadas REST/Webhook para endpoints estritos do API Gateway.
