# Client Lifecycle Management

## 1. Onboarding
- Create a `client-manifest.json`.
- Run `client-bootstrap` script.
- Register repository in the Fleet Inventory.

## 2. Updates
- Channels: `stable`, `candidate`, `manual`, `pinned`.
- `reusable-client-ci.yml` validates compatibility before any upgrade.

## 3. Offboarding
- Archival of deployment receipts.
- Token revocation.
- Fleet removal.
