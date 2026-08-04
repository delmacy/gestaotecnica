import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const DEFAULT_EXPIRATION = "24h";

function getSecret(): Uint8Array {
  const secret =
    process.env.JWT_SECRET ?? process.env.GESTAOTECNICA_API_KEY ?? "dev-secret-key";
  return new TextEncoder().encode(secret);
}

export type GatewayTokenPayload = {
  sub: string;
  workspaceId: string;
  iat?: number;
  exp?: number;
};

export async function issueGatewayToken(
  workspaceId: string,
  options?: { expiresIn?: string; secret?: string },
): Promise<string> {
  const secret = options?.secret ? new TextEncoder().encode(options.secret) : getSecret();

  return new SignJWT({ workspaceId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("gateway")
    .setIssuedAt()
    .setExpirationTime(options?.expiresIn ?? DEFAULT_EXPIRATION)
    .sign(secret);
}

export async function verifyGatewayToken(
  token: string,
  options?: { secret?: string },
): Promise<GatewayTokenPayload | null> {
  try {
    const secret = options?.secret ? new TextEncoder().encode(options.secret) : getSecret();
    const { payload } = await jwtVerify(token, secret);
    const workspaceId = payload.workspaceId as string | undefined;

    if (!workspaceId || typeof workspaceId !== "string") return null;

    return {
      sub: (payload.sub as string) ?? "gateway",
      workspaceId,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}
