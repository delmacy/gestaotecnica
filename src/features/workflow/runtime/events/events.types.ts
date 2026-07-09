export type EventPayload = Record<string, unknown>;

export type ProcessEventType =
  | "process.started"
  | "process.completed"
  | "step.started"
  | "step.completed";

export interface LogEventInput {
  workspaceId: string;
  instanceId?: string;
  eventType: ProcessEventType;
  entityType: string;
  entityId?: string;
  actorType?: string;
  actorId?: string;
  source?: string;
  correlationId?: string;
  causationId?: string;
  payload?: EventPayload;
}

export interface EventRecord {
  id: string;
  workspaceId: string;
  instanceId: string | null;
  eventType: string;
  entityType: string;
  entityId: string | null;
  actorType: string | null;
  actorId: string | null;
  source: string | null;
  correlationId: string | null;
  causationId: string | null;
  payload: EventPayload;
  createdAt: Date;
}
