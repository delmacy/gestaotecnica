# Regras de Execução do Bloco Alpha

1.  **Apenas Jules Dev pode executar implementação**: Fases de backend, frontend ou infraestrutura devem ser rigorosamente codificadas pelo Jules Dev. Jules Documental foca na manutenção do planejamento.
2.  **Uso de Contratos**: Nenhuma fase do Alpha (a partir da 28B) pode ser iniciada se não possuir um contrato claro baseado no `FEATURE_CONTRACT_TEMPLATE.md`.
3.  **Frontend Parity Gate**: Funcionalidades de backend devem ter um UI operável. Gaps explícitos devem ser limitados e bem justificados.
4.  **Sequência Mandatória**: As fases do bloco Alpha devem ser executadas de forma sequencial.
5.  **Workspace Isolation**: Todo acesso a dados sensíveis de processo precisa validar e utilizar o `workspace_id`.
