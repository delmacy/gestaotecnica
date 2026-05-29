import { SkillForm, TechnicianSkillForm, TrainingRecordForm } from "@/modules/skills/skills-forms";
import { SkillsList, TechnicianSkillsList, TrainingRecordsList } from "@/modules/skills/skills-tables";
import {
  getSkills,
  getSkillsOptions,
  getSkillsSummary,
  getTechnicianSkillMatrix,
  getTrainingRecords,
} from "@/modules/skills/queries";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const [skills, matrix, trainings, summary, options] = await Promise.all([
    getSkills(),
    getTechnicianSkillMatrix(),
    getTrainingRecords(),
    getSkillsSummary(),
    getSkillsOptions(),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-6 py-8 text-[#1c211b] lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header>
          <p className="font-mono text-xs uppercase text-[#65705f]">Capacitacao tecnica</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#111510]">Competencias e treinamentos</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5b6655]">
            Catalogo de habilidades, matriz tecnica e trilha de capacitacao conectadas ao planejamento operacional.
          </p>
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          {summary.map((metric: any) => (
            <div className="border border-[#d7dccf] bg-white p-4 shadow-sm" key={metric.label}>
              <p className="font-mono text-xs text-[#6e7a66]">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold text-[#111510]">{metric.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-3">
          <SkillForm />
          <TechnicianSkillForm options={options} />
          <TrainingRecordForm options={options} />
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-[#111510]">Catalogo</h2>
          <SkillsList skills={skills} />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-[#111510]">Matriz tecnica</h2>
            <TechnicianSkillsList matrix={matrix} />
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold text-[#111510]">Treinamentos</h2>
            <TrainingRecordsList trainings={trainings} />
          </div>
        </section>
      </div>
    </main>
  );
}
