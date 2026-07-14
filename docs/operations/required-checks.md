# Required GitHub Checks for PR Merge

This document outlines the required GitHub checks for merging a Pull Request into the `main` branch.

## Vercel Previews

Vercel preview limits and hourly deploy policies are in effect. As such, Vercel preview deployments are **not required** for microtasks and should not be treated as a blocker for merging PRs. Validation relies on GitHub Actions checks.

## Mandatory Evidence

The following check is listed as mandatory evidence for any Pull Request targeting `main`:

- `npm run build`: Ensures that the Next.js production build succeeds, catching compilation, type, and linting errors before merge.
