# Queue recovery

The normal continuation path is the merged pull request event. The task runner schedule executes at minutes 3, 18, 33, and 48 as a watchdog.

The watchdog exits without changes when:

- an `agent/*` pull request is open;
- no Markdown task exists in `.agent/tasks/ready/`.

When a run fails before a pull request is opened, the task remains in `ready/` and a later watchdog run may retry it. When a pull request exists but requires intervention, the serialized queue pauses until that pull request is merged or closed and the task state is deliberately adjusted.
