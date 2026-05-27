export type OutboxEventStatus = "pending" | "processing" | "delivered" | "failed";

export type OutboxEvent = {
  id: string;
  eventType: string;
  payload: Record<string, unknown>;
  status: OutboxEventStatus;
  availableAt: Date;
  attempts: number;
};
