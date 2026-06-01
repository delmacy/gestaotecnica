import { getDb } from "../db";
import { workspaces, organizations } from "../db/runtime/schema/workspace";
import { forms, fieldDefinitions, processDefinitions, states, processVersions } from "../db/runtime/schema/workflow";
import { users } from "../db/runtime/schema/identity";
import { eq } from "drizzle-orm";

async function main() {
  const db = getDb();
  console.log("🚀 Iniciando Provisionamento de Módulos Reais via Builder API...");

  // 1. Garantir Org e Workspace
  let [org] = await db.select().from(organizations).limit(1);
  if (!org) {
    [org] = await db.insert(organizations).values({ key: "org-test", name: "Org Teste" }).returning();
  }

  let [ws] = await db.select().from(workspaces).where(eq(workspaces.organizationId, org.id)).limit(1);
  if (!ws) {
    [ws] = await db.insert(workspaces).values({ organizationId: org.id, key: "ws-operacional", name: "Operacional" }).returning();
  }

  console.log(`✅ Workspace resolvido: ${ws.name}`);

  // 2. Módulo: Gestão Técnica (Service Orders)
  console.log("📦 Reconstruindo Módulo 'Gestão Técnica' (Service Orders)...");

  const [soField] = await db.insert(fieldDefinitions).values({
    workspaceId: ws.id,
    key: "field-so-title-" + Date.now(),
    label: "Título da Ordem",
    type: "string"
  }).returning();

  const [soForm] = await db.insert(forms).values({
    workspaceId: ws.id,
    key: "so-creation-view-" + Date.now(),
    name: "Criar Ordem de Serviço",
    description: "Formulário gerado pelo Builder para OS"
  }).returning();

  // 3. Módulo: Documentação (Technical Docs)
  console.log("📦 Reconstruindo Módulo 'Documentação'...");

  const [docField] = await db.insert(fieldDefinitions).values({
    workspaceId: ws.id,
    key: "field-doc-content-" + Date.now(),
    label: "Conteúdo Técnico",
    type: "text"
  }).returning();

  const [docForm] = await db.insert(forms).values({
    workspaceId: ws.id,
    key: "doc-editor-view-" + Date.now(),
    name: "Editor de Documentação",
    description: "Formulário gerado pelo Builder para Documentos"
  }).returning();

  console.log("✨ Módulos provisionados com sucesso no banco Runtime. O Runtime agora utilizará a rota dinâmica `/[workspace]/[module]/[view]` para renderizá-los.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
