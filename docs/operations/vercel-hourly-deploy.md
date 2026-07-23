# Vercel Hourly Preview Promote Policy

## Objective

Limit Vercel production promotions to at most one per hour while preserving GitHub PR preview builds and validation with `npm run build`.

## Required Vercel Setting

Keep Git preview deployments enabled for PR/branch validation when available. The hourly GitHub Actions workflow remains the controlled production path.

The GitHub Actions workflow `.github/workflows/vercel-hourly-deploy.yml` builds a production candidate, deploys it first as a preview deployment, then promotes that same preview artifact to production.

## GitHub Secret

The repository must define:

- `VERCEL_TOKEN`: Vercel token with access to the `gestaotecnica` project.

The workflow already contains the Vercel org and project ids:

- `VERCEL_ORG_ID`: `team_KpojeVYSgUJpZi9pUZIeCiya`
- `VERCEL_PROJECT_ID`: `prj_LIkgEIpTfmDf5Pzor9pjnValohsu`

## Behavior

- Runs every hour at minute 7.
- Checks out `main`.
- Skips deploy/promote when the same `main` commit was already deployed by this workflow.
- Pulls production Vercel env vars.
- Runs `npm run build` before deployment.
- Runs `vercel build --prod`.
- Deploys the prebuilt artifact as a preview candidate with `vercel deploy --prebuilt`.
- Promotes the candidate with `vercel promote <preview-url>`.

## Manual Deploy

Use the `workflow_dispatch` trigger and set `force_deploy=true` when a rebuild/repromotion of the same commit is intentionally needed.

## Agent Rule

Jules and OpenCode PRs should rely on GitHub Actions checks for validation. Vercel preview deployments are useful for visual validation, but Vercel rate limits/free-tier skips remain non-code blockers unless the required GitHub checks fail.
