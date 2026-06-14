import { ProcessPayload, ProcessPayloadSchema } from "../types/process-payload";

export function mapToProcessPayload(raw: unknown): ProcessPayload {
  return ProcessPayloadSchema.parse(raw);
}
