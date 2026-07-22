import { execSync } from "child_process";

function run(command: string, env: Record<string, string> = {}) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: "inherit", env: { ...process.env, ...env } });
}

function main() {
  console.log("--- Full Bootstrap Sequence ---");

  // 1. Create schemas & setup roles (Idempotent)
  console.log("\n[1/5] Bootstrapping schemas and roles...");
  run("npm run db:bootstrap");

  // 2. Validate migrations
  console.log("\n[2/5] Validating migrations...");
  run("npm run db:validate");

  // 3. Push schema
  console.log("\n[3/5] Pushing schema to database...");
  run("npm run db:push");

  // 4. Preflight Environment Binding Check
  console.log("\n[4/5] Running preflight checks (verifying least-privilege for runtime)...");
  run("npm run db:preflight");

  // 5. Ensure Platform Admin is Seeded
  console.log("\n[5/5] Ensuring platform admin account exists...");
  run("npx tsx src/scripts/ensure-platform-admin.ts");

  console.log("\n--- Bootstrap Sequence Complete ---");
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error("Bootstrap failed:", error);
    process.exit(1);
  }
}
