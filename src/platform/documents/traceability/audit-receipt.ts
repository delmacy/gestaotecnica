import { z } from "zod";
import {
  EntityIdSchema,
  CorrelationIdSchema,
  ActorReferenceSchema,
} from "../../contracts";

export const RedactionClassSchema = z.string().min(1);
export type RedactionClass = z.infer<typeof RedactionClassSchema>;

export const AuditTargetSchema = z.object({
  type: z.string().min(1),
  id: EntityIdSchema,
}).strict();
export type AuditTarget = z.infer<typeof AuditTargetSchema>;

export const AuditReceiptSchema = z.object({
  eventId: EntityIdSchema,
  correlationId: CorrelationIdSchema,
  actor: ActorReferenceSchema,
  target: AuditTargetSchema,
  redactionClass: RedactionClassSchema,
}).strict();

export type AuditReceipt = Readonly<z.infer<typeof AuditReceiptSchema>>;
