export type EventDefinition = {
  key: string;
  moduleKey: string;
  description?: string;
  payloadSchema?: unknown;
};

export type EmitEventInput = {
  eventType: string;
  entityType: string;
  entityId: string;
  payload?: Record<string, unknown>;
  causationId?: string;
};

export type EmittedEvent = EmitEventInput & {
  id?: string;
  correlationId: string;
};
