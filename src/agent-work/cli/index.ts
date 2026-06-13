#!/usr/bin/env node
import { parseArgs } from "util";
import { generateTaskKit } from "../services/task-kit";
import { claimPackageTransactional } from "../services/claim-package";
import { agentWorkDb } from "../db";
import { agentWorkPackages } from "../schema";
import { eq } from "drizzle-orm";

async function main() {
  const { positionals } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
  });

  const command = positionals[0];

  if (!command || command === "help") {
    console.log("Agent Work CLI");
    console.log("Commands: bootstrap, task-kit, claim:reap-stale, dry-run, help");
    process.exit(0);
  }

  if (command === "bootstrap") {
    const workerKey = process.env.JULES_WORKER_KEY;
    if (!workerKey) {
      console.error("Missing JULES_WORKER_KEY");
      process.exit(1);
    }

    console.log(`Bootstrapping for worker: ${workerKey}`);

    // 1. Encontrar o primeiro pacote planejado e tentar o claim
    const pkgs = await agentWorkDb.select().from(agentWorkPackages).where(eq(agentWorkPackages.status, "planned"));

    if (pkgs.length === 0) {
       console.log("No planned packages available.");
       process.exit(0);
    }

    // Pegar o primeiro para o claim
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

  if (command === "task-kit") {
     const workerKey = process.env.JULES_WORKER_KEY;
     const packageKey = positionals[1];
     if (!workerKey || !packageKey) {
       console.error("Missing JULES_WORKER_KEY or packageKey");
       process.exit(1);
     }

     const kit = await generateTaskKit(workerKey, packageKey);
     console.log(JSON.stringify(kit, null, 2));
     process.exit(0);
  }

  console.log(`Command ${command} executed (mock/unimplemented).`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
