# Action Registry Operator Notes

## Overview

This document explains the current operational semantics of the Builder Registry Action View. It clarifies what the registry currently proves, how it is populated, and its known limitations. This reference serves as a baseline to prevent overclaiming platform capabilities during code reviews and documentation generation.

## Sourcing Action Records

The Action Registry is populated via a two-step initialization phase managed by the platform kernel:

1. **Kernel Initialization**: When the application boots, the `PlatformKernel` spins up.
2. **Registration**: Services explicitly register their `ActionDefinition` entries into the kernel's in-memory registry via `kernel.actions.register()`.

The UI component (Registry View) subsequently fetches these registered descriptors and renders them. The data observed in the view strictly mirrors the `ActionDescriptor` metadata populated during these initial registrations.

## Scope of Verification (What it Proves)

The presence of an action in the Registry View proves:

- An `ActionDescriptor` adhering to the `ActionDescriptorSchema` was successfully parsed.
- The action was properly registered into the platform kernel at boot time.
- The UI can successfully query and display the read-only metadata of the registered actions.

## Operational Boundaries (What it Does NOT Do)

The Action Registry View is subject to strict operational boundaries to prevent ambiguity:

- **Read-Only**: The view is purely read-only. It does NOT provide a mechanism to execute actions.
- **No Runtime Guarantee**: Visibility in the registry does NOT guarantee that the underlying `ActionHandler` will execute successfully or without errors in a production workflow.
- **No Side Effects**: Rendering the registry does NOT trigger underlying action logic or cause state mutation.

## Current Limitations

Operators should be aware of the following known limitations when auditing the Action Registry:

- **Data Mixing**: The registry may currently display a mix of fully implemented actions and mocked or stubbed definitions used for initial UI or validation testing. Operators must rely on code review or execution logs, not just the registry view, to confirm if an action is fully operational.
- **Execution Unavailability**: As noted above, end-to-end execution testing cannot be performed directly from the Action Registry UI.

## Expected Evidence for Future Changes

When submitting modifications to the Action Registry UI, metadata schemas, or registration mechanisms, the following operational evidence must be provided:

- **Structural Validation**: Receipts from architecture checks (`npm run check:architecture`) to verify boundary rules are maintained.
- **Visual Evidence**: Playwright test receipts or valid local media captures of the rendered UI, ensuring no data regressions occurred in the display of descriptor metadata.
- **Unit Test Evidence**: If the underlying parsing or registration logic is modified, receipts from `npm run test` targeting the affected registry modules must be included.

*No updates to GitHub Projects or external trackers should be claimed simply by modifying action registry data or documentation.*

## Cross-References

For more details on action definitions and registry specifications, refer to:
- [Action Descriptor Contract](../actions/ACTION_DESCRIPTOR_CONTRACT.md)
- [Registry Documentation Index](../registry/README.md)
