import { getSkillProficiencyLabel, getTrainingStatusLabel } from "./constants";

type Skill = Awaited<ReturnType<typeof import("./queries").getSkills>>[number];
type TechnicianSkill = Awaited<ReturnType<typeof import("./queries").getTechnicianSkillMatrix>>[number];
type Training = Awaited<ReturnType<typeof import("./queries").getTrainingRecords>>[number];

function formatDate(value: Date | null) {
  if (!value) return "Nao informado";
  return new Intl.DateTimeFormat("pt-BR").format(value);
}

export function SkillsList({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhuma competencia cadastrada.</div>;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {skills.map((skill) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={skill.id}>
          <h2 className="text-lg font-semibold text-[#111510]">{skill.name}</h2>
          <p className="mt-1 text-sm text-[#5b6655]">{skill.category ?? "Sem categoria"}</p>
          {skill.description ? <p className="mt-3 text-sm leading-6 text-[#4d5848]">{skill.description}</p> : null}
        </article>
      ))}
    </div>
  );
}

export function TechnicianSkillsList({ matrix }: { matrix: TechnicianSkill[] }) {
  if (matrix.length === 0) return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhum responsavel vinculado a competencia.</div>;
  return (
    <div className="space-y-3">
      {matrix.map((row) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={row.id}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#111510]">{row.technicianName}</h2>
              <p className="mt-1 text-sm text-[#5b6655]">{row.teamName ?? "Sem equipe"} | {row.skillName}</p>
            </div>
            <span className="border border-[#b9c6ac] px-2 py-1 font-mono text-xs text-[#506247]">{getSkillProficiencyLabel(row.proficiency)}</span>
          </div>
          <p className="mt-3 text-sm text-[#5b6655]">Certificacao: {formatDate(row.certifiedAt)} | Validade: {formatDate(row.expiresAt)}</p>
          {row.notes ? <p className="mt-2 text-sm leading-6 text-[#4d5848]">{row.notes}</p> : null}
        </article>
      ))}
    </div>
  );
}

export function TrainingRecordsList({ trainings }: { trainings: Training[] }) {
  if (trainings.length === 0) return <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">Nenhum treinamento registrado.</div>;
  return (
    <div className="space-y-3">
      {trainings.map((training) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={training.id}>
          <h2 className="text-lg font-semibold text-[#111510]">{training.title}</h2>
          <p className="mt-1 text-sm text-[#5b6655]">{getTrainingStatusLabel(training.status)} | {training.provider ?? "Fornecedor nao informado"}</p>
          <p className="mt-3 text-sm text-[#5b6655]">Responsavel: {training.technicianName ?? "Nao definido"} | Competencia: {training.skillName ?? "Nao vinculada"}</p>
          <p className="mt-1 text-sm text-[#5b6655]">Inicio: {formatDate(training.startedAt)} | Conclusao: {formatDate(training.completedAt)} | Validade: {formatDate(training.expiresAt)}</p>
          {training.notes ? <p className="mt-2 text-sm leading-6 text-[#4d5848]">{training.notes}</p> : null}
        </article>
      ))}
    </div>
  );
}
