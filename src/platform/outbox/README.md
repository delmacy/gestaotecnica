# Outbox

Outbox real ainda nao foi implementado.

Proxima etapa:

1. `event_logs`
2. `outbox_events`
3. worker
4. flow runner
5. integration deliveries

Nesta fase, o `emitEvent` chama o `FlowRunner` diretamente para provar o ciclo `Action -> Event -> Flow -> Action`.
