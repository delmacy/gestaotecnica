import { getTechnicianLevelLabel } from "@/modules/workforce/constants";

type AssignmentRow = {
  id: string;
  role: string;
  assignedAt: Date;
  releasedAt: Date | null;
  technicianName: string;
  technicianEmail: string;
  technicianLevel: string;
  technicianSpecialty: string | null;
  technicianRegistrationCode: string | null;
  teamName: string | null;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function ServiceOrderAssignmentsList({
  assignments,
}: {
  assignments: AssignmentRow[];
}) {
  return (
    <article className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#111510]">
          Responsaveis tecnicos
        </h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Historico de atribuicoes ativas ou ja liberadas nesta OS.
        </p>
      </div>

      {assignments.length === 0 ? (
        <p className="text-sm leading-6 text-[#5b6655]">
          Nenhum tecnico atribuido a esta OS.
        </p>
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment: any) => (
            <div
              className="border border-[#e0e5d9] bg-[#fbfcf8] p-4"
              key={assignment.id}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-[#182017]">
                    {assignment.technicianName}
                  </h3>
                  <p className="mt-1 text-sm text-[#5b6655]">
                    {assignment.technicianEmail}
                  </p>
                  {assignment.technicianRegistrationCode ? (
                    <p className="mt-2 font-mono text-xs text-[#7a8474]">
                      {assignment.technicianRegistrationCode}
                    </p>
                  ) : null}
                </div>
                <span className="border border-[#b9c6ac] px-2 py-1 font-mono text-xs text-[#506247]">
                  {assignment.role}
                </span>
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="font-mono text-xs text-[#6e7a66]">Nivel</dt>
                  <dd className="mt-1 text-[#273025]">
                    {getTechnicianLevelLabel(assignment.technicianLevel)}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-xs text-[#6e7a66]">Equipe</dt>
                  <dd className="mt-1 text-[#273025]">
                    {assignment.teamName ?? "Sem equipe"}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-xs text-[#6e7a66]">Desde</dt>
                  <dd className="mt-1 text-[#273025]">
                    {formatDate(assignment.assignedAt)}
                  </dd>
                </div>
              </dl>

              {assignment.technicianSpecialty ? (
                <p className="mt-3 text-sm leading-6 text-[#5b6655]">
                  Especialidade: {assignment.technicianSpecialty}
                </p>
              ) : null}
              {assignment.releasedAt ? (
                <p className="mt-2 text-sm leading-6 text-[#5b6655]">
                  Liberado em {formatDate(assignment.releasedAt)}.
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
