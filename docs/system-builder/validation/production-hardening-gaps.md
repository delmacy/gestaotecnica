# Production Hardening Gaps

As part of the persistence closeout for CL-03, several production hardening gaps have been identified. While current persistence features are functional and adequately verified for Commercial Launch Alpha, the following improvements are necessary for widespread, robust production maturity.

## 1. Database Connection Pooling

- **Description:** The current infrastructure lacks a robust, scalable connection pooling strategy necessary to handle highly concurrent transactional requests smoothly without exhausting connections.
- **Severity:** High
- **Recommendation:** Implement a specialized pooling solution (e.g., PgBouncer or optimized native pooler) to aggressively manage query throughput.

## 2. Retry Logic with Exponential Backoff

- **Description:** Ephemeral database connectivity issues or transaction locks currently lack built-in retry mechanisms, leading to potential immediate failures upon transient disruptions.
- **Severity:** High
- **Recommendation:** Implement retry logic natively into the `db` adapter or immediately wrapping critical transaction invocations, employing standard exponential backoff.

## 3. Migration Automation & CI Integrations

- **Description:** Although migrations are manual and structurally strict, they need seamless integration into the automated CI/CD lifecycle to ensure the database consistently mirrors schema expectations before container deployment.
- **Severity:** Medium
- **Recommendation:** Construct standardized GitHub Actions specifically to execute and assert safe migration deployments, applying 'dry-runs' on staging instances.

## 4. Operational Monitoring and Backups

- **Description:** Advanced monitoring tailored to the Drizzle/Postgres persistence layer and a strict, automated, point-in-time backup strategy are not fully documented or codified.
- **Severity:** High
- **Recommendation:** Establish regular, automated database snapshots (e.g. daily back-ups and continuous WAL archiving) and implement robust observability tracking for slow queries.

## 5. Transaction Support across Entity Boundaries

- **Description:** E2E setup indicates some independent insertions (like workflow orchestrations linked to multiple events) could suffer partial commits if a subset insertion fails midway.
- **Severity:** Medium
- **Recommendation:** Enforce strict database transaction scopes when manipulating interdependent domains concurrently (e.g. inserting an event AND a process instance state).
