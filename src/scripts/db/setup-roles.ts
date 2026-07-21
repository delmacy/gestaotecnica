import "dotenv/config";
import postgres from "postgres";

export async function setupDatabaseRoles() {
  console.log("Starting database role setup...");

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is required for role setup.");
    process.exit(1);
  }

  const sql = postgres(databaseUrl, { max: 1 });

  const schemas = [
    "public",
    "identity",
    "workspace",
    "workflow",
    "registry",
    "documents",
    "storage",
    "blueprints",
    "builder",
  ];

  const roles = [
    "owner_migration",
    "app_runtime",
    "app_readonly",
    "seed_maintenance",
    "break_glass"
  ];

  try {
    // 1. Create Roles if they don't exist
    for (const role of roles) {
      console.log(`Ensuring role exists: ${role}`);
      await sql.unsafe(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${role}') THEN
            CREATE ROLE ${role} WITH NOLOGIN;
          END IF;
        END
        $$;
      `);
    }

    // 2. Grant privileges per schema
    for (const schema of schemas) {
      console.log(`Granting privileges for schema: ${schema}`);

      // All roles need USAGE on the schema
      for (const role of roles) {
        await sql.unsafe(`GRANT USAGE ON SCHEMA "${schema}" TO ${role};`);
      }

      // owner_migration: ALL PRIVILEGES (typically handles DDL/schema changes)
      await sql.unsafe(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "${schema}" TO owner_migration;`);
      await sql.unsafe(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "${schema}" TO owner_migration;`);
      // Future tables
      await sql.unsafe(`ALTER DEFAULT PRIVILEGES FOR ROLE owner_migration IN SCHEMA "${schema}" GRANT ALL PRIVILEGES ON TABLES TO owner_migration;`);
      await sql.unsafe(`ALTER DEFAULT PRIVILEGES FOR ROLE owner_migration IN SCHEMA "${schema}" GRANT ALL PRIVILEGES ON SEQUENCES TO owner_migration;`);

      // app_runtime: SELECT, INSERT, UPDATE, DELETE
      await sql.unsafe(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "${schema}" TO app_runtime;`);
      await sql.unsafe(`GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA "${schema}" TO app_runtime;`);
      // Future tables
      await sql.unsafe(`ALTER DEFAULT PRIVILEGES FOR ROLE owner_migration IN SCHEMA "${schema}" GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_runtime;`);
      await sql.unsafe(`ALTER DEFAULT PRIVILEGES FOR ROLE owner_migration IN SCHEMA "${schema}" GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO app_runtime;`);

      // app_readonly (reporting): SELECT only
      await sql.unsafe(`GRANT SELECT ON ALL TABLES IN SCHEMA "${schema}" TO app_readonly;`);
      await sql.unsafe(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA "${schema}" TO app_readonly;`);
      // Future tables
      await sql.unsafe(`ALTER DEFAULT PRIVILEGES FOR ROLE owner_migration IN SCHEMA "${schema}" GRANT SELECT ON TABLES TO app_readonly;`);
      await sql.unsafe(`ALTER DEFAULT PRIVILEGES FOR ROLE owner_migration IN SCHEMA "${schema}" GRANT SELECT ON SEQUENCES TO app_readonly;`);

      // seed_maintenance: INSERT, UPDATE, DELETE (can bypass some app-level constraints, but not DDL)
      await sql.unsafe(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA "${schema}" TO seed_maintenance;`);
      await sql.unsafe(`GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA "${schema}" TO seed_maintenance;`);
      // Future tables
      await sql.unsafe(`ALTER DEFAULT PRIVILEGES FOR ROLE owner_migration IN SCHEMA "${schema}" GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO seed_maintenance;`);
      await sql.unsafe(`ALTER DEFAULT PRIVILEGES FOR ROLE owner_migration IN SCHEMA "${schema}" GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO seed_maintenance;`);

      // break_glass: ALL PRIVILEGES (emergency manual interventions)
      await sql.unsafe(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "${schema}" TO break_glass;`);
      await sql.unsafe(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA "${schema}" TO break_glass;`);
      // Future tables
      await sql.unsafe(`ALTER DEFAULT PRIVILEGES FOR ROLE owner_migration IN SCHEMA "${schema}" GRANT ALL PRIVILEGES ON TABLES TO break_glass;`);
      await sql.unsafe(`ALTER DEFAULT PRIVILEGES FOR ROLE owner_migration IN SCHEMA "${schema}" GRANT ALL PRIVILEGES ON SEQUENCES TO break_glass;`);
    }

    console.log("Database roles and privileges setup complete.");
  } catch (error) {
    console.error("Error setting up roles:", error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Allow running as a standalone script
if (require.main === module) {
  setupDatabaseRoles().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
