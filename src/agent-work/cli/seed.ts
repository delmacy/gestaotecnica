import "dotenv/config";
import { getAgentWorkDb, closeAgentWorkDb } from "../db";
import * as schema from "../schema";

const domains = [
  { key: "core", name: "Core", category: "platform" },
  { key: "auth", name: "Auth", category: "platform" },
  { key: "builder", name: "Builder", category: "builder" },
  { key: "gateway", name: "Gateway", category: "gateway" },
  { key: "runtime", name: "Runtime", category: "runtime" },
  { key: "workspace", name: "Workspace", category: "platform" },
  { key: "agent_ops", name: "Agent Ops", category: "ops" },
];

const workers = [
  { key: "jules-dev-auth", name: "Jules Dev Auth", role: "dev", domainKey: "auth" },
  { key: "jules-doc-auth", name: "Jules Doc Auth", role: "doc", domainKey: "auth" },
  { key: "jules-dev-agent-ops", name: "Jules Dev Agent Ops", role: "dev", domainKey: "agent_ops" },
];

async function main() {
  console.log("Starting Agent Work Board seed...");

  const db = getAgentWorkDb();

  try {
    for (const d of domains) {
        await db.insert(schema.agentDomains).values({
            key: d.key,
            name: d.name,
            category: d.category
        }).onConflictDoNothing({ target: schema.agentDomains.key });
    }

    for (const w of workers) {
         await db.insert(schema.julesWorkers).values({
            key: w.key,
            name: w.name,
            role: w.role,
            domainKey: w.domainKey
        }).onConflictDoNothing({ target: schema.julesWorkers.key });
    }

    const agentOpsJob = {
        key: "AGENT-OPS-01",
        title: "Agent Work Board Database",
        description: "Initial setup of the Agent Work Board database and CLI tools.",
        domainKey: "agent_ops",
        role: "dev",
        status: "ready"
    };

    const insertedJob = await db.insert(schema.agentWorkJobs).values(agentOpsJob).onConflictDoNothing({ target: schema.agentWorkJobs.key }).returning();

    if (insertedJob.length > 0) {
        const boxes = [
            { jobKey: "AGENT-OPS-01", key: "schema", title: "Schema" },
            { jobKey: "AGENT-OPS-01", key: "connection", title: "Connection" },
            { jobKey: "AGENT-OPS-01", key: "repository", title: "Repository" },
            { jobKey: "AGENT-OPS-01", key: "cli", title: "CLI" },
            { jobKey: "AGENT-OPS-01", key: "tests", title: "Tests" },
        ];

        await db.insert(schema.agentTaskBoxes).values(boxes);

        const tasks = [
             { jobKey: "AGENT-OPS-01", boxKey: "schema", key: "T01", title: "Create schema.ts", description: "Define Drizzle tables", status: "planned" },
             { jobKey: "AGENT-OPS-01", boxKey: "connection", key: "T02", title: "Create db.ts", description: "Isolated connection", status: "planned" },
             { jobKey: "AGENT-OPS-01", boxKey: "cli", key: "T03", title: "Create CLI scripts", description: "Bootstrap, seed, etc", status: "planned" },
        ];
        await db.insert(schema.agentWorkTasks).values(tasks);
    }

    console.log("Seed complete.");
  } catch (error) {
    console.error("Error running seed:", error);
    process.exit(1);
  } finally {
    await closeAgentWorkDb();
  }
}

main();
