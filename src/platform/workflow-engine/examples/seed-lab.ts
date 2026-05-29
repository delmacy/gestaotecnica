import { runtimeDb } from "@/db";
import { workspaces } from "@/db/runtime/schema/workspace";
import {
  processDefinitions,
  processVersions,
  states,
  transitions,
  actions,
  fieldDefinitions,
  forms,
  formFields
} from "@/db/runtime/schema/workflow";
import { eq } from "drizzle-orm";

export async function seedSimpleRequestProcess() {
  console.log("Iniciando Seed...");

  // 1. Create Workspace
  let wsId: string;
  const allWs = await runtimeDb.select().from(workspaces).where(eq(workspaces.key, "lab-workspace"));
  const existingWs = allWs[0];

  if (existingWs) {
    wsId = existingWs.id;
  } else {
    const [workspace] = await runtimeDb.insert(workspaces).values({
      key: "lab-workspace",
      name: "Laboratório de Testes",
    }).returning();
    wsId = workspace.id;
  }

  console.log(`Workspace ID: ${wsId}`);

  // 2. Create Process Definition
  let processId: string;
  const allProcesses = await runtimeDb.select().from(processDefinitions).where(eq(processDefinitions.key, "simple-request"));
  const existingProcess = allProcesses[0];

  if (existingProcess) {
    processId = existingProcess.id;
  } else {
    const [process] = await runtimeDb.insert(processDefinitions).values({
      workspaceId: wsId,
      key: "simple-request",
      name: "Solicitação Simples",
      description: "Um processo básico de teste para a nova engine.",
    }).returning();
    processId = process.id;
  }

  console.log(`Process ID: ${processId}`);

  // 3. Create Process Version
  let versionId: string;
  const allVersions = await runtimeDb.select().from(processVersions).where(eq(processVersions.processDefinitionId, processId));
  const existingVersion = allVersions[0];

  if (existingVersion) {
    versionId = existingVersion.id;
  } else {
    const [version] = await runtimeDb.insert(processVersions).values({
      processDefinitionId: processId,
      version: 1,
      status: "published",
      definition: {},
    }).returning();
    versionId = version.id;
  }

  console.log(`Version ID: ${versionId}`);

  // 4. Create States (Delete old ones for simplicity in lab)
  await runtimeDb.delete(states).where(eq(states.processVersionId, versionId));

  const [draftState] = await runtimeDb.insert(states).values({
    processVersionId: versionId,
    key: "draft",
    name: "Rascunho",
    isInitial: "true",
  }).returning();

  const [submittedState] = await runtimeDb.insert(states).values({
    processVersionId: versionId,
    key: "submitted",
    name: "Enviado",
  }).returning();

  await runtimeDb.insert(states).values({
    processVersionId: versionId,
    key: "approved",
    name: "Aprovado",
    isFinal: "true",
  });

  // 5. Create Transitions
  const [submitTransition] = await runtimeDb.insert(transitions).values({
    processVersionId: versionId,
    fromStateId: draftState.id,
    toStateId: submittedState.id,
    key: "submit",
    name: "Enviar Solicitação",
  }).returning();

  // 6. Create Fields
  const [titleField] = await runtimeDb.insert(fieldDefinitions).values({
    workspaceId: wsId,
    key: "title",
    label: "Título",
    type: "text",
    config: { placeholder: "Digite o título" },
  }).returning();

  const [reasonField] = await runtimeDb.insert(fieldDefinitions).values({
    workspaceId: wsId,
    key: "reason",
    label: "Motivo",
    type: "textarea",
    config: { placeholder: "Explique o motivo" },
  }).returning();

  // 7. Create Form
  const [form] = await runtimeDb.insert(forms).values({
    workspaceId: wsId,
    key: "request-form",
    name: "Formulário de Solicitação",
  }).returning();

  await runtimeDb.insert(formFields).values([
    { formId: form.id, fieldDefinitionId: titleField.id, sortOrder: 1, isRequired: "true" },
    { formId: form.id, fieldDefinitionId: reasonField.id, sortOrder: 2, isRequired: "false" },
  ]);

  // 8. Create Action
  await runtimeDb.insert(actions).values({
    processVersionId: versionId,
    transitionId: submitTransition.id,
    key: "submit_request",
    name: "Enviar",
    config: { formKey: "request-form" },
  });

  console.log("Seed concluído com sucesso!");
}
