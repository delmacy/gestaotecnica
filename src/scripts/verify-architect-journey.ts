import { runAction } from "../platform/actions/action-runner";
import { resolveWorkspaceContext } from "../platform/workspace";

async function verifyArchitectJourney() {
  console.log("🚀 Starting Architect Journey E2E Verification...");

  const context = await resolveWorkspaceContext({ source: "system" });

  // 1. Create Organization
  const orgKey = `test-org-${Date.now()}`;
  console.log(`Step 1: Creating Organization [${orgKey}]...`);
  const orgResult = await runAction("organizations.create", {
    key: orgKey,
    name: "Test Organization E2E"
  }, context);

  if (!orgResult.success) throw new Error("Failed to create organization");
  const orgId = (orgResult.data as any).id;
  console.log("✅ Organization created:", orgId);

  // 2. Create Workspace
  const wsKey = `test-ws-${Date.now()}`;
  console.log(`Step 2: Provisioning Workspace [${wsKey}]...`);
  const wsResult = await runAction("workspaces.create", {
    organizationId: orgId,
    key: wsKey,
    name: "Production Environment"
  }, context);

  if (!wsResult.success) throw new Error("Failed to create workspace");
  const workspaceId = (wsResult.data as any).id;
  console.log("✅ Workspace provisioned:", workspaceId);

  // 3. Install Capability
  console.log("Step 3: Installing 'work-items' Capability...");
  const capResult = await runAction("workspaces.install_capability", {
    workspaceId,
    capabilityKey: "work-items",
    name: "Demand Management"
  }, context);

  if (!capResult.success) throw new Error("Failed to install capability");
  console.log("✅ Capability installed.");

  // 4. Save Process Definition
  console.log("Step 4: Saving Business Process Definition...");
  const procResult = await runAction("processes.save_definition", {
    workspaceId,
    key: "main-operational-flow",
    name: "Main Operational Flow",
    definition: { nodes: [], edges: [] }
  }, context);

  if (!procResult.success) throw new Error("Failed to save process definition");
  console.log("✅ Process definition saved.");

  // 5. Publish Workspace
  console.log("Step 5: Publishing Workspace...");
  const publishResult = await runAction("workspaces.publish", { workspaceId }, context);

  if (!publishResult.success) throw new Error("Failed to publish workspace");
  console.log("✅ Workspace published to Runtime.");

  console.log("\n✨ Architect Journey Verified Successfully!");
}

verifyArchitectJourney().catch(err => {
  console.error("❌ Verification failed:", err.message);
  process.exit(1);
});
