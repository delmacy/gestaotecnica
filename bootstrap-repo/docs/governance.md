# Governance Model

## Roles and Responsibilities

- **Platform Architect**: Defines schemas and core reusable workflows.
- **Operations Manager**: Oversees release orchestration and fleet health.
- **Security Auditor**: Manages security policies and audits automated scans.
- **Jules (Git Manager)**: Automated operator for repository maintenance, sync, and initial validation.

## Process Flow

1. **Development**: Happens in product repositories.
2. **Release**: Orchestrated via `release-orchestrator.yml` in this repo.
3. **Deployment**: Clients consume releases via `reusable-deploy.yml`.
4. **Audit**: All actions logged in GitHub Project V2 and archived via receipts.
