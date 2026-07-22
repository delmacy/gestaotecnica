import "dotenv/config";
import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const dbUrl = process.env.BREAK_GLASS_DATABASE_URL;
  if (!dbUrl) {
    console.error("BLOCKER: BREAK_GLASS_DATABASE_URL must be set to run a destructive maintenance operation.");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const isExecute = args.includes("--execute");

  if (!isExecute) {
    console.log("=== DRY RUN MODE ===");
    console.log("Run with --execute to perform actual teardown.");
  } else {
    console.log("=== EXECUTE MODE ===");
  }

  const sql = postgres(dbUrl, { max: 1 });

  const schemasToDrop = [
    "builder",
    "blueprints",
    "storage",
    "documents",
    "registry",
    "workflow",
    "workspace",
    "identity",
  ];

  try {
    for (const schema of schemasToDrop) {
      if (isExecute) {
        await sql.unsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE;`);
        console.log(`Dropped schema: ${schema}`);
      } else {
        const result = await sql.unsafe(`SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${schema}';`);
        if (result.length > 0) {
          console.log(`[Dry Run] Would drop schema: ${schema}`);
        } else {
          console.log(`[Dry Run] Schema not found: ${schema}`);
        }
      }
    }

    const auditLogPath = path.join(process.cwd(), "docs/operations/AUDIT_REPORT.md");
    const timestamp = new Date().toISOString();
    const mode = isExecute ? "EXECUTE" : "DRY RUN";
    const logEntry = `\n- **Date:** ${timestamp}\n- **Operator:** Script execution\n- **Command Executed:** db:break-glass:teardown\n- **Mode:** ${mode}\n- **Target:** ${schemasToDrop.join(", ")}\n`;

    fs.appendFileSync(auditLogPath, logEntry, { encoding: "utf-8" });
    console.log(`Audit log written to docs/operations/AUDIT_REPORT.md`);

    console.log("Teardown completed successfully.");
  } catch (error) {
    console.error("Error during teardown:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
