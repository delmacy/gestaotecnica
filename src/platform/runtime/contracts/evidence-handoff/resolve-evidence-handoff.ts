import { RuntimeEvidenceHandoffRequest, RuntimeEvidenceHandoffResponse } from "./evidence-handoff-contract";
import { v4 as uuidv4 } from "uuid";

export async function resolveRuntimeEvidenceHandoff(
  request: RuntimeEvidenceHandoffRequest,
  userRole: string = 'runtime_user',
  environmentId: string = 'production'
): Promise<RuntimeEvidenceHandoffResponse> {

  if (!request.processId || !request.timestamp || Object.keys(request.executionPayload).length === 0) {
    return {
      success: false,
      message: "Required information missing",
      status: "empty"
    };
  }

  if (userRole === 'blocked' || environmentId === 'prod-restricted' || userRole !== 'runtime_user') {
    return {
      success: false,
      message: "Submission Restricted: Lacks runtime deployment privileges or session expired",
      status: "blocked"
    };
  }

  if (environmentId === 'demo' || request.processId.startsWith('demo-')) {
    const demoEvidenceId = `demo_${uuidv4()}`;
    return {
      success: true,
      evidenceId: demoEvidenceId,
      receiptUrl: `/runtime/evidence/${demoEvidenceId}/receipt`,
      message: "Logged to Demo Vault",
      status: "demo"
    };
  }

  if (environmentId === 'synthetic' || request.processId.startsWith('synth-')) {
    const synthEvidenceId = `synth_${uuidv4()}`;
    return {
      success: true,
      evidenceId: synthEvidenceId,
      receiptUrl: `/runtime/evidence/${synthEvidenceId}/receipt`,
      message: "Synthetic Record",
      status: "synthetic"
    };
  }

  const liveEvidenceId = `live_${uuidv4()}`;
  return {
    success: true,
    evidenceId: liveEvidenceId,
    receiptUrl: `/runtime/evidence/${liveEvidenceId}/receipt`,
    message: "Official Record Captured",
    status: "success"
  };
}
