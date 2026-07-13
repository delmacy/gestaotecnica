import { ConnectorResultEnvelope } from '@/platform/integrations/contracts/connector-result-envelope';

export const VALID_CONNECTOR_SUCCESS: ConnectorResultEnvelope = {
  status: 'success',
  data: {
    message: 'Operation successful'
  }
};

export const VALID_CONNECTOR_RETRYABLE_FAILURE: ConnectorResultEnvelope = {
  status: 'retryable_failure',
  errorCode: 'RATE_LIMIT_EXCEEDED',
  errorMessage: 'Too many requests, try again later'
};

export const VALID_CONNECTOR_PERMANENT_FAILURE: ConnectorResultEnvelope = {
  status: 'permanent_failure',
  errorCode: 'INVALID_CREDENTIALS',
  errorMessage: 'Authentication failed'
};

export const INVALID_CONNECTOR_MISSING_STATUS: unknown = {
  data: {
    message: 'Operation successful'
  }
};

export const INVALID_CONNECTOR_UNKNOWN_STATUS: unknown = {
  status: 'pending',
  data: {
    message: 'Operation pending'
  }
};

export const INVALID_CONNECTOR_RETRYABLE_MISSING_CODE: unknown = {
  status: 'retryable_failure',
  errorMessage: 'Too many requests'
};
