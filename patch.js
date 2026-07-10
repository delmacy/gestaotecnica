const fs = require('fs');
const path = 'tests/unit/integration-webhook-contract.test.ts';
let code = fs.readFileSync(path, 'utf8');

// The issue is result.data.idempotencyKey is possibly undefined.
// Since the schema defines it as optional, TypeScript complains when we try to call `.length` on it.
// To fix it, we should check if it exists before checking the length, or use optional chaining or a non-null assertion.
code = code.replace(
  'assert.strictEqual(result.data.idempotencyKey.length, 255);',
  'assert.strictEqual(result.data.idempotencyKey?.length, 255);'
);

fs.writeFileSync(path, code);
