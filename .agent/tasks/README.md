# OpenCode task queue

The queue is serialized and event-driven.

- `ready/`: tasks available for implementation.
- `completed/`: task definitions moved by the implementation pull request.
- `failed/`: tasks intentionally removed from the automatic queue after investigation.

Task file names should begin with a sortable priority and a stable identifier, for example:

`010-SB-CR-09.md`

Each task should contain:

- objective;
- relevant context and documentation;
- acceptance criteria;
- allowed paths;
- forbidden paths;
- validation commands;
- risk level;
- whether automatic merge is permitted.

The runner selects the lexicographically first Markdown file in `ready/`. Only one `agent/*` pull request may remain open at a time. A successful merge dispatches the next task; the scheduled trigger acts as a watchdog.
