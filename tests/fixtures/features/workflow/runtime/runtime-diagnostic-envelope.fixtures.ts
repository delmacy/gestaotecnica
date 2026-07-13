import { RuntimeDiagnosticEnvelope } from "@/features/workflow/runtime/envelopes/runtime-diagnostic-envelope";

export const VALID_RUNTIME_DIAGNOSTIC_ENVELOPE: RuntimeDiagnosticEnvelope = {
  correlationId: "corr-123",
  processId: "proc-123",
  actionId: "act-123",
  redactionClass: "RESTRICTED",
};

export const INVALID_RUNTIME_DIAGNOSTIC_ENVELOPE_EMPTY_CORRELATION = {
  correlationId: "",
  processId: "proc-123",
  actionId: "act-123",
  redactionClass: "RESTRICTED",
};

export const INVALID_RUNTIME_DIAGNOSTIC_ENVELOPE_WITH_PAYLOAD = {
  correlationId: "corr-123",
  processId: "proc-123",
  actionId: "act-123",
  redactionClass: "RESTRICTED",
  payload: { sensitive: "data" },
};
