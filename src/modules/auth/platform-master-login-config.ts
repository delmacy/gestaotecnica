import { createHash, timingSafeEqual } from "crypto";

function constantTimeEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function matchesPlatformMasterLogin(email: string, password: string) {
  if (process.env.PLATFORM_ADMIN_LOGIN_ENABLED !== "true") return false;

  const configuredEmail = process.env.PLATFORM_ADMIN_EMAIL?.trim().toLowerCase();
  const configuredPassword = process.env.PLATFORM_ADMIN_PASSWORD;
  if (!configuredEmail || !configuredPassword) return false;

  return constantTimeEqual(email.trim().toLowerCase(), configuredEmail)
    && constantTimeEqual(password, configuredPassword);
}

