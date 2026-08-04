import { issueGatewayToken } from "@/platform/integrations/jwt";

const workspaceId = process.argv[2];
const expiresIn = process.argv[3] ?? "24h";

if (!workspaceId) {
  console.error("Usage: npx tsx src/scripts/issue-gateway-token.ts <workspaceId> [expiresIn]");
  console.error("Example: npx tsx src/scripts/issue-gateway-token.ts workspace-123 7d");
  process.exit(1);
}

issueGatewayToken(workspaceId, { expiresIn })
  .then((token) => {
    console.log("Gateway token issued:\n");
    console.log(token);
    console.log(`\nWorkspace: ${workspaceId}`);
    console.log(`Expires: ${expiresIn}`);
  })
  .catch((err) => {
    console.error("Failed to issue token:", err);
    process.exit(1);
  });
