# Vercel Hourly Deploy Policy

## Objective

Limit Vercel production deployments to at most one deploy per hour while preserving GitHub PR validation with `npm run build`.

## Required Vercel Setting

Disable automatic Git deployments for the `gestaotecnica` Vercel project, or configure the Vercel ignored build step to skip branch and PR deployments.

The GitHub Actions workflow `.github/workflows/vercel-hourly-deploy.yml` becomes the production deploy path.

## GitHub Secret

The repository must define:

- `VERCEL_TOKEN`: Vercel token with access to the `gestaotecnica` project.

The workflow already contains the Vercel org and project ids:

- `VERCEL_ORG_ID`: `team_KpojeVYSgUJpZi9pUZIeCiya`
- `VERCEL_PROJECT_ID`: `prj_LIkgEIpTfmDf5Pzor9pjnValohsu`

## Behavior

- Runs every hour at minute 7.
- Checks out `main`.
- Skips deploy when the same `main` commit was already deployed by this workflow.
- Pulls production Vercel env vars.
- Runs `npm run build` before deployment.
- Runs `vercel build --prod`.
- Deploys only the prebuilt artifact with `vercel deploy --prebuilt --prod`.

## Manual Deploy

Use the `workflow_dispatch` trigger and set `force_deploy=true` when a redeploy of the same commit is intentionally needed.

## Agent Rule

Jules and OpenCode PRs should rely on GitHub Actions checks for validation. Vercel preview deployments are not required for microtasks and should not be treated as a blocker when disabled by this policy.
