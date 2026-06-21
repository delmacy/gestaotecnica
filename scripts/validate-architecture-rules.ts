import fs from 'fs';
import path from 'path';

// Define expected architecture domains as listed in docs/ARCHITECTURE.md
const MANDATORY_DOMAINS = [
  'platform', // The platform base is actively developed here
];

const FUTURE_DOMAINS = [
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
  const isStrict = process.argv.includes('--strict');
  console.log(`=== Validating Architecture Rules (Strict Mode: ${isStrict}) ===`);

  const srcPath = path.join(process.cwd(), 'src');

  if (!fs.existsSync(srcPath)) {
    console.error("❌ 'src' directory not found. This indicates a major structural issue.");
    process.exit(1);
  }

  let hasMandatoryErrors = false;
  let hasWarnings = false;

  console.log("--- Checking Mandatory Domains ---");
  for (const domain of MANDATORY_DOMAINS) {
    const domainPath = path.join(srcPath, domain);
    if (!fs.existsSync(domainPath)) {
      console.error(`❌ Error: Mandatory architectural domain '${domain}' not found at '${domainPath}'.`);
      hasMandatoryErrors = true;
    } else {
      console.log(`✅ Mandatory domain '${domain}' exists.`);
    }
  }

  console.log("\n--- Checking Future/Planned Domains ---");
  for (const domain of FUTURE_DOMAINS) {
    const domainPath = path.join(srcPath, domain);
    if (!fs.existsSync(domainPath)) {
      console.warn(`⚠️ Warning: Expected future architectural domain '${domain}' not found at '${domainPath}'.`);
      hasWarnings = true;
    }
  }

  if (hasMandatoryErrors) {
    console.error("\n❌ Architecture validation failed. One or more mandatory domains are missing.");
    if (isStrict) {
      process.exit(1);
    }
  }

  if (hasWarnings) {
    console.log("\n⚠️ Architecture validation completed with warnings for future domains.");
  } else if (!hasMandatoryErrors) {
    console.log("\n✅ Architecture validation passed completely. All required and future domains exist.");
  }
}

validateArchitecture();
