import { BlockedFallbackReason, BlockedFallbackDestination } from './blocked-fallback-contract';

interface BlockedFallbackContext {
  reason: BlockedFallbackReason;
  originalPath?: string;
  moduleName?: string;
  workspaceId?: string;
  environmentMode?: 'real' | 'demo' | 'synthetic';
}

export function resolveBlockedFallback(context: BlockedFallbackContext): BlockedFallbackDestination {
  const { reason, originalPath, moduleName, workspaceId, environmentMode } = context;

  if (environmentMode === 'demo' && reason !== 'unauthorized') {
     return {
       fallbackPath: originalPath || '/',
       userMessage: 'Action restricted in Demo Simulation. No changes were made.',
       reason: 'demo_restricted',
       shouldRedirect: false,
     };
  }

  switch (reason) {
    case 'unauthorized': {
      return {
        fallbackPath: '/auth/login',
        userMessage: 'Please log in to continue.',
        reason,
        shouldRedirect: true,
      };
    }
    case 'forbidden_workspace': {
      return {
        fallbackPath: workspaceId ? `/builder/${workspaceId}` : '/builder',
        userMessage: 'This configuration requires Workspace Admin privileges.',
        reason,
        shouldRedirect: false,
      };
    }
    case 'forbidden_platform': {
      return {
        fallbackPath: '/admin',
        userMessage: 'Platform Access Restricted.',
        reason,
        shouldRedirect: false,
      };
    }
    case 'not_found': {
      const fallbackList = moduleName && workspaceId
        ? `/builder/${workspaceId}/${moduleName}`
        : (workspaceId ? `/builder/${workspaceId}` : '/builder');

      return {
        fallbackPath: fallbackList,
        userMessage: 'Configuration Unavailable.',
        reason,
        shouldRedirect: false,
      };
    }
    case 'system_error':
    default: {
      return {
        fallbackPath: workspaceId ? `/builder/${workspaceId}` : '/builder',
        userMessage: 'Temporary Disruption. Please try again later or contact support.',
        reason: 'system_error',
        shouldRedirect: false,
      };
    }
  }
}
