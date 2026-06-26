# Assets Module Gaps

## UI
- [ ] Implement asset search.
- [ ] Implement advanced filtering (by category, status, date).
- [ ] Implement photo/document attachments for assets.
- [ ] Implement responsible assignment UI.

## Domain
- [ ] Define sub-categories for assets.
- [ ] Implement deprecation/retirement policies.

## Integration / Dependencies
- [ ] `ASSET_DATABASE_PROVISIONING`: Dependency for Persistence front to apply migrations for the new `assets_module` schema.
- [ ] `ASSET_HISTORY_EXPORT`: Export asset history to external systems.

## Compatibility
- [ ] Consuming modules (`work-items`, `global-search`, `module-registry`) are currently using backward compatibility aliases. They should be refactored to use the new universal naming convention in a future phase.
