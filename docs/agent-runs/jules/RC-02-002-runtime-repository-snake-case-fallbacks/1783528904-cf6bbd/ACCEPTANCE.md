# Acceptance Criteria

- Process instance mapper handles workspace_id, process_version_id, current_state_id, created_by_id, created_at, and updated_at fallbacks.
- Action execution mapper handles workspace_id, instance_id, action_key, actor_id, input_payload, output_payload, started_at, and finished_at fallbacks.
- Existing camelCase mapping remains supported.
- Tests prove both camelCase and snake_case source rows for at least process instance and action execution.
