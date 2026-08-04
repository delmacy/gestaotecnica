# Failure policy

A task remains officially ready until its implementation pull request is merged. A failed workflow before PR creation therefore leaves the task available for retry.

A failed PR gate pauses the serialized queue. Repair or close that PR before continuing. Move the task to `failed/` only when abandoning automatic execution or redesigning its specification.
