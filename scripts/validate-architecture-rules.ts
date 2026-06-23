import fs from "fs";
import path from "path";

// Domínios mapeados de acordo com as regras de arquitetura.
const REQUIRED_DOMAINS = ["src/platform"];
const FUTURE_DOMAINS = ["src/core", "src/doc", "src/tasker", "src/governance"];

function validateArchitecture(strictMode: boolean): void {
  let hasErrors = false;
  const projectRoot = process.cwd();

  console.log("=== Validação de Arquitetura do System Builder ===\n");

  // 1. Validar Domínios Obrigatórios
  console.log("Validando domínios obrigatórios:");
  for (const domain of REQUIRED_DOMAINS) {
    const domainPath = path.join(projectRoot, domain);
    if (fs.existsSync(domainPath)) {
      console.log(`✅ [OK] Domínio obrigatório encontrado: ${domain}`);
    } else {
      console.error(`❌ [ERRO] Domínio obrigatório não encontrado: ${domain}`);
      hasErrors = true;
    }
  }

  console.log("\nValidando domínios futuros (geram warnings, não bloqueiam):");
  for (const domain of FUTURE_DOMAINS) {
    const domainPath = path.join(projectRoot, domain);
    if (fs.existsSync(domainPath)) {
      console.log(`✅ [OK] Domínio futuro implementado: ${domain}`);
    } else {
      console.warn(`⚠️ [AVISO] Domínio futuro pendente: ${domain}`);
    }
  }

  // Finalização e verificação baseada no modo
  console.log("\n==================================================");
  if (hasErrors) {
    console.error("❌ Falha na validação de arquitetura. Regras obrigatórias violadas.");
    if (strictMode) {
      process.exit(1);
    } else {
      console.log("⚠️ Executado em modo informativo/warning. Nenhuma falha de exit gerada.");
    }
  } else {
    console.log("✅ Validação de arquitetura aprovada!");
    process.exit(0);
  }
}

// Analisa flags do terminal
const args = process.argv.slice(2);
const strictMode = args.includes("--strict");

validateArchitecture(strictMode);
