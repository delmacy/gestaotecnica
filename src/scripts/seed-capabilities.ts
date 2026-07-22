import "dotenv/config";
import { upsertCapabilities } from "../platform/registry/infra/registry.queries";
import { closeDatabaseConnections } from "../db";

const MINIMAL_CAPABILITIES = [
  {
    key: `capability_intake`,
    name: "Intake",
    description: "Initial intake for processes",
    isActive: true,
  },
  {
    key: `capability_approval`,
    name: "Approval",
    description: "Approval step for processes",
    isActive: true,
  },
  {
    key: `capability_organization`,
    name: "Organization",
    description: "Manages organizational structure, divisions, workspaces, and generic metadata.",
    isActive: true,
  },
  {
    key: `capability_people`,
    name: "People",
    description: "Manages users, teams, skills, and roles within the platform.",
    isActive: true,
  }
];

export async function seedCapabilities() {
  console.log(`Starting capability seed...`);

  try {
    const result = await upsertCapabilities(MINIMAL_CAPABILITIES);
    console.log(`[Seed] Upserted ${result.length} capabilities.`);
  } catch (error) {
    console.error(`[Seed] Failed to upsert capabilities:`, error);
    throw error;
  }
}

async function runSeedScript() {
  if (process.env.NODE_ENV !== "test" && !process.env.ALLOW_SEED) {
    console.warn("Seed script can only run with ALLOW_SEED=true or NODE_ENV=test.");
    process.exit(1);
  }

  try {
    await seedCapabilities();
    console.log(`Capability seed finished.`);
  } catch (error) {
    console.error("Failed to run capability seed:", error);
  } finally {
    await closeDatabaseConnections();
  }
}

if (require.main === module) {
  runSeedScript();
}
