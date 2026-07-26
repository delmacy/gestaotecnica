export type CancelBackOutcomeType =
  | 'CANCEL_CREATE'
  | 'CANCEL_EDIT'
  | 'BACK_FROM_DETAIL'
  | 'DISCARD_CONFIRMED'
  | 'DISCARD_ABORTED'
  | 'FALLBACK_DASHBOARD';

export interface CancelBackOutcome {
  type: CancelBackOutcomeType;
  destinationPath: string | null;
  message?: string;
}

export interface CancelBackRequest {
  action: 'CANCEL' | 'BACK' | 'DISCARD';
  context: 'CREATE' | 'EDIT' | 'DETAIL' | 'MODAL';
  isDirty: boolean;
  module: string;
  entityId?: string;
  originPath?: string;
  hasPermissionForOrigin: boolean;
}
