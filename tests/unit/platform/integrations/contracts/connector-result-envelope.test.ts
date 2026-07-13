import test from 'node:test';
import assert from 'node:assert';
import { z } from 'zod';
import { ConnectorResultEnvelopeSchema } from '../../../../../src/platform/integrations/contracts/connector-result-envelope';

test('ConnectorResultEnvelopeSchema - success', () => {
  const payload = {
    status: 'success',
    data: { some: 'data' }
  };
  const parsed = ConnectorResultEnvelopeSchema.parse(payload);
  assert.strictEqual(parsed.status, 'success');
});

test('ConnectorResultEnvelopeSchema - retryable_failure', () => {
  const payload = {
    status: 'retryable_failure',
    errorCode: 'TIMEOUT',
    errorMessage: 'Connection timed out'
  };
  const parsed = ConnectorResultEnvelopeSchema.parse(payload);
  assert.strictEqual(parsed.status, 'retryable_failure');
});

test('ConnectorResultEnvelopeSchema - permanent_failure', () => {
  const payload = {
    status: 'permanent_failure',
    errorCode: 'INVALID_AUTH',
    errorMessage: 'Invalid API key'
  };
  const parsed = ConnectorResultEnvelopeSchema.parse(payload);
  assert.strictEqual(parsed.status, 'permanent_failure');
});

test('ConnectorResultEnvelopeSchema - cancelled', () => {
  const payload = {
    status: 'cancelled',
    reason: 'User request'
  };
  const parsed = ConnectorResultEnvelopeSchema.parse(payload);
  assert.strictEqual(parsed.status, 'cancelled');
});

test('ConnectorResultEnvelopeSchema - missing error code for failure', () => {
  const payload = {
    status: 'permanent_failure',
  };
  assert.throws(() => ConnectorResultEnvelopeSchema.parse(payload), (err) => {
    assert(err instanceof z.ZodError);
    return true;
  });
});
