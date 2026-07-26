import { CancelBackRequest, CancelBackOutcome } from './cancel-back-contract';

export function resolveCancelBack(request: CancelBackRequest): CancelBackOutcome {
  // Discard behavior
  if (request.isDirty && request.action !== 'DISCARD') {
    return {
      type: 'DISCARD_ABORTED',
      destinationPath: null,
      message: 'Unsaved changes exist. Discard confirmation required.'
    };
  }

  // Permission fallback
  if (!request.hasPermissionForOrigin && request.originPath) {
    return {
      type: 'FALLBACK_DASHBOARD',
      destinationPath: '/builder/dashboard',
      message: 'Access to previous view restricted.'
    };
  }

  // Routing logic
  switch (request.context) {
    case 'CREATE':
      return {
        type: 'CANCEL_CREATE',
        destinationPath: request.originPath || `/builder/${request.module}`,
        message: 'Creation cancelled. Returning to list.'
      };
    case 'EDIT':
      if (!request.entityId) {
        return {
          type: 'CANCEL_CREATE', // Fallback if entityId missing
          destinationPath: `/builder/${request.module}`
        };
      }
      return {
        type: 'CANCEL_EDIT',
        destinationPath: `/builder/${request.module}/detail/${request.entityId}`,
        message: 'Edits cancelled. Returning to detail view.'
      };
    case 'DETAIL':
      return {
        type: 'BACK_FROM_DETAIL',
        destinationPath: request.originPath || `/builder/${request.module}`,
        message: 'Returning to previous view.'
      };
    default:
      return {
        type: 'FALLBACK_DASHBOARD',
        destinationPath: '/builder/dashboard'
      };
  }
}
