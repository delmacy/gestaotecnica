# RD-01-004-env-binding-check - Add runtime env/database privilege preflight

Add a preflight that verifies DATABASE_URL/RUNTIME_DATABASE_URL points to a DB with required schemas and a non-superuser runtime role with only expected privileges.
