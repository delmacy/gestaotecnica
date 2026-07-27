import { describe, it } from "node:test";
import * as assert from "node:assert";
import { resolveDeepLinkLanding, DeepLinkRequest } from "../../../../src/platform/builder/contracts/deep-link-landing/resolve-deep-link-landing";
import { WorkspaceContext } from "../../../../src/platform/workspace";

describe("Deep-link Landing Resolution", () => {
  const defaultContext: WorkspaceContext = {
    workspaceId: "ws-123",
    workspaceKey: "test-ws",
    actor: { type: "user", id: "user-1" },
    source: "ui",
    environmentMode: "real",
    enabledModules: [],
    scopes: [],
    correlationId: "corr-1"
  };

  it("Gate 1: routes to login when unauthenticated", () => {
    const request: DeepLinkRequest = {
      url: "http://localhost/builder/capabilities/cap-1",
      hasSession: false
    };

    const res = resolveDeepLinkLanding(request, defaultContext);
    assert.strictEqual(res.status, "unauthenticated");
    assert.strictEqual(res.targetUrl.startsWith("/auth/login?returnTo="), true);
    assert.strictEqual(res.contextHydrated, false);
  });

  it("Gate 2: routes to target when authenticated and authorized", () => {
    const request: DeepLinkRequest = {
      url: "http://localhost/builder/capabilities/cap-1",
      hasSession: true,
      userRole: "builder"
    };

    const res = resolveDeepLinkLanding(request, defaultContext);
    assert.strictEqual(res.status, "authorized");
    assert.strictEqual(res.targetUrl, request.url);
    assert.strictEqual(res.contextHydrated, true);
    assert.strictEqual(res.workspaceId, defaultContext.workspaceId);
  });

  it("Gate 3: routes to unauthorized when admin scope is required but role is not admin", () => {
    const request: DeepLinkRequest = {
      url: "http://localhost/admin/settings",
      hasSession: true,
      userRole: "builder"
    };

    const res = resolveDeepLinkLanding(request, defaultContext);
    assert.strictEqual(res.status, "unauthorized");
    assert.strictEqual(res.targetUrl, "/builder");
    assert.strictEqual(res.contextHydrated, false);
  });

  it("Gate 4: routes to not found path when entity is missing", () => {
    const request: DeepLinkRequest = {
      url: "http://localhost/builder/capabilities/999",
      hasSession: true,
      userRole: "builder",
      entityExists: false
    };

    const res = resolveDeepLinkLanding(request, defaultContext);
    assert.strictEqual(res.status, "not_found");
    assert.strictEqual(res.targetUrl, "/builder/capabilities");
    assert.strictEqual(res.contextHydrated, true);
  });
});
