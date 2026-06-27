# GAPS — Approval Workflow Module

## Architectural Gaps

1. **Role-based Approvers**: The current implementation primarily supports user-based approvers. Role-based resolution is stubbed and requires integration with the IAM/Permissions system.
2. **Parallel Steps**: Only sequential steps are currently supported. Complex branching or parallel approval requirements (e.g., 2 out of 3) are not implemented.
3. **Delegation**: There is no support for approver delegation or out-of-office overrides.
4. **Automated Steps**: All steps are currently manual. Automated approval logic based on metadata (e.g., auto-approve if value < 1000) is a future requirement.
5. **UI Customization**: The UI is generic. Future subjects (e.g., Service Orders, Employee Admissions) will need specialized preview components within the approval flow.
6. **Notification Integration**: Kernel actions emit events but do not directly trigger notifications (email/push). This should be handled by a separate notification listener.
7. **Audit Trail**: While events are recorded, a flattened audit trail table for high-performance compliance reporting is missing.
