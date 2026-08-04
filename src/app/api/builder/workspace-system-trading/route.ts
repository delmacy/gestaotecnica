import { NextResponse } from "next/server";
import {
  getSystemTradingWorkspaceRegistration,
  registerSystemTradingWorkspace,
} from "@/platform/workspaces/system-trading";
import { createPlatformError } from "@/platform/errors";

/**
 * Operator action that proves workspace and capability visibility end to end:
 * the System Trading workspace is registered (idempotent upsert), then read
 * back from persistence. The response derives its evidence from comparing the
 * registration result with the persisted read-back, never from static claims.
 */
export async function GET() {
  try {
    const registrationResult = await registerSystemTradingWorkspace();
    const readBackRegistration = await getSystemTradingWorkspaceRegistration();

    const enabledModule = readBackRegistration?.modules.find(
      (module) => module.isEnabled,
    );

    const evidence = {
      persisted: !!readBackRegistration,
      canBeReadBack: !!readBackRegistration,
      workspaceKeyMatches:
        registrationResult.workspaceKey === readBackRegistration?.workspaceKey,
      tradingLabModuleMatches:
        registrationResult.tradingLabModuleKey === enabledModule?.moduleKey,
      repositoryMetadataMatches:
        JSON.stringify(registrationResult.repository) ===
        JSON.stringify(readBackRegistration?.repository),
      environmentMetadataMatches:
        JSON.stringify(registrationResult.environment) ===
        JSON.stringify(readBackRegistration?.environment),
    };

    return NextResponse.json(
      {
        registrationResult,
        readBackRegistration,
        evidence,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorEnvelope = createPlatformError(
      {
        code: "PLATFORM.API.INTERNAL_ERROR",
        category: "unexpected",
        severity: "error",
        message: "Failed to demonstrate workspace visibility",
        details: {
          error: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { id: crypto.randomUUID(), timestamp: new Date().toISOString() },
    );
    return NextResponse.json(errorEnvelope, { status: 500 });
  }
}
