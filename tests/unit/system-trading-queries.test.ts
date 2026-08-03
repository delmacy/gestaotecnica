import { test } from "node:test";
import assert from "node:assert/strict";
import proxyquire from "proxyquire";
import { workspaces } from "../../src/db/runtime/schema/workspace";
import { workspaceModuleConfigs } from "../../src/db/schema";
import {
  SYSTEM_TRADING,
  SYSTEM_TRADING_TRADING_LAB_MODULE_KEY,
} from "../../src/platform/workspaces/system-trading/constants";

type WorkspaceRow = {
  id: string;
  key: string;
  name: string;
  status: string;
  adaptationKey: string | null;
  metadata: unknown;
};

type ModuleRow = {
  moduleKey: string;
  name: string;
  description: string | null;
  layer: string;
  status: string;
  isEnabled: boolean;
};

function createQueryMockDb(
  workspaceRows: WorkspaceRow[],
  moduleRows: ModuleRow[],
) {
  return {
    select() {
      return {
        from(table: unknown) {
          if (table === workspaces) {
            return {
              where() {
                return {
                  limit() {
                    return workspaceRows;
                  },
                };
              },
            };
          }
          if (table === workspaceModuleConfigs) {
            return {
              where() {
                return Promise.resolve(moduleRows);
              },
            };
          }
          throw new Error("unexpected table in query");
        },
      };
    },
  };
}

const registeredWorkspaceRow: WorkspaceRow = {
  id: "workspace-1",
  key: SYSTEM_TRADING.workspace.key,
  name: SYSTEM_TRADING.workspace.name,
  status: "active",
  adaptationKey: SYSTEM_TRADING.workspace.adaptationKey,
  metadata: { repository: SYSTEM_TRADING.workspace.repository },
};

const tradingLabRow: ModuleRow = {
  moduleKey: SYSTEM_TRADING_TRADING_LAB_MODULE_KEY,
  name: SYSTEM_TRADING.tradingLab.name,
  description: SYSTEM_TRADING.tradingLab.description,
  layer: SYSTEM_TRADING.tradingLab.layer,
  status: SYSTEM_TRADING.tradingLab.status,
  isEnabled: true,
};

const { getSystemTradingWorkspaceRegistration } = proxyquire(
  "../../src/platform/workspaces/system-trading/queries",
  {
    "@/db": {
      getDb() {
        throw new Error("getDb should not be called when db is injected");
      },
    },
  },
);

test("getSystemTradingWorkspaceRegistration", async (t) => {
  await t.test(
    "reads back the registered workspace with repository metadata and Trading Lab installed",
    async () => {
      const mockDb = createQueryMockDb([registeredWorkspaceRow], [tradingLabRow]);

      const registration = await getSystemTradingWorkspaceRegistration(mockDb as never);

      assert.ok(registration, "registration should exist");
      assert.equal(registration?.workspaceKey, SYSTEM_TRADING.workspace.key);
      assert.equal(registration?.workspaceName, SYSTEM_TRADING.workspace.name);
      assert.deepEqual(registration?.repository, SYSTEM_TRADING.workspace.repository);
      assert.equal(registration?.tradingLabInstalled, true);
      assert.equal(registration?.modules.length, 1);
    },
  );

  await t.test("reports Trading Lab as not installed when the module is disabled", async () => {
    const mockDb = createQueryMockDb(
      [registeredWorkspaceRow],
      [{ ...tradingLabRow, isEnabled: false }],
    );

    const registration = await getSystemTradingWorkspaceRegistration(mockDb as never);

    assert.ok(registration);
    assert.equal(registration?.tradingLabInstalled, false);
  });

  await t.test("returns null when the workspace has not been registered", async () => {
    const mockDb = createQueryMockDb([], []);

    const registration = await getSystemTradingWorkspaceRegistration(mockDb as never);

    assert.equal(registration, null);
  });

  await t.test("returns null repository metadata when workspace metadata is malformed", async () => {
    const mockDb = createQueryMockDb(
      [
        {
          ...registeredWorkspaceRow,
          metadata: { repository: { owner: "delmacy" } },
        },
      ],
      [tradingLabRow],
    );

    const registration = await getSystemTradingWorkspaceRegistration(mockDb as never);

    assert.ok(registration);
    assert.equal(registration?.repository, null);
    assert.equal(registration?.tradingLabInstalled, true);
  });
});
