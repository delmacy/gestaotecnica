# Independent CI authority

OpenCode may run tests while implementing, but the separate pull request gate is authoritative. It checks dependency lock consistency, protected paths, lint, types, architecture, explicit-any policy, database migration validation, unit tests, integration tests, and the production build.
