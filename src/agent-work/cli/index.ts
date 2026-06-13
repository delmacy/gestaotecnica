#!/usr/bin/env node
import { parseArgs } from "util";
import { generateTaskKit } from "../services/task-kit";
import { claimPackageTransactional } from "../services/claim-package";
import { getAgentWorkDb } from "../db";
import { agentWorkPackages } from "../schema";
import { eq } from "drizzle-orm";

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      worker: { type: "string" },
      package: { type: "string" },
      review: { type: "string" },
      wave: { type: "string" },
      format: { type: "string" },
      "dry-run": { type: "boolean" },
    },
    allowPositionals: true,
  });

  const command = positionals[0];

  if (!command || command === "help") {
    console.log("Agent Work CLI");
    console.log("Commands: bootstrap, task-kit, claim:reap-stale, dry-run, help, db:check");
    process.exit(0);
  }

  if (command === "bootstrap") {
    const workerKey = values.worker || process.env.JULES_WORKER_KEY;
    if (!workerKey) {
      console.error("Missing worker parameter or JULES_WORKER_KEY");
      process.exit(1);
    }

    console.log(`Bootstrapping for worker: ${workerKey}`);
    const db = getAgentWorkDb();
    const pkgs = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.status, "ready"));

    if (pkgs.length === 0) {
       console.log("No ready packages available.");
       process.exit(0);
    }

    const targetPkg = pkgs[0];
    console.log(`Attempting to claim package: ${targetPkg.key}`);

    const claimRes = await claimPackageTransactional(workerKey, targetPkg.key);
    if (!claimRes.success) {
       console.error(`Failed to claim package ${targetPkg.key}: ${claimRes.error}`);
       process.exit(1);
    }

    console.log("Claim successful. Generating Task Kit...");

    const kit = await generateTaskKit(workerKey, targetPkg.key);
    console.log("\n=== TASK KIT ===\n");
    console.log(JSON.stringify(kit, null, 2));

    console.log("\nJULES_BOOTSTRAP complete. Please follow the instructions in the Task Kit.");
    process.exit(0);
  }


  if (command === "dry-run") {
     const dbUrl = process.env.AGENT_WORK_TEST_DATABASE_URL || process.env.AGENT_WORK_DATABASE_URL;
     if (!dbUrl) {
         console.error("ENVIRONMENT_NOT_READY: Database URL missing");
         process.exit(1);
     }

     try {
       const db = getAgentWorkDb();
       await db.execute(require("drizzle-orm").sql`SELECT 1`);

       console.log("Parallel dry run starting...");

       const workers = ["jules-dev-shared-contracts-01", "jules-dev-runtime-01", "jules-dev-events-01", "jules-dev-operations-docs-01"];

       let claims = 0;
       for (const worker of workers) {
          const pkgs = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.status, "ready")).for("update");
          if (pkgs.length > 0) {
            console.log(`Worker ${worker} attempting to claim package ${pkgs[0].key}...`);
            const res = await claimPackageTransactional(worker, pkgs[0].key);
            if (res.success) {
               console.log(`Success claiming ${pkgs[0].key} for ${worker}`);
               claims++;
            } else {
               console.log(`Failed claiming for ${worker}: ${res.error}`);
            }
          }
       }

       if (claims > 0) {
           console.log("PARALLEL_WORK_READY");
       } else {
           console.log("PARALLEL_WORK_NOT_READY (no claims successful)");
       }
       process.exit(0);
     } catch (e) {
       console.error("ENVIRONMENT_NOT_READY: DB connection failed");
       process.exit(1);
     }
  }

  if (command === "task-kit") {
     const workerKey = values.worker || process.env.JULES_WORKER_KEY;
     const packageKey = values.package;
     if (!workerKey || !packageKey) {
       console.error("Missing worker or package parameter");
       process.exit(1);
     }

     const kit = await generateTaskKit(workerKey, packageKey);
     console.log(JSON.stringify(kit, null, 2));
     process.exit(0);
  }

  if (command === "db:check") {
     try {
       const db = getAgentWorkDb();
       // Simple query to verify connection and schema
       await db.execute(require("drizzle-orm").sql`SELECT 1`);
       console.log("DB check real OK");
       process.exit(0);
     } catch (e) {
       console.error("DB check failed", e);
       process.exit(1);
     }
  }

  // Prevent mock command execution
  const allowedCommands = [
    "bootstrap", "task-kit", "db:check", "dry-run", "claim:reap-stale",
    "module:list", "module:register", "worker:list", "worker:register", "worker:show",
    "contract:list", "contract:register", "contract:validate",
    "wave:list", "wave:create", "wave:show", "wave:validate", "wave:manifest", "wave:collisions",
    "package:list", "package:create", "package:show", "package:validate", "package:ready", "package:update", "package:claim", "package:heartbeat", "package:renew", "package:release", "package:complete",
    "collision:check", "collision:wave", "artifact:add", "command:add", "decision:add", "handoff:add", "docs-impact:add",
    "receipt:activity", "receipt:integration", "review:create", "review:list", "review:show", "review:scope-check", "review:claim", "review:heartbeat", "review:renew", "review:release", "review:request-changes", "review:approve", "review:complete", "review:reap-stale", "review-kit", "markdown:dump"
  ];

  if (allowedCommands.includes(command)) {
      console.error(`Command ${command} not yet implemented correctly.`);
      process.exit(1);
  }

  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
