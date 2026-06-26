# Gaps and Dependencies: Human Resources Module

## Registration (Manual Action Required)
The `human-resources` module follows agent-isolation constraints. For the module to be active in the system, a Core Agent or Human must register it:

### Required Changes in `src/platform/kernel.ts`:
1. **Import the manifest and kernel actions.**
2. **Register the module:** `registerModule(hrManifest)`.
3. **Register the actions:** `registerAction(createEmployeeKernelAction)`, etc.

## Database Provisioning
- **HUMAN_RESOURCES_DATABASE_PROVISIONING:** This module currently uses `builder.process_candidates` as a temporary persistence layer (`origin: 'human-resources'`).
- **Gap:** A dedicated schema and tables (e.g., `hr.employees`, `hr.job_positions`) are required for a production-grade implementation to fully decouple from the builder candidates table.

## Functional Gaps
- **Workforce Integration:** The link between an HR Employee Profile and a Workforce Technician Profile needs to be established through a cross-module action or event.
- **Document Management:** Integration with the `documents` module for storing contracts and IDs is pending.
- **Reporting:** Advanced HR analytics and reporting are not yet implemented.
