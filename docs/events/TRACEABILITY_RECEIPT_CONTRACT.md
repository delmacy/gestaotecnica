# TRACEABILITY RECEIPT CONTRACT

O Canhoto de Rastreabilidade (`TraceabilityReceipt`) é o pilar de auditoria legal, controle de evidências e "Cadeia de Conhecimento" do System Builder.

## Diferenciação Essencial

* **NÃO** é o Event Log (que aponta state transitions atômicas de domínio).
* **NÃO** é Delivery Receipt (que lida com transporte e acks de sistemas).
* **NÃO** é Gateway Receipt (que lida com ingestion inicial).
* O Canhoto de Rastreabilidade é uma construção consolidada (Snapshot assinado e estendido) focada na **Evidência de que uma Transformação completa se deu**, cobrindo ponta-a-ponta "Por quê, Quem, Como e o Resultado".

## Finalidade Principal

1. **Cadeia de Conhecimento:** Criar link direto de prova entre o Source inicial, os atores (candidate, revisor), o Blueprint de execução, eventos emitidos e o status da regra de negócio gerada.
2. **Auditoria / Legal:** Comprovação da transformação exata sofrida num dado instante temporal (muito exigido na Gestão Técnica onde ações e licenças precisam de proof-of-work inquestionável).
3. **Preservação de Evidência:** Salvar hashes de conteúdo não repudiáveis e referências perenes a documentos baseados na operação.

## Modelo Conceitual (TraceabilityReceipt)

```json
{
  "id": "uuid",
  "workspaceId": "uuid",
  "receiptKind": "string",
  "subjectType": "string",
  "subjectId": "string",
  "sourceReference": "string",
  "commandReference": "string",
  "eventReferences": "Array<string>",
  "resultReference": "string",
  "actorReference": "string",
  "correlationId": "string",
  "causationChain": "Array<string>",
  "evidenceReferences": "Array<string>",
  "documentReferences": "Array<string>",
  "contentHash": "string",
  "generatedAt": "datetime",
  "schemaVersion": "string",
  "redactionStatus": "string",
  "verificationStatus": "string",
  "notes": "string"
}
```

## Restrições e Limites (Fase Atual)

- **Assinatura Digital (PKI / Crypto):** Implementação de assinaturas baseadas em infraestruturas criptográficas externas ou PGP está FORA do escopo desta fase.
- **Hashing Real:** A geração transacional do SHA-256 / SHA-3 em tempo real ou hashing de conteúdo não será implementada nos controllers ou DB hoje. Apenas garantimos no modelo lógico.
- O campo `eventReferences` armazenará apenas ponteiros imutáveis (IDs) e não recriará a árvore recursiva inteira, economizando custo computacional na persistência e delegando ao visualizador do Traceability Receipt resolver as cadeias completas no Runtime.
