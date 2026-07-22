import "dotenv/config";
import postgres from "postgres";
import * as fs from "fs";
import * as path from "path";

async function breakGlassTeardown() {
  const dbUrl = process.env.BREAK_GLASS_DATABASE_URL;
  if (!dbUrl) {
    console.error("BLOCKER: BREAK_GLASS_DATABASE_URL must be set to execute destructive operations.");
    process.exit(1);
  }

  const isDryRun = process.argv.includes("--dry-run");

  const sql = postgres(dbUrl, { max: 1 });

  const schemas = [
    "identity",
    "workspace",
    "workflow",
    "registry",
    "documents",
    "storage",
    "blueprints",
    "builder",
  ];

  try {
    console.log("--- BREAK GLASS TEARDOWN ---");
    if (isDryRun) {
      console.log("Mode: DRY RUN (No changes will be made)");
      for (const schema of schemas) {
        const result = await sql`
          SELECT count(*) as table_count
          FROM information_schema.tables
          WHERE table_schema = ${schema}
        `;
        console.log(`Schema '${schema}' has ${result[0].table_count} tables.`);
      }
      console.log("Dry run complete. To execute destructively, run without --dry-run and provide --audit-file <path>");
      return;
    }

    const auditFileIndex = process.argv.indexOf("--audit-file");
    if (auditFileIndex === -1 || !process.argv[auditFileIndex + 1]) {
      console.error("BLOCKER: Destructive execution requires --audit-file <path> pointing to an audit entry (e.g. docs/operations/AUDIT_REPORT.md).");
      process.exit(1);
    }

    const auditFilePath = process.argv[auditFileIndex + 1];
    if (!fs.existsSync(path.resolve(process.cwd(), auditFilePath))) {
      console.error(`BLOCKER: Audit file not found at ${auditFilePath}. You must document this operation first.`);
      process.exit(1);
    }

    console.log("Mode: DESTRUCTIVE EXECUTION");
    console.log(`Audit file confirmed: ${auditFilePath}`);
    console.log("Executing schema drops...");

    for (const schema of schemas) {
      console.log(`Dropping schema if exists: ${schema} CASCADE`);
      await sql.unsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE;`);
    }

    console.log("Teardown complete. All application schemas dropped.");

  } catch (error: unknown) {
    console.error("Error during teardown:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

if (require.main === module) {
  breakGlassTeardown();
}
