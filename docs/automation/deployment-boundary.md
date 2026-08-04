# Hourly deployment boundary

OpenCode task throughput and production deployment are intentionally decoupled. Agent tasks may be implemented and merged continuously. The existing Vercel workflow evaluates the latest successful `main` state once per hour and skips deployment when the commit has already been deployed.

This batches multiple merged tasks into a single production promotion while preserving independent pull request validation for every task.
