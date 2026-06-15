import { ProcessPayload, ProcessPayloadSchema } from "../types/process-payload";

/**
 * Maps raw data to a canonical ProcessPayload.
 * Ensures snake_case to camelCase normalization.
 */
export function mapToProcessPayload(raw: unknown): ProcessPayload {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;

  const normalized = {
    id: data.id,
    instanceId: data.instanceId ?? data.instance_id,
    workspaceId: data.workspaceId ?? data.workspace_id,
    schemaVersion: data.schemaVersion ?? data.schema_version,
    data: data.data,
    createdAt: data.createdAt ?? data.created_at,
    updatedAt: data.updatedAt ?? data.updated_at,
  };

  return ProcessPayloadSchema.parse(normalized);
}
