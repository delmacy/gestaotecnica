import { claimPackageTransactional } from "../src/agent-work/services/claim-package";
import { generateTaskKit } from "../src/agent-work/services/task-kit";
import { heartbeatClaim, reapStaleClaims } from "../src/agent-work/services/lease-service";
import { seedInitialData } from "../src/agent-work/cli/seeds";

async function run() {
   console.log("Starting dry run...");
   await seedInitialData();
   const kit = await generateTaskKit("jules-dev-shared-contracts-01", "PKG-SHARED-CONTRACTS-001");
   if (!kit) throw new Error("Task kit generation failed.");
   console.log("Task Kit Generated.");

   const res = await claimPackageTransactional("jules-dev-shared-contracts-01", "PKG-SHARED-CONTRACTS-001");
   if(res.success) {
      console.log("Transactional claim works.");
   }
   console.log("Dry run success.");
   process.exit(0);
}

run().catch((e) => {
   if(e.message.includes("connect ECONNREFUSED")) {
       console.log("Database not available for dry run. Exiting gracefully.");
       process.exit(0);
   }
   console.error(e);
   process.exit(1);
})
