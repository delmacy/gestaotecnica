import subprocess
import os
import re

def test_admin_recovery_no_data_reset():
    # Execute the recovery script
    result = subprocess.run(['sh', 'src/scripts/admin-recover.sh'], capture_output=True, text=True)

    # Verify the script executed successfully
    assert result.returncode == 0, f"Recovery script failed: {result.stderr}"

    # Check that output confirms the admin was configured
    assert "Superusuário da Plataforma Configurado" in result.stdout

    # We analyze the AST using a regex pattern to look for common deletion methods on the 'db' object
    # This avoids tripping up on comments containing the words delete or drop.
    with open('src/scripts/ensure-platform-admin.ts', 'r') as f:
        source_code = f.read()
        assert not re.search(r'db\.delete\(', source_code), "Found db.delete in ensure-platform-admin.ts"
        assert not re.search(r'db\.drop\(', source_code), "Found db.drop in ensure-platform-admin.ts"
        assert not re.search(r'db\.truncate\(', source_code), "Found db.truncate in ensure-platform-admin.ts"
        assert "onConflictDoUpdate" in source_code, "Expected ON CONFLICT DO UPDATE missing"

    print("Test passed: Admin recovery completes without data reset.")

def test_admin_recovery_missing_schema_or_env():
    # Execute the recovery script with a bad database URL
    env = os.environ.copy()
    env["SEED_MAINTENANCE_DATABASE_URL"] = "postgres://invalid:password@localhost:5432/nonexistent_db"
    result = subprocess.run(['sh', 'src/scripts/admin-recover.sh'], env=env, capture_output=True, text=True)

    # Verify the script failed clearly
    assert result.returncode != 0, "Recovery script should have failed"
    assert "Erro ao configurar superusuário da plataforma" in result.stderr or "ECONNREFUSED" in result.stderr or "ECONNRESET" in result.stderr or "does not exist" in result.stderr or "password authentication failed" in result.stderr, f"Missing clear error. Stderr: {result.stderr}, Stdout: {result.stdout}"

    print("Test passed: Admin recovery fails clearly when schema or env is missing.")

if __name__ == "__main__":
    test_admin_recovery_no_data_reset()
    test_admin_recovery_missing_schema_or_env()
