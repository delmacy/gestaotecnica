import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  schema: "./src/agent-work/schema.ts",
  out: "./drizzle-agent-work",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.AGENT_WORK_DATABASE_URL || "postgres://postgres:postgres@localhost:5432/tec_db",
  },
  verbose: true,
  strict: true,
});
