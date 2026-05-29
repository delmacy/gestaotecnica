<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:system-builder-rules -->
# System Builder rules

Before creating code, database structures, screens, automations, or architecture,
read:

- `docs/foundation/MANIFESTO.md`
- `docs/foundation/AI_CONSTITUTION.md`
- `docs/foundation/ONTOLOGY.md`
- `docs/foundation/MASTER_BLUEPRINT_PROMPT.md`
- `docs/database/DATABASE_STRATEGY.md`
- `docs/roadmap/IMPLEMENTATION_PLAN.md`

System Builder is the factory. A client system, sector blueprint, or deployment
is built by the factory; it is not the platform itself.

Never mix internal platform data with live client operational data. Preserve the
conceptual split between `system_builder_*` databases and runtime/client
databases.

Every module or feature must answer:

1. Which organizational capability does it represent?
2. Which process does it support?
3. Which operational result does it produce?
4. How is it tracked?
5. How can it evolve later?
6. How does it integrate with the ecosystem?

Follow the process: understand, mirror, stabilize, measure, improve, automate.
<!-- END:system-builder-rules -->
