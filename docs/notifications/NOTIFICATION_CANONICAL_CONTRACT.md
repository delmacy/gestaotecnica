# Notification Canonical Contract

## Visão Geral
Este documento define a fundação canônica para o módulo de notificações do System Builder Platform. O objetivo é fornecer uma estrutura de dados e regras de negócio agnósticas a provedores externos para o gerenciamento de intenções, entregas e estados de notificação.

## Modelo Canônico

### NotificationIntent
Representa a intenção original de enviar uma notificação.

- **id**: Identificador único da intenção.
- **workspaceId**: Identificador do workspace (tenancy obrigatória).
- **recipient**: Destinatário da notificação (veja seção Recipient).
- **channel**: Canal de entrega (veja seção Canais).
- **priority**: Prioridade da entrega (low, normal, high, urgent).
- **template**: Referência opcional a um template versionado.
- **subject**: Assunto opcional.
- **payload**: Dados dinâmicos para interpolação no template.
- **scheduledAt**: Timestamp opcional para envio agendado.
- **expiresAt**: Timestamp opcional para expiração da validade.
- **correlationId**: Identificador de correlação (obrigatório).
- **causationId**: Identificador do evento causador.
- **metadata**: Metadados genéricos adicionais.

### Recipient
Tipos de destinatários suportados:

- **user**: Usuário interno da plataforma. Requer `userId`.
- **role**: Papel/Cargo. Requer `roleId`.
- **team**: Equipe. Requer `teamId`.
- **external_address**: Endereço externo (email ou telefone). Requer `address`.
- **webhook_endpoint**: Endpoint para webhooks. Requer `url`.

### Canais
- **in_app**: Notificações internas no sistema.
- **email**: Correio eletrônico. Requer endereço válido.
- **sms**: Mensagens curtas de texto. Requer telefone em formato E.164.
- **push**: Notificações push para dispositivos móveis/browser.
- **webhook**: Envio de dados para sistemas externos. Requer endpoint URL.

### Estados de Entrega
- **pending**: Aguardando processamento inicial.
- **queued**: Na fila do provedor ou do sistema.
- **processing**: Em tentativa de envio.
- **delivered**: Confirmado pelo provedor como entregue.
- **failed**: Falha definitiva ou após exaustão de tentativas.
- **cancelled**: Cancelado antes da entrega.
- **suppressed**: Silenciado por preferências ou regras de quiet hours.

### Prioridades
- **low**: Entrega sem pressa, pode ser agrupada.
- **normal**: Fluxo padrão.
- **high**: Prioritário, processamento imediato na fila.
- **urgent**: Crítico, bypass de certas regras de silenciamento se permitido.

### Preferências (NotificationPreference)
Modelagem de preferências de usuário:
- **enabledChannels**: Canais permitidos.
- **disabledChannels**: Canais bloqueados.
- **quietHours**: Horários de silêncio configuráveis.
- **timezone**: Fuso horário para aplicação de quiet hours.
- **categories**: Ativação/Desativação por categoria de notificação.

## Entrega e Tentativas

### NotificationDelivery
Objeto que rastreia o ciclo de vida de entrega de uma `NotificationIntent`.
- Mantém `intentId` e `workspaceId`.
- Lista de `attempts`.
- Status consolidado.

### NotificationAttempt
Registro de cada tentativa individual de envio.
- Número da tentativa.
- Timestamp.
- Status daquela tentativa.
- Referência externa do provedor (`providerReference`).
- Dados de falha se houver.

### NotificationFailure
- **code**: Código de erro sanitizado.
- **reason**: Descrição humana do erro (sem segredos técnicos).

## Exemplos JSON

### Minimal NotificationIntent
```json
{
  "id": "intent-001",
  "workspaceId": "550e8400-e29b-41d4-a716-446655440000",
  "recipient": {
    "type": "user",
    "userId": "usr_123"
  },
  "channel": "in_app",
  "priority": "normal",
  "payload": {
    "message": "Você tem uma nova tarefa."
  },
  "correlationId": "corr_987",
  "metadata": {}
}
```

### Webhook NotificationIntent
```json
{
  "id": "intent-002",
  "workspaceId": "550e8400-e29b-41d4-a716-446655440000",
  "recipient": {
    "type": "webhook_endpoint",
    "url": "https://api.partner.com/events"
  },
  "channel": "webhook",
  "priority": "high",
  "payload": {
    "event": "order.completed",
    "orderId": "ord_555"
  },
  "correlationId": "corr_555",
  "metadata": {
    "source": "order-service"
  }
}
```

## Regras e Limites desta Fase
- Não há implementação de provedores reais (AWS SES, Twilio, etc).
- Não há persistência em banco de dados.
- Funções de domínio são puras e determinísticas.
- Validação de destinatário vs Canal é aplicada na criação da intenção.
- IDs e Timestamps devem ser fornecidos externamente às funções puras.

## Idempotência Futura
A `correlationId` é obrigatória e servirá como base para garantir que a mesma intenção não gere múltiplas entregas duplicadas em fases futuras de implementação da engine.
