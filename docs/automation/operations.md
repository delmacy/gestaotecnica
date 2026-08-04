# Operations

Use the **OpenCode Task Runner** workflow manually to test a specific queued task or to resume the queue. The scheduled watchdog normally recovers an interrupted event chain within fifteen minutes.

Do not run multiple implementation workflows in parallel. The workflow concurrency group and open `agent/*` pull request check are both intentional safeguards.
