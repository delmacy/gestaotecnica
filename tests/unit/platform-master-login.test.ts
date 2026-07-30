import assert from "node:assert/strict";
import test from "node:test";
import { matchesPlatformMasterLogin } from "../../src/modules/auth/platform-master-login-config";

const originalEnvironment = {
  enabled: process.env.PLATFORM_ADMIN_LOGIN_ENABLED,
  email: process.env.PLATFORM_ADMIN_EMAIL,
  password: process.env.PLATFORM_ADMIN_PASSWORD,
};

test.afterEach(() => {
  for (const [key, value] of Object.entries({
    PLATFORM_ADMIN_LOGIN_ENABLED: originalEnvironment.enabled,
    PLATFORM_ADMIN_EMAIL: originalEnvironment.email,
    PLATFORM_ADMIN_PASSWORD: originalEnvironment.password,
  })) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test("master login is fail-closed unless explicitly enabled", () => {
  process.env.PLATFORM_ADMIN_LOGIN_ENABLED = "false";
  process.env.PLATFORM_ADMIN_EMAIL = "master@example.com";
  process.env.PLATFORM_ADMIN_PASSWORD = "correct-password";

  assert.equal(matchesPlatformMasterLogin("master@example.com", "correct-password"), false);
});

test("master login requires all configured values to match", () => {
  process.env.PLATFORM_ADMIN_LOGIN_ENABLED = "true";
  process.env.PLATFORM_ADMIN_EMAIL = "master@example.com";
  process.env.PLATFORM_ADMIN_PASSWORD = "correct-password";

  assert.equal(matchesPlatformMasterLogin("MASTER@example.com", "correct-password"), true);
  assert.equal(matchesPlatformMasterLogin("master@example.com", "wrong-password"), false);
  assert.equal(matchesPlatformMasterLogin("other@example.com", "correct-password"), false);
});

test("master login remains disabled with incomplete configuration", () => {
  process.env.PLATFORM_ADMIN_LOGIN_ENABLED = "true";
  delete process.env.PLATFORM_ADMIN_PASSWORD;

  assert.equal(matchesPlatformMasterLogin("master@example.com", "anything"), false);
});
