import { NextResponse } from "next/server";
import { validateGatewayRequest } from "@/platform/integrations/auth";
import {
  gatewayModules,
  readGatewayModule,
} from "@/platform/integrations/module-registry";

export const dynamic = "force-dynamic";

type GatewayModuleRouteProps = {
  params: Promise<{
    moduleKey: string;
  }>;
};

export async function GET(request: Request, { params }: GatewayModuleRouteProps) {
  const authError = validateGatewayRequest(request);
  if (authError) return authError;

  const { moduleKey } = await params;
  const moduleDefinition = gatewayModules.find((module) => module.key === moduleKey);

  if (!moduleDefinition || !moduleDefinition.methods.some((method) => method === "GET")) {
    return NextResponse.json(
      {
        ok: false,
        error: "module_not_exposed",
        moduleKey,
      },
      { status: 404 },
    );
  }

  const data = await readGatewayModule(moduleKey);
  if (!data) {
    return NextResponse.json(
      {
        ok: false,
        error: "module_reader_not_available",
        moduleKey,
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    module: moduleDefinition,
    data,
    servedAt: new Date().toISOString(),
  });
}
