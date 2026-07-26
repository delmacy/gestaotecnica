import { BuilderHandoffRequest, BuilderHandoffResponse } from "./handoff-contract";

export async function resolveBuilderHandoff(request: BuilderHandoffRequest): Promise<BuilderHandoffResponse> {
  // Validate request
  if (!request.appId || !request.version || !request.environmentId) {
    return {
      success: false,
      runtimeUrl: "",
      message: "Missing required fields",
      status: "empty"
    };
  }

  // Empty State: if an application has no viable versions deployed, the Builder to Runtime Handoff cannot be initiated
  if (request.version === '0.0.0' || request.version === 'empty') {
    return {
      success: false,
      runtimeUrl: "",
      message: "No configurations to deploy",
      status: "empty"
    };
  }

  // Blocked State: User lacks runtime deployment privileges
  if (request.environmentId === 'prod-restricted' || request.environmentId === 'blocked') {
    return {
      success: false,
      runtimeUrl: "",
      message: "Restricted",
      status: "blocked"
    };
  }

  // Demo State: Mimics a real deployment but provisions an ephemeral sandbox runtime instance
  if (request.environmentId === 'demo') {
    return {
      success: true,
      runtimeUrl: `/runtime/demo/${request.appId}?version=${request.version}`,
      handoffToken: `demo_token_${request.appId}_${request.version}`,
      message: "Deploy to Demo Runtime",
      status: "demo"
    };
  }

  // Synthetic Data State: Synthetically generated applications in the Builder
  if (request.environmentId === 'synthetic' || request.appId.startsWith('synth-')) {
    return {
      success: true,
      runtimeUrl: `/runtime/synthetic/${request.appId}?version=${request.version}`,
      handoffToken: `synth_token_${request.appId}_${request.version}`,
      message: "Deploy to Synthetic Runtime",
      status: "synthetic"
    };
  }

  // Real-Data State: Real configurations hand off to live production runtime servers
  return {
    success: true,
    runtimeUrl: `/runtime/app/${request.appId}?version=${request.version}`,
    handoffToken: `live_token_${request.appId}_${request.version}`,
    message: "Deploying to Production Network",
    status: "success"
  };
}
