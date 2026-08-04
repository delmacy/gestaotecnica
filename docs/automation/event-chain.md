# Event chain

`agent/*` pull request merge → Continue OpenCode Queue → OpenCode Task Runner → implementation PR → required CI → auto-merge → next task.

The watchdog schedule exists only to recover a broken event chain; it is not the normal delay between tasks.
