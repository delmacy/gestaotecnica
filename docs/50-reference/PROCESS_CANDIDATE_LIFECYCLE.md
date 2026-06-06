# Process Candidate Lifecycle

O ciclo de vida de uma proposta de processo formaliza a governança:

1. **Observação:** Sinais informais geram recorrência.
2. **Criação do Candidate:** Um humano ou agente documenta a hipótese (Draft/Under Analysis).
3. **Submissão:** O Candidato entra em `waiting_review`.
4. **Human Review:** Um arquiteto avalia as evidências, riscos e o desenho proposto.
   - **Rejeita:** Volta com justificativa.
   - **Aprova:** O Candidato vira `approved`.
5. **Publicação:** Compila-se o candidato em um `workflow_template` e publica-se a nova versão no Runtime.
6. **Métricas:** O runtime agora gera eventos baseados na nova versão oficial.
