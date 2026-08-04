import test from "node:test";
import assert from "node:assert/strict";
import proxyquire from "proxyquire";
import { SYSTEM_TRADING } from "../../src/platform/workspaces/system-trading/constants";

type RepositoryMetadata = {
  owner: string;
  name: string;
  url: string;
  branch: string;
};

type EnvironmentMetadata = {
  stage: string;
  label: string;
  runtime: string;
  database: string;
};

type RegistrationResult = {
  organizationId: string;
  workspaceId: string;
  workspaceKey: string;
  workspaceName: string;
  adaptationKey: string;
  repository: RepositoryMetadata;
  environment: EnvironmentMetadata;
  tradingLabModuleKey: string;
};

type ModuleRow = {
  moduleKey: string;
  name: string;
  description: string | null;
  layer: string;
  status: string;
  isEnabled: boolean;
};

type ReadBackRegistration = {
  workspaceId: string;
  workspaceKey: string;
  workspaceName: string;
  status: string;
  adaptationKey: string | null;
  repository: RepositoryMetadata | null;
  environment: EnvironmentMetadata | null;
  tradingLabInstalled: boolean;
  modules: ModuleRow[];
};

type RouteResponse = {
  data: Record<string, unknown>;
  options: { status: number };
};

let registerImpl: () => Promise<RegistrationResult>;
let readImpl: () => Promise<ReadBackRegistration | null>;

const { GET } = proxyquire(
  "../../src/app/api/builder/workspace-system-trading/route",
  {
    "next/server": {
      NextResponse: {
        json: (data: unknown, options?: { status: number }) => ({
          data,
          options: options || { status: 200 },
        }),
      },
    },
    "@/platform/workspaces/system-trading": {
      registerSystemTradingWorkspace: () => registerImpl(),
      getSystemTradingWorkspaceRegistration: () => readImpl(),
    },
    "@/platform/errors": {
      createPlatformError: (
        envelope: Record<string, unknown>,
        meta: { id: string; timestamp: string },
      ) => ({ ...envelope, ...meta }),
    },
  },
);

function successRegistration(): RegistrationResult {
  return {
    organizationId: "org-1",
    workspaceId: "workspace-1",
    workspaceKey: SYSTEM_TRADING.workspace.key,
    workspaceName: SYSTEM_TRADING.workspace.name,
    adaptationKey: SYSTEM_TRADING.workspace.adaptationKey,
    repository: SYSTEM_TRADING.workspace.repository,
    environment: SYSTEM_TRADING.workspace.environment,
    tradingLabModuleKey: SYSTEM_TRADING.tradingLab.moduleKey,
  };
}

function successReadBack(): ReadBackRegistration {
  return {
    workspaceId: "workspace-1",
    workspaceKey: SYSTEM_TRADING.workspace.key,
    workspaceName: SYSTEM_TRADING.workspace.name,
    status: "active",
    adaptationKey: SYSTEM_TRADING.workspace.adaptationKey,
    repository: SYSTEM_TRADING.workspace.repository,
    environment: SYSTEM_TRADING.workspace.environment,
    tradingLabInstalled: true,
    modules: [
      {
        moduleKey: SYSTEM_TRADING.tradingLab.moduleKey,
        name: SYSTEM_TRADING.tradingLab.name,
        description: SYSTEM_TRADING.tradingLab.description,
        layer: SYSTEM_TRADING.tradingLab.layer,
        status: SYSTEM_TRADING.tradingLab.status,
        isEnabled: true,
      },
    ],
  };
}

test("GET /api/builder/workspace-system-trading", async (t) => {
  t.beforeEach(() => {
    registerImpl = successRegistration;
    readImpl = successReadBack;
  });

  await t.test(
    "proves workspace and capability visibility when registration and read-back match",
    async () => {
      const response = (await GET()) as RouteResponse;

      assert.equal(response.options.status, 200);

      const registrationResult = response.data.registrationResult as RegistrationResult;
      assert.equal(registrationResult.workspaceKey, SYSTEM_TRADING.workspace.key);
      assert.equal(
        registrationResult.tradingLabModuleKey,
        SYSTEM_TRADING.tradingLab.moduleKey,
      );

      const readBack = response.data.readBackRegistration as ReadBackRegistration;
      assert.equal(readBack.workspaceKey, SYSTEM_TRADING.workspace.key);
      assert.equal(readBack.tradingLabInstalled, true);
      assert.deepEqual(readBack.repository, SYSTEM_TRADING.workspace.repository);
      assert.deepEqual(readBack.environment, SYSTEM_TRADING.workspace.environment);

      const evidence = response.data.evidence as Record<string, boolean>;
      assert.equal(evidence.persisted, true);
      assert.equal(evidence.canBeReadBack, true);
      assert.equal(evidence.workspaceKeyMatches, true);
      assert.equal(evidence.tradingLabModuleMatches, true);
      assert.equal(evidence.repositoryMetadataMatches, true);
      assert.equal(evidence.environmentMetadataMatches, true);
    },
  );

  await t.test("reports mismatches when the read-back diverges from registration", async () => {
    readImpl = async () => ({
      ...successReadBack(),
      repository: {
        owner: "delmacy",
        name: "gestaotecnica",
        url: "https://github.com/delmacy/gestaotecnica",
        branch: "develop",
      },
      modules: [],
    });

    const response = (await GET()) as RouteResponse;

    const evidence = response.data.evidence as Record<string, boolean>;
    assert.equal(evidence.repositoryMetadataMatches, false);
    assert.equal(evidence.tradingLabModuleMatches, false);
    assert.equal(evidence.environmentMetadataMatches, true);
  });

  await t.test("returns a platform error envelope when registration fails", async () => {
    registerImpl = async () => {
      throw new Error("database unavailable");
    };

    const response = (await GET()) as RouteResponse;

    assert.equal(response.options.status, 500);
    assert.equal(
      (response.data as { code: string }).code,
      "PLATFORM.API.INTERNAL_ERROR",
    );
    assert.ok(
      (response.data as { id: string }).id,
      "error envelope should carry an id",
    );
  });
});
