import { test } from "node:test";
import assert from "node:assert/strict";
import proxyquire from "proxyquire";
import {
  SYSTEM_TRADING,
  SYSTEM_TRADING_REGISTRATION_EVENT,
  SYSTEM_TRADING_TRADING_LAB_MODULE_KEY,
  SYSTEM_TRADING_WORKSPACE_KEY,
} from "../../src/platform/workspaces/system-trading/constants";

type InsertCall = {
  values: Record<string, unknown>;
  usedOnConflictDoUpdate: boolean;
  usedOnConflictDoNothing: boolean;
};

function createMockDb(options: { failOnReturnIndex?: number } = {}) {
  const insertCalls: InsertCall[] = [];
  let returnIndex = 0;

  const chain = {
    values(values: Record<string, unknown>) {
      insertCalls.push({
        values,
        usedOnConflictDoUpdate: false,
        usedOnConflictDoNothing: false,
      });
      return chain;
    },
    onConflictDoUpdate() {
      insertCalls[insertCalls.length - 1].usedOnConflictDoUpdate = true;
      return chain;
    },
    onConflictDoNothing() {
      insertCalls[insertCalls.length - 1].usedOnConflictDoNothing = true;
      return chain;
    },
    returning() {
      if (
        options.failOnReturnIndex !== undefined &&
        returnIndex === options.failOnReturnIndex
      ) {
        throw new Error("database failure");
      }
      returnIndex += 1;
      return [{ id: "generated-uuid" }];
    },
  };

  return {
    insert() {
      return chain;
    },
    insertCalls,
  };
}

const { registerSystemTradingWorkspace } = proxyquire(
  "../../src/platform/workspaces/system-trading/registration",
  {
    "@/db": {
      getDb() {
        throw new Error("getDb should not be called when db is injected");
      },
    },
  },
);

test("registerSystemTradingWorkspace", async (t) => {
  await t.test(
    "registers organization, workspace with repository and environment metadata, Trading Lab and audit event",
    async () => {
      const mockDb = createMockDb();

      const result = await registerSystemTradingWorkspace(mockDb as never);

      assert.equal(result.workspaceKey, SYSTEM_TRADING_WORKSPACE_KEY);
      assert.equal(result.workspaceName, SYSTEM_TRADING.workspace.name);
      assert.equal(result.adaptationKey, SYSTEM_TRADING.workspace.adaptationKey);
      assert.equal(result.tradingLabModuleKey, SYSTEM_TRADING_TRADING_LAB_MODULE_KEY);
      assert.deepEqual(result.repository, SYSTEM_TRADING.workspace.repository);
      assert.deepEqual(result.environment, SYSTEM_TRADING.workspace.environment);

      assert.equal(mockDb.insertCalls.length, 4, "org, workspace, module config and event");

      const [orgCall, workspaceCall, moduleCall, eventCall] = mockDb.insertCalls;

      assert.equal(orgCall.values.key, SYSTEM_TRADING.organization.key);
      assert.equal(orgCall.values.name, SYSTEM_TRADING.organization.name);
      assert.equal(orgCall.usedOnConflictDoUpdate, true);

      assert.equal(workspaceCall.values.key, SYSTEM_TRADING_WORKSPACE_KEY);
      assert.equal(workspaceCall.values.name, SYSTEM_TRADING.workspace.name);
      assert.deepEqual(
        (workspaceCall.values.metadata as { repository: unknown }).repository,
        SYSTEM_TRADING.workspace.repository,
      );
      assert.deepEqual(
        (workspaceCall.values.metadata as { environment: unknown }).environment,
        SYSTEM_TRADING.workspace.environment,
      );
      assert.equal(workspaceCall.usedOnConflictDoUpdate, true);

      assert.equal(moduleCall.values.moduleKey, SYSTEM_TRADING_TRADING_LAB_MODULE_KEY);
      assert.equal(moduleCall.values.name, SYSTEM_TRADING.tradingLab.name);
      assert.equal(moduleCall.values.workspaceId, "generated-uuid");
      assert.equal(moduleCall.values.isEnabled, true);
      assert.equal(moduleCall.usedOnConflictDoUpdate, true);

      assert.equal(eventCall.values.eventType, SYSTEM_TRADING_REGISTRATION_EVENT);
      assert.equal(eventCall.values.source, "system-trading-registration");
      assert.equal(eventCall.values.workspaceId, "generated-uuid");
      assert.deepEqual(
        (eventCall.values.payload as { environment: unknown }).environment,
        SYSTEM_TRADING.workspace.environment,
      );
      assert.equal(eventCall.usedOnConflictDoNothing, true);
    },
  );

  await t.test("is idempotent when run a second time", async () => {
    const mockDb = createMockDb();

    await registerSystemTradingWorkspace(mockDb as never);
    const second = await registerSystemTradingWorkspace(mockDb as never);

    assert.equal(second.workspaceKey, SYSTEM_TRADING_WORKSPACE_KEY);
    assert.equal(second.tradingLabModuleKey, SYSTEM_TRADING_TRADING_LAB_MODULE_KEY);
  });

  await t.test("rejects when persistence fails", async () => {
    const mockDb = createMockDb({ failOnReturnIndex: 1 });

    await assert.rejects(
      registerSystemTradingWorkspace(mockDb as never),
      /database failure/,
    );
  });
});
