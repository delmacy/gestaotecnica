import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";

async function main() {
    const client = postgres("postgresql://postgres:postgres@localhost:5432/tec_db", { max: 1 });
    const db = drizzle(client);
    try {
        await client`CREATE SCHEMA IF NOT EXISTS agent_work`;
        await migrate(db, { migrationsFolder: "./drizzle-agent-work", migrationsTable: "__drizzle_migrations", migrationsSchema: "agent_work" });
    } catch(e) {
        console.error(e);
    }
    await client.end();
}
main().catch(console.error);
