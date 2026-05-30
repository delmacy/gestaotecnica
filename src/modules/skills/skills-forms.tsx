import { assignTechnicianSkill, createSkill, createTrainingRecord } from "./actions";
import { skillProficiencies, trainingStatuses } from "./constants";
import type { SkillsOptions } from "./queries";

export function SkillForm() {
  return (
    <form action={createSkill} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Nova competencia</h2>
      <div className="mt-4 space-y-4">
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="name" placeholder="Nome" required />
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="category" placeholder="Categoria" />
        <textarea className="min-h-24 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="description" placeholder="Descricao" />
        <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Criar competencia</button>
      </div>
    </form>
  );
}

export function TechnicianSkillForm({ options }: { options: SkillsOptions }) {
  return (
    <form action={assignTechnicianSkill} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Vincular tecnico</h2>
      <div className="mt-4 space-y-4">
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="technicianProfileId" required defaultValue="">
          <option value="">Selecione o tecnico</option>
          {options.technicians.map((technician) => <option key={technician.id} value={technician.id}>{technician.name} {technician.teamName ? `- ${technician.teamName}` : ""}</option>)}
        </select>
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="skillId" required defaultValue="">
          <option value="">Selecione a competencia</option>
          {options.skills.map((skill) => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
        </select>
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="proficiency" defaultValue="basic">
          {skillProficiencies.map((proficiency) => <option key={proficiency.value} value={proficiency.value}>{proficiency.label}</option>)}
        </select>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="certifiedAt" type="date" />
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="expiresAt" type="date" />
        </div>
        <textarea className="min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="notes" placeholder="Observacoes" />
        <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Vincular competencia</button>
      </div>
    </form>
  );
}

export function TrainingRecordForm({ options }: { options: SkillsOptions }) {
  return (
    <form action={createTrainingRecord} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Registrar treinamento</h2>
      <div className="mt-4 space-y-4">
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="title" placeholder="Titulo" required />
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="provider" placeholder="Fornecedor ou instrutor" />
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue="planned">
          {trainingStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
        </select>
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="technicianProfileId" defaultValue="">
          <option value="">Sem tecnico definido</option>
          {options.technicians.map((technician) => <option key={technician.id} value={technician.id}>{technician.name}</option>)}
        </select>
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="skillId" defaultValue="">
          <option value="">Sem competencia vinculada</option>
          {options.skills.map((skill) => <option key={skill.id} value={skill.id}>{skill.name}</option>)}
        </select>
        <div className="grid gap-3 sm:grid-cols-3">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="startedAt" type="date" />
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="completedAt" type="date" />
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="expiresAt" type="date" />
        </div>
        <textarea className="min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="notes" placeholder="Observacoes" />
        <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Registrar treinamento</button>
      </div>
    </form>
  );
}
