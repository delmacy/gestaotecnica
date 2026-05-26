import { getTeams } from "@/modules/workforce/queries";
import { getTechnicianOptions } from "@/modules/workforce/queries";
import { createSchedule } from "./actions";
import { scheduleStatuses } from "./constants";
import { getScheduleTypeOptions } from "./queries";

function toDateTimeLocal(date: Date) {
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export async function ScheduleForm() {
  const [technicians, teams, scheduleTypes] = await Promise.all([
    getTechnicianOptions(),
    getTeams(),
    getScheduleTypeOptions(),
  ]);
  const now = new Date();
  const later = new Date(now.getTime() + 8 * 60 * 60 * 1000);

  return (
    <form action={createSchedule} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">Nova escala</h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Planeje expediente, plantao, sobreaviso ou ausencia.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Titulo</span>
          <input className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="title" required />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Tipo</span>
            <select className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="type" defaultValue="expediente">
              {scheduleTypes.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Status</span>
            <select className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="status" defaultValue="planned">
              {scheduleStatuses.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Inicio</span>
            <input className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="startsAt" type="datetime-local" defaultValue={toDateTimeLocal(now)} required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Fim</span>
            <input className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="endsAt" type="datetime-local" defaultValue={toDateTimeLocal(later)} required />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Tecnico</span>
          <select className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="technicianProfileId" defaultValue="">
            <option value="">Sem tecnico especifico</option>
            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>{technician.name}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Equipe</span>
          <select className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]" name="teamId" defaultValue="">
            <option value="">Sem equipe</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Notas</span>
          <textarea className="mt-1 min-h-24 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]" name="notes" />
        </label>

        <button className="h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d]" type="submit">
          Criar escala
        </button>
      </div>
    </form>
  );
}
