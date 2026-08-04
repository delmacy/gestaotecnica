# Automation configuration checklist

- Repository variable `OPENCODE_MODEL` is configured.
- At least one supported provider secret is configured: `OPENROUTER_API_KEY`, `ANTHROPIC_API_KEY`, or `OPENAI_API_KEY`.
- `OPENCODE_AUTOMATION_TOKEN` is configured for reliable workflow dispatch after merge.
- Actions may create pull requests.
- Auto-merge is enabled.
- `main` requires the independent OpenCode pull request gate.
- Existing Vercel and database secrets remain configured for their respective workflows.
