import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import proxyquire from 'proxyquire';

describe('env-binding-preflight', () => {
  it('throws an error if DB url is missing', async () => {
    const { checkEnvBinding } = proxyquire('../../src/scripts/db/env-binding-preflight.ts', {
      'dotenv/config': {},
      postgres: () => {},
    });

    const originalUrl = process.env.DATABASE_URL;
    const originalRuntimeUrl = process.env.RUNTIME_DATABASE_URL;
    delete process.env.DATABASE_URL;
    delete process.env.RUNTIME_DATABASE_URL;

    try {
      await assert.rejects(
        () => checkEnvBinding(),
        (err: Error) => {
          assert.strictEqual(err.message, "RUNTIME_DATABASE_URL or DATABASE_URL must be set for preflight check.");
          return true;
        }
      );
    } finally {
      process.env.DATABASE_URL = originalUrl;
      process.env.RUNTIME_DATABASE_URL = originalRuntimeUrl;
    }
  });

  it('throws an error if user is superuser', async () => {
    const mockSql = Object.assign(
      mock.fn(async (query: string[]) => {
        const qStr = query[0].trim();
        if (qStr.includes('SELECT current_user')) {
          return [{ current_user: 'test_user' }];
        }
        if (qStr.includes('SELECT usesuper FROM pg_user')) {
          return [{ usesuper: true }];
        }
        return [];
      }),
      { end: mock.fn(async () => {}) }
    );

    const { checkEnvBinding } = proxyquire('../../src/scripts/db/env-binding-preflight.ts', {
      'dotenv/config': {},
      postgres: () => mockSql,
    });

    const originalUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/test';

    try {
      await assert.rejects(
        () => checkEnvBinding(),
        (err: Error) => {
          assert.strictEqual(err.message, "Role test_user is a superuser. Runtime environment must not use superuser credentials.");
          return true;
        }
      );
    } finally {
      process.env.DATABASE_URL = originalUrl;
    }
  });

  it('throws an error if missing schemas', async () => {
    const mockSql = Object.assign(
      mock.fn(async (query: string[], ...args: unknown[]) => {
        const qStr = query[0].trim();
        if (qStr.includes('SELECT current_user')) {
          return [{ current_user: 'test_user' }];
        }
        if (qStr.includes('SELECT usesuper FROM pg_user')) {
          return [{ usesuper: false }];
        }
        if (qStr.includes('SELECT schema_name FROM information_schema.schemata')) {
          return [{ schema_name: 'public' }]; // missing others
        }
        return [];
      }),
      { end: mock.fn(async () => {}) }
    );

    const { checkEnvBinding } = proxyquire('../../src/scripts/db/env-binding-preflight.ts', {
      'dotenv/config': {},
      postgres: () => mockSql,
    });

    const originalUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/test';

    try {
      await assert.rejects(
        () => checkEnvBinding(),
        (err: Error) => {
          assert.ok(err.message.includes("Missing required schemas:"));
          return true;
        }
      );
    } finally {
      process.env.DATABASE_URL = originalUrl;
    }
  });

  it('throws an error if missing USAGE on a schema', async () => {
    const mockSql = Object.assign(
      mock.fn(async (query: string[], ...args: unknown[]) => {
        const qStr = query[0].trim();
        if (qStr.includes('SELECT current_user')) {
          return [{ current_user: 'test_user' }];
        }
        if (qStr.includes('SELECT usesuper FROM pg_user')) {
          return [{ usesuper: false }];
        }
        if (qStr.includes('SELECT schema_name FROM information_schema.schemata')) {
          // Return all required schemas
          return [
            { schema_name: 'public' },
            { schema_name: 'identity' },
            { schema_name: 'workspace' },
            { schema_name: 'workflow' },
            { schema_name: 'registry' },
            { schema_name: 'documents' },
            { schema_name: 'storage' },
            { schema_name: 'blueprints' },
            { schema_name: 'builder' },
          ];
        }
        if (qStr.includes('has_schema_privilege')) {
          if (args[1] === 'public') {
            return [{ has_usage: false }];
          }
          return [{ has_usage: true }];
        }
        return [];
      }),
      { end: mock.fn(async () => {}) }
    );

    const { checkEnvBinding } = proxyquire('../../src/scripts/db/env-binding-preflight.ts', {
      'dotenv/config': {},
      postgres: () => mockSql,
    });

    const originalUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/test';

    try {
      await assert.rejects(
        () => checkEnvBinding(),
        (err: Error) => {
          assert.strictEqual(err.message, "Role test_user does not have USAGE privilege on schema public.");
          return true;
        }
      );
    } finally {
      process.env.DATABASE_URL = originalUrl;
    }
  });

  it('passes if all checks succeed', async () => {
    const mockSql = Object.assign(
      mock.fn(async (query: string[], ...args: unknown[]) => {
        const qStr = query[0].trim();
        if (qStr.includes('SELECT current_user')) {
          return [{ current_user: 'test_user' }];
        }
        if (qStr.includes('SELECT usesuper FROM pg_user')) {
          return [{ usesuper: false }];
        }
        if (qStr.includes('SELECT schema_name FROM information_schema.schemata')) {
          return [
            { schema_name: 'public' },
            { schema_name: 'identity' },
            { schema_name: 'workspace' },
            { schema_name: 'workflow' },
            { schema_name: 'registry' },
            { schema_name: 'documents' },
            { schema_name: 'storage' },
            { schema_name: 'blueprints' },
            { schema_name: 'builder' },
          ];
        }
        if (qStr.includes('has_schema_privilege')) {
          return [{ has_usage: true }];
        }
        return [];
      }),
      { end: mock.fn(async () => {}) }
    );

    const { checkEnvBinding } = proxyquire('../../src/scripts/db/env-binding-preflight.ts', {
      'dotenv/config': {},
      postgres: () => mockSql,
    });

    const originalUrl = process.env.DATABASE_URL;
    process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/test';

    try {
      await assert.doesNotReject(() => checkEnvBinding());
    } finally {
      process.env.DATABASE_URL = originalUrl;
    }
  });
});