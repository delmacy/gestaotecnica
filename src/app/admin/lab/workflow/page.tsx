import { runtimeDb } from "@/db";
import { connection } from "next/server";
import {
  processDefinitions,
  processVersions,
  processInstances,
  fieldDefinitions,
  formFields,
  forms
} from "@/db/runtime/schema/workflow";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LabClient } from "./LabClient";
import { FieldDefinition } from "@/platform/forms/application/build-zod-schema";
import { TimelineService, TimelineItem } from "@/platform/timeline/application/timeline.service";
import { ProcessInstanceTimeline } from "@/platform/timeline/components/ProcessInstanceTimeline";

export default async function WorkflowLabPage() {
  await connection();

  const definitions = await runtimeDb.select().from(processDefinitions);

  // Get first published version of simple-request for the demo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const simpleRequest = definitions.find((d: any) => d.key === "simple-request");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let version: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let instances: any[] = [];
  let fields: FieldDefinition[] = [];

  const timelineService = new TimelineService();

  if (simpleRequest) {
    const versions = await runtimeDb
      .select()
      .from(processVersions)
      .where(eq(processVersions.processDefinitionId, simpleRequest.id));
    version = versions[0];

    if (version) {
      const rawInstances = await runtimeDb
        .select()
        .from(processInstances)
        .where(eq(processInstances.processVersionId, version.id));

      // Enhance instances with timeline
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      instances = await Promise.all(rawInstances.map(async (inst: any) => {
        const timeline = await timelineService.getProcessInstanceTimeline(inst.workspaceId, inst.id);
        return { ...inst, timeline };
      }));

      // Fetch fields for the form
      const allForms = await runtimeDb.select().from(forms).where(eq(forms.key, "request-form"));
      const form = allForms[0];
      if (form) {
        const join = await runtimeDb
          .select({
            id: fieldDefinitions.id,
            key: fieldDefinitions.key,
            label: fieldDefinitions.label,
            type: fieldDefinitions.type,
            config: fieldDefinitions.config,
            isRequired: formFields.isRequired
          })
          .from(formFields)
          .innerJoin(fieldDefinitions, eq(formFields.fieldDefinitionId, fieldDefinitions.id))
          .where(eq(formFields.formId, form.id));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fields = join.map((f: any) => ({
          ...f,
          config: f.config as Record<string, unknown>,
          isRequired: f.isRequired === "true"
        }));
      }
    }
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Laboratório Workflow Engine</h1>

      {!simpleRequest ? (
        <Card>
          <CardContent className="pt-6">
            <p>Processo de teste não encontrado. Execute o seed para começar.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Painel de Controle</CardTitle>
            </CardHeader>
            <CardContent>
              <LabClient
                type="create"
                workspaceId={simpleRequest.workspaceId}
                versionId={version?.id}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Execuções e Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-12">
                {instances.map((inst: any) => (
                  <div key={inst.id} className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/20 flex justify-between items-center">
                      <div>
                        <p className="font-mono text-[10px] text-muted-foreground">{inst.id}</p>
                        <p className="text-sm font-bold">Status: {inst.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <LabClient
                          type="notify"
                          instanceId={inst.id}
                          workspaceId={inst.workspaceId}
                        />
                        <LabClient
                          type="attach"
                          instanceId={inst.id}
                          workspaceId={inst.workspaceId}
                        />
                        <LabClient
                          type="execute"
                          instanceId={inst.id}
                          workspaceId={inst.workspaceId}
                          fields={fields}
                        />
                      </div>
                    </div>

                    <div className="pl-4">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                        Histórico da Instância
                      </h4>
                      <ProcessInstanceTimeline items={inst.timeline} />
                    </div>
                  </div>
                ))}
                {instances.length === 0 && <p className="text-muted-foreground text-sm">Nenhuma instância criada.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
