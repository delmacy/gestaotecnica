import { ProcessPayload, ProcessPayloadSchema } from "../types/process-payload";

/**
 * Maps raw data to a canonical ProcessPayload.
 * Handles potential snake_case to camelCase conversion for mandatory fields.
 */
export function mapToProcessPayload(raw: any): ProcessPayload {
  const normalized: any = {
    id: raw.id,
    instanceId: raw.instanceId ?? raw.instance_id,
    workspaceId: raw.workspaceId ?? raw.workspace_id,
    schemaVersion: raw.schemaVersion ?? raw.schema_version,
    data: raw.data,
    createdAt: raw.createdAt ?? raw.created_at,
    updatedAt: raw.updatedAt ?? raw.updated_at,
  };

  return ProcessPayloadSchema.parse(normalized);
}
