# CL-02-007 Permission Copy Updates

Added user-facing permission copy and blocked-state messages to improve the user experience when access is denied.

## Changes Made:
- Added `src/app/blocked/page.tsx` showing "You do not have permission to access this section. Contact an admin to request the {role} role."
- Modified `src/modules/auth/authorization.ts` to redirect unauthorized users to the new blocked page with the necessary role in the query string.
- Modified `src/components/builder/governance-matrix/GovernancePermissionCell.tsx` to include "Access blocked: You do not have permission." in the tooltip when the effect is 'denied'.
