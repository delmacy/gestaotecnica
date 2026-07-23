# CL-01 Alpha Dataset Credentials & Boundaries

This document outlines the scope, credentials, and data boundaries for the Commercial Launch Alpha dataset (`launch-alpha-real`).

## Dataset Scope & Purpose
The Alpha Dataset is **strictly demo data** and **not production data**. It is utilized to provide a credible path from local/demo environments to real operational data behaviors for prospect demonstrations and testing.

While the data content represents a realistic workflow scenario, it contains no sensitive PII or actual customer operational records.

## Real Persistence Proof
Unlike synthetic UI views (which mock API calls without interacting with the database layer), the Alpha Dataset operations interact directly with the persisted PostgreSQL database layers.

The dataset logic explicitly interfaces with both `dbRuntime` and `dbPlatform` via Drizzle ORM to prove full persistence behaviors:
* **Platform Operations:** Creates real Module, Capabilities, and Process Candidate definitions.
* **Runtime Operations:** Creates real Organization, Workspace, Users, Authentication accounts, Process Definitions, Process Versions, and Process Instances.

The backend implementation ensures these interactions operate precisely as a normal user flow would under the least-privilege `app_runtime` database role.

## Dataset Credentials (Demo Accounts)

The dataset creates three distinct non-production user profiles for demonstration purposes. These accounts have dynamically generated, randomized non-production credentials upon every seed sequence and are explicitly scoped to the `launch-alpha-real` namespace.

* **Admin Role**
  * Email: `alpha-admin@example.com`
  * Role Name: Alpha Real Admin User
  * Access Profile: `admin`

* **Operator Role**
  * Email: `alpha-operator@example.com`
  * Role Name: Alpha Real Operator User
  * Access Profile: `operador`

* **Viewer Role**
  * Email: `alpha-viewer@example.com`
  * Role Name: Alpha Real Viewer User
  * Access Profile: `builder`

*(Note: Passwords for these accounts are securely generated using `randomBytes` and hashed via standard routines during the seed sequence. Authentication into these specific accounts in a live deployed environment may require an explicit password reset or login linkage to a valid identity provider, ensuring no default hardcoded passwords can be exploited).*

## Reset Boundaries
The Alpha environment state is persistent but safely resettable.

An Administrator can safely reset the demo environment via the dedicated npm script:

```bash
npm run db:seed:launch-alpha:clean
```
*(Requires `ALLOW_SEED=true` to execute)*

This teardown script specifically targets records associated with the `launch-alpha-real` deterministic keys and namespaces. It operates on a strict order of operations to avoid foreign key constraints (e.g., removing Workspace Module Configs, Memberships, and Runtime Entities before deleting the parent Workspace and Organization). It will not indiscriminately destroy data outside the defined namespace boundaries.
