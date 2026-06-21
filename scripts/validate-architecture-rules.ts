import fs from 'fs';
import path from 'path';

// Define expected architecture domains as listed in docs/ARCHITECTURE.md
const REQUIRED_DOMAINS = [
  'core',
  'doc',
  'tasker',
  'process_mirroring',
  'capabilities',
  'enterprise_architecture',
  'governance',
  'enablement',
  'registry',
  'ui',
  'workflow',
  'runtime',
  'integrations'
];

function validateArchitecture() {
  console.log("=== Validating Architecture Rules ===");
  const srcPath = path.join(process.cwd(), 'src');

  if (!fs.existsSync(srcPath)) {
    console.error("❌ 'src' directory not found. This indicates a major structural issue.");
    process.exit(1);
  }

  let hasWarnings = false;

  for (const domain of REQUIRED_DOMAINS) {
    const domainPath = path.join(srcPath, domain);
    if (!fs.existsSync(domainPath)) {
      console.warn(`⚠️ Warning: Expected architectural domain '${domain}' not found at '${domainPath}'.`);
      hasWarnings = true;
    }
  }

  if (hasWarnings) {
    console.log("\n⚠️ Architecture validation completed with warnings. Expected domains may not be fully scaffolded yet.");
  } else {
    console.log("\n✅ Architecture validation passed. All required domains exist.");
  }
}

validateArchitecture();
