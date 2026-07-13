import { RuntimeSupportLookupQuery } from "@/features/workflow/runtime/envelopes/runtime-support-lookup-query";

export const VALID_RUNTIME_SUPPORT_LOOKUP_QUERY: RuntimeSupportLookupQuery = {
  organizationId: "123e4567-e89b-12d3-a456-426614174000",
  workspaceId: "123e4567-e89b-12d3-a456-426614174001",
  correlationId: "corr-123",
};

export const INVALID_RUNTIME_SUPPORT_LOOKUP_QUERY_MISSING_WORKSPACE = {
  organizationId: "123e4567-e89b-12d3-a456-426614174000",
  correlationId: "corr-123",
};

export const INVALID_RUNTIME_SUPPORT_LOOKUP_QUERY_EXTRA_FIELDS = {
  organizationId: "123e4567-e89b-12d3-a456-426614174000",
  workspaceId: "123e4567-e89b-12d3-a456-426614174001",
  correlationId: "corr-123",
  extraField: "not-allowed",
};
