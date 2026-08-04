# Model selection

The task runner reads the repository variable `OPENCODE_MODEL`. Store only the provider/model identifier there; provider credentials belong in Actions secrets.

Changing the model does not require editing a workflow. This keeps model choice operational while workflow policy remains protected code.
