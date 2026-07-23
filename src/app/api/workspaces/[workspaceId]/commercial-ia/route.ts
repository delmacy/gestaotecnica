import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { workspaces } from "@/db/runtime/schema/workspace";
import { workspaceModuleConfigs } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  type TenantCommercialContext,
  type CommercialCapability,
  type CapabilityStatus,
} from "@/platform/commercial/contracts/commercial-ia-map";
import { ErrorFactory } from "@/platform/errors";

export async function GET(
  request: Request,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const { workspaceId } = params;
    const db = getDb();

    // 1. Verify workspace exists
    const [workspace] = await db
      .select({ id: workspaces.id, key: workspaces.key })
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // 2. Fetch enabled modules for the workspace
    const moduleConfigs = await db
      .select({ moduleKey: workspaceModuleConfigs.moduleKey, isEnabled: workspaceModuleConfigs.isEnabled })
      .from(workspaceModuleConfigs)
      .where(eq(workspaceModuleConfigs.workspaceId, workspace.id));

    const activeKeys = new Set(
      moduleConfigs.filter((m) => m.isEnabled).map((m) => m.moduleKey)
    );

    // 3. Map to commercial capabilities contract
    // We map known modules to commercial capabilities.
    const knownModules: Array<Omit<CommercialCapability, "status"> & { isCommercial: boolean }> = [
      { id: "mod_workforce", name: "Workforce Configuration", description: "Manage workforce roles and permissions", category: "Core Operations", isCommercial: true },
      { id: "mod_inventory", name: "Inventory Management", description: "Track items, stock, and locations", category: "Core Operations", isCommercial: true },
      { id: "mod_approvals", name: "Approval Workflows", description: "Configure custom approval policies", category: "Governance", isCommercial: true },
      { id: "mod_reports", name: "Advanced Reporting", description: "Generate custom data reports", category: "Analytics", isCommercial: true },
    ];

    const activeCapabilities: CommercialCapability[] = knownModules
      .filter(m => m.isCommercial)
      .map((mod) => {
        // Map abstract module IDs to underlying config keys.
        // For simplicity, we use the id prefix as the key match or exact matches if mapped.
        let isEnabled = false;

        // mapping logic for mock vs real module keys
        if (mod.id === "mod_workforce" && (activeKeys.has("workforce") || activeKeys.has("workspace"))) isEnabled = true;
        if (mod.id === "mod_inventory" && activeKeys.has("assets")) isEnabled = true;
        if (mod.id === "mod_approvals" && activeKeys.has("approvals")) isEnabled = true;
        if (mod.id === "mod_reports" && activeKeys.has("reports")) isEnabled = true;

        let status: CapabilityStatus = isEnabled ? "active" : "blocked";
        // Optionally map logic for pending_setup, coming_soon if metadata exists

        return {
          id: mod.id,
          name: mod.name,
          description: mod.description,
          category: mod.category,
          status,
        };
      });

    // 4. Construct payload
    const payload: TenantCommercialContext = {
      workspaceId: workspace.id,
      activeCapabilities,
      quotas: {
        "active_users": 50,
        "api_requests": 10000,
      },
      utilizationMetrics: {
        "active_users": 12,
        "api_requests": 450,
      }
    };

    return NextResponse.json(payload, { status: 200 });

  } catch (error: unknown) {
    const errorEnvelope = ErrorFactory.createSystemError({
      message: "Failed to resolve commercial context",
      cause: error,
    });
    return NextResponse.json(errorEnvelope, { status: 500 });
  }
}
