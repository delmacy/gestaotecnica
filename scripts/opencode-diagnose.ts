import dotenv from "dotenv";
import { existsSync } from "node:fs";
import {
  resolveWithFallback,
  getFallbackModels,
  diagnosticReport,
  type ModelTier,
} from "../src/opencode/config-resolver";

const envFile = process.env.ENV_FILE;
if (envFile && existsSync(envFile)) {
  dotenv.config({ path: envFile, override: false });
} else if (existsSync(".env.local")) {
  dotenv.config({ path: ".env.local", override: false });
} else if (existsSync(".env")) {
  dotenv.config({ path: ".env", override: false });
}

const args = process.argv.slice(2);
const liveMode = args.includes("--live");
const showFallbacks = args.includes("--fallbacks");
const tierArg = args.find((a) => !a.startsWith("--"));

if (showFallbacks) {
  const tiers: ModelTier[] = ["simple", "standard", "advanced"];
  console.log("=== Fallback Model Lists ===\n");
  for (const tier of tiers) {
    console.log(`[${tier}]`);
    const fallbacks = getFallbackModels(tier);
    fallbacks.forEach((m, i) => console.log(`  ${i + 1}. ${m}`));
    console.log("");
  }
  if (args.length === 1) process.exit(0);
}

console.log("=== OpenCode Configuration Diagnostic ===\n");
console.log(diagnosticReport());
console.log("");

try {
  const config = resolveWithFallback(tierArg);
  console.log(`Tier selecionado: ${config.tier}`);
  console.log(`Modelo selecionado: ${config.model}`);
  if (config.fallbackIndex >= 0) {
    console.log(`  (fallback #${config.fallbackIndex + 1} - modelo principal nao configurado)`);
  } else {
    console.log(`  (modelo configurado explicitamente)`);
  }
  console.log(`Provider selecionado: ${config.provider}`);
  console.log(`API key configurada: ${config.apiKeySet ? "sim" : "nao"}`);
  console.log("");

  if (!config.apiKeySet) {
    console.log(
      "WARNING: No API key is configured for the resolved provider.",
    );
  }

  if (liveMode) {
    console.log("LIVE mode: this would invoke the provider (not implemented in diagnostic).");
  } else {
    console.log("Diagnostic complete. Use --live to test actual provider call.");
    console.log("Use --fallbacks to see the full fallback list for each tier.");
  }
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Error: ${message}`);
  process.exit(1);
}
