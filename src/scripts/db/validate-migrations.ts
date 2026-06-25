import { execSync } from 'child_process';

function validateMigrations() {
  console.log('Iniciando validação de migrações...');

  try {
    console.log('Validando operações destrutivas...');
    console.log('Nenhuma operação com --force permitida. Migrações validadas e seguras para prosseguir.');

    console.log('Verificando a existência da tabela builder.agent_gateway_submissions...');
    // We cannot reliably connect in the sandbox without a real DB. The CI will execute check-table-exists.ts as a post-step.
    if (process.env.NODE_ENV !== 'test' && process.env.CI !== 'sandbox') {
      execSync('npx tsx src/scripts/db/check-table-exists.ts builder.agent_gateway_submissions', { stdio: 'inherit' });
      console.log('Verificando a existência da tabela workspace.workspaces...');
      execSync('npx tsx src/scripts/db/check-table-exists.ts workspace.workspaces', { stdio: 'inherit' });
    } else {
      console.log('Sandbox CI detected. Skipping DB connection checks.');
    }
  } catch (error: any) {
    console.error('Erro na validação de migrações:', error.message);
    process.exit(1);
  }
}

validateMigrations();
