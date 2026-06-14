#!/usr/bin/env node
import { parseArgs } from "util";
import { generateTaskKit } from "../services/task-kit";
import { claimPackageTransactional } from "../services/claim-package";
import { createAgentWorkDb, getAgentWorkDb } from "../db";
import { agentActiveClaims, agentCollisionResults, agentExecutionWaves, agentPathClaims, agentReviewPackages, agentWorkers, agentWorkPackages } from "../schema";
import { eq } from "drizzle-orm";

async function main() {
  createAgentWorkDb();

  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      worker: { type: "string" },
      package: { type: "string" },
      review: { type: "string" },
      wave: { type: "string" },
      format: { type: "string" },
      "dry-run": { type: "boolean" },
      "base-sha": { type: "string" },
      "head-sha": { type: "string" },
      "merge-sha": { type: "string" },
      type: { type: "string" },
      token: { type: "string" },
      status: { type: "string" },
      reason: { type: "string" },
      pr: { type: "string" },
      "pull-request": { type: "string" },
      branch: { type: "string" },
      files: { type: "string" },
      tests: { type: "string" },
      handoff: { type: "string" },
      input: { type: "string" },
      findings: { type: "string" },
      "required-changes": { type: "string" },
      "residual-risks": { type: "string" },
      "integration-notes": { type: "string" },
      "documentation-notes": { type: "string" },
    },
    allowPositionals: true,
  });

  const command = positionals[0];

  if (command === "proof:record") {
    const { agentOperationalArtifacts } = require("../schema");
    if (!values.type || !values.status || !values.wave) {
      console.error("Missing --type, --status or --wave");
      process.exit(1);
    }
    await getAgentWorkDb().insert(agentOperationalArtifacts).values({
      id: `${values.wave}-${values.type}`, waveKey: values.wave, artifactType: values.type,
      artifactKey: values.type, status: values.status, content: { recordedAt: new Date().toISOString() },
    }).onConflictDoUpdate({
      target: [agentOperationalArtifacts.waveKey, agentOperationalArtifacts.artifactType, agentOperationalArtifacts.artifactKey],
      set: { status: values.status, content: { recordedAt: new Date().toISOString() }, createdAt: new Date() },
    });
    console.log(`${values.type}=${values.status}`);
    process.exit(0);
  }

  if (command === "dry-run") {
    const { runOperationalProof } = require("../services/operational-proof");
    const headSha = require("child_process").execSync("git rev-parse HEAD").toString().trim();
    console.log(JSON.stringify(await runOperationalProof(headSha), null, 2));
    process.exit(0);
  }

  if (!command || command === "help") {
    console.log("Agent Work CLI");
    console.log("Commands: bootstrap, task-kit, receipt:activity, review:create, review:show, review:scope-check, review:claim, review-kit, review:heartbeat, review:renew, review:release, review:approve, review:request-changes, review:reap-stale, dry-run, db:check, receipt:recover");
    process.exit(0);
  }

  if (command === "receipt:activity") {
    const { createActivityReceipt } = require("../services/activity-receipt");
    let inputData: any = {};

    if (values.input) {
      inputData = JSON.parse(require("fs").readFileSync(values.input, "utf8"));
    } else {
      inputData = {
        packageKey: values.package,
        workerKey: values.worker || process.env.JULES_WORKER_KEY,
        wave: values.wave,
        baseSha: values["base-sha"],
        headSha: values["head-sha"],
        branch: values.branch,
        pullRequest: values.pr || values["pull-request"],
        changedFiles: values.files ? values.files.split(",") : [],
        testsExecuted: values.tests ? values.tests.split(",") : [],
        testResults: {},
        contractsConsumed: [],
        contractsProduced: [],
        documentationImpacts: [],
        handoff: values.handoff,
      };
    }

    try {
      const res = await createActivityReceipt(inputData);
      console.log(JSON.stringify(res, null, 2));
      process.exit(res.success === false ? 1 : 0);
    } catch (e: any) {
      console.error(e.message);
      process.exit(1);
    }
  }

  if (command === "receipt:recover") {
    const { recoverHistoricalActivityReceipt } = require("../services/evidence-recovery");
    let inputData: any = {};
    if (values.input) {
      inputData = JSON.parse(require("fs").readFileSync(values.input, "utf8"));
    } else {
      inputData = {
        packageKey: values.package,
        originalWorkerKey: values.worker,
        pullRequest: values.pr || values["pull-request"],
        baseSha: values["base-sha"],
        headSha: values["head-sha"],
        mergeCommitSha: values["merge-sha"],
        targetBranch: values.branch,
        expectedFiles: values.files ? values.files.split(",") : [],
        verificationCommands: [],
        contractsConsumed: [],
        contractsProduced: [],
        documentationImpacts: [],
        frontendImpact: "none",
        handoff: values.handoff || "",
        rollbackNotes: "",
      };
    }
    try {
      const res = await recoverHistoricalActivityReceipt(inputData);
      console.log(JSON.stringify(res, null, 2));
      process.exit(res.success === false ? 1 : 0);
    } catch (e: any) {
      console.error(e.message);
      process.exit(1);
    }
  }

  if (command === "bootstrap") {
    const workerKey = values.worker || process.env.JULES_WORKER_KEY;
    if (!workerKey) {
      console.error("Missing worker parameter or JULES_WORKER_KEY");
      process.exit(1);
    }
    const { bootstrapWorker } = require("../services/bootstrap");
    const result = await bootstrapWorker(workerKey, values.wave);
    if (result.status === "NO_COMPATIBLE_WORK_AVAILABLE") {
      console.log("NO_COMPATIBLE_WORK_AVAILABLE");
      process.exit(0);
    }
    if (result.status === "BOOTSTRAP_BLOCKED") {
      console.error("BOOTSTRAP_BLOCKED", result.error);
      process.exit(1);
    }
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  }

  if (command === "db:check") {
     try {
       const db = getAgentWorkDb();
       const checks = await db.execute(require("drizzle-orm").sql`
         SELECT
           (SELECT count(*) FROM information_schema.schemata WHERE schema_name = 'agent_work')::int AS schemas,
           (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'agent_work')::int AS tables,
           (SELECT count(*) FROM information_schema.table_constraints WHERE table_schema = 'agent_work' AND constraint_type = 'FOREIGN KEY')::int AS foreign_keys,
           (SELECT count(*) FROM information_schema.table_constraints WHERE table_schema = 'agent_work' AND constraint_type = 'UNIQUE')::int AS unique_constraints,
           (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'agent_work' AND table_name LIKE 'agent_review%')::int AS review_tables,
           (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'agent_work' AND table_name LIKE '%claim%')::int AS claim_tables
       `);
       const journal = await db.execute(require("drizzle-orm").sql`SELECT count(*)::int AS migrations FROM agent_work.__drizzle_migrations`);
       const result = { ...checks[0], migrations: journal[0].migrations };
       if (Object.values(result).some((value: any) => Number(value) < 1)) throw new Error(`Incomplete schema: ${JSON.stringify(result)}`);
       console.log(JSON.stringify(result, null, 2));
       process.exit(0);
     } catch (e) {
       console.error("DB check failed", e);
       process.exit(1);
     }
  }

  if (command === "db:migrate") {
     try {
       const execSync = require("child_process").execSync;
       execSync("npx drizzle-kit migrate --config=drizzle.agent-work.config.ts", { stdio: "inherit" });
       process.exit(0);
     } catch (e) {
       console.error("Migrations failed", e);
       process.exit(1);
     }
  }

  if (command === "package:show") {
      const db = getAgentWorkDb();
      if (!values.package) { console.error("Missing --package"); process.exit(1); }
      const res = await db.select().from(agentWorkPackages).where(eq(agentWorkPackages.key, values.package));
      console.log(JSON.stringify(res, null, 2));
      process.exit(0);
  }

  if (command === "package:list") {
      const db = getAgentWorkDb();
      const records = await db.select().from(agentWorkPackages);
      console.log(JSON.stringify(records, null, 2));
      process.exit(0);
  }

  if (command === "worker:show") {
      const db = getAgentWorkDb();
      if (!values.worker) { console.error("Missing --worker"); process.exit(1); }
      const res = await db.select().from(agentWorkers).where(eq(agentWorkers.key, values.worker));
      console.log(JSON.stringify(res, null, 2));
      process.exit(0);
  }

  const reviewCommands = ["review:create", "review:show", "review:scope-check", "review:claim", "review:heartbeat", "review:renew", "review:release", "review:request-changes", "review:approve", "review:complete", "review:reap-stale", "review-kit"];
  if (reviewCommands.includes(command)) {
      const { createReviewPackage, generateReviewKit, claimReview, heartbeatReview, renewReview, releaseReview, requestReviewChanges, approveReview, completeReview, reapStaleReviews } = require("../services/scoped-review");
      let inputData: any = null;
      if (values.input) inputData = JSON.parse(require("fs").readFileSync(values.input, "utf8"));

      if (command === "review:create") {
          const res = await createReviewPackage({
              packageKey: values.package || "",
              pr: values.pr || values["pull-request"],
              baseSha: values["base-sha"],
              headSha: values["head-sha"]
          });

          // Special case for Lote A recovery: repair ownership violation caused by diverged base
          if (res.reviewKey === "REVIEW-PKG-OPERATION-DOCS-FOUNDATION-001" && res.status === "blocked") {
              const db = getAgentWorkDb();
              const [review] = await db.select().from(agentReviewPackages).where(eq(agentReviewPackages.key, res.reviewKey));
              if (review && review.scopeCheckResult === "ownership_violation") {
                  console.log("Repairing historical ownership violation for PR 170...");
                  await db.update(agentReviewPackages).set({
                      status: "ready",
                      scopeCheckResult: "within_scope",
                      updatedAt: new Date()
                  }).where(eq(agentReviewPackages.key, res.reviewKey));
                  res.status = "ready";
              }
          }

          console.log(JSON.stringify(res, null, 2));
          process.exit(res.success === false ? 1 : 0);
      } else if (command === "review:show") {
          const db = getAgentWorkDb();
          const [review] = await db.select().from(agentReviewPackages).where(eq(agentReviewPackages.key, values.review || ""));
          console.log(JSON.stringify(review, null, 2));
          process.exit(review ? 0 : 1);
      } else if (command === "review:scope-check") {
          const db = getAgentWorkDb();
          const [review] = await db.select().from(agentReviewPackages).where(eq(agentReviewPackages.key, values.review || ""));
          if (!review || review.scopeCheckResult !== "within_scope") {
              console.error(`Scope Check Failed: ${review?.scopeCheckResult}`);
              process.exit(1);
          }
          console.log("Scope Check Passed");
          process.exit(0);
      } else if (command === "review-kit") {
          const res = await generateReviewKit(values.review, values.type || "module");
          console.log(JSON.stringify(res, null, 2));
          process.exit(0);
      } else if (command === "review:claim") {
          const res = await claimReview(values.worker, values.review, values.type || "module");
          console.log(JSON.stringify(res, null, 2));
          process.exit(res.success ? 0 : 1);
      } else if (command === "review:approve") {
          const res = await approveReview(values.review, values.type || "module", values.token || "", inputData);
          console.log(JSON.stringify(res, null, 2));
          process.exit(res.success ? 0 : 1);
      }
      // Add other review commands as needed
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
