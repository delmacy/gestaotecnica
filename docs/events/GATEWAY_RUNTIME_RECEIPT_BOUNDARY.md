# GATEWAY RECEIPTS BOUNDARY & RUNTIME

Este contrato formaliza a fronteira exata entre os mecanismos puramente logísticos da Plataforma (Agent Gateway Intake) e os processos do Runtime de Workflow (Outbox, Receipts de Workflow e Rastreabilidade).

## Escopo Diferenciado

O **Agent Gateway Submission Receipt** (`src/features/platform/gateway/gateway.types.ts`) tem o papel exclusivo de documentar o ingresso "sujo" inicial (Ingestion Layer). Sua preocupação é apenas que a API ou o Webhook recebeu o payload HTTP, identificou a origem e gerou um carimbo. Ele **não valida lógica de negócio do blueprint, estado de banco ou a conclusão satisfatória de processo nenhum**.

O **Runtime Event / Outbox Entry** tem papel de documentar mudanças estruturais no domínio do banco de dados (o que aconteceu, para quem, e o que deve ser enviado assincronamente).

## Comparação de Campos Compartilháveis

Ambas as superfícies utilizam terminologia semelhante e alguns campos poderão ser lógicamente "reutilizados" para continuidade de correlação (desde que de forma ciente, não acoplada):

- `correlationId`: É compartilhado e passa a pertencer a toda a cadeia ("Gateway X envia comando de Iniciar Processo -> Processo gera Eventos Y, Z"). O `correlationId` é o fio condutor universal.
- `idempotencyKey`: Se oriundo do Agent, preserva-se até o boundary do runtime (vide `EVENT_IDEMPOTENCY_DEDUPLICATION_CONTRACT`).
- `workspaceId`: Universal (tenant isolamento principal).
- `source`: Universal (Agent, Webhook id).
- `createdAt`: Universal (mas em tabelas/arquiteturas diferentes e distantes no tempo).
- `sanitized_payload_reference`: Ambas não podem armazenar dados sensíveis cruzados; porém, seus algoritmos de hashing são distintos.

## Isolamento Imperativo (Anti-Confusão)

Os seguintes campos **NÃO** devem ser reutilizados ou confundidos:

- **Status:** O status "accepted" no Agent Gateway de forma alguma corresponde ao "accepted" do Delivery Receipt de Runtime, muito menos reflete processamento de Runtime Workflow, eles controlam tabelas independentes (Submissão vs Transporte de Saída).
- A tabela de Receipts de Gateway não pode ser utilizada ou herdada pelo Runtime via Drizzle FK ou ORM extends/union com o único propósito de economizar tabela; são domínios distintos (`platform` namespace vs `runtime` namespace).

## Nenhuma Modificação do Agent Gateway

Nenhuma alteração na UI do Gateway, APIs, queries, actions ou views do Agent Gateway (`/admin/gateway/receipts`) será realizada para refletir os estados e modelos do Runtime outbox e receipts. O Gateway atua corretamente para a finalidade a que foi proposto e permanecerá intocado e encapsulado de acordo com as regras restritivas desta fase.
