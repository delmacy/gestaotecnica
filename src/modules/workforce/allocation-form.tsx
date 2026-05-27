import {
  createTechnicianUnavailability,
  createWorkforceAllocation,
} from "./actions";
import {
  workforceAllocationStatuses,
  workforceAllocationTypes,
} from "./constants";

type Options = Awaited<ReturnType<typeof import("./queries").getWorkforceAllocationOptions>>;

export function WorkforceAllocationForm({ options }: { options: Options }) {
  return (
    <form action={createWorkforceAllocation} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Nova alocacao</h2>
      <div className="mt-4 space-y-4">
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="technicianProfileId" required defaultValue="">
          <option value="">Selecione o tecnico</option>
          {options.technicians.map((technician) => (
            <option key={technician.id} value={technician.id}>{technician.name}</option>
          ))}
        </select>
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="allocationType" defaultValue="service_order">
            {workforceAllocationTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
          <select className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="status" defaultValue="planned">
            {workforceAllocationStatuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
          </select>
        </div>
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="serviceOrderId" defaultValue="">
          <option value="">Sem OS vinculada</option>
          {options.serviceOrders.map((order) => (
            <option key={order.id} value={order.id}>{order.code} - {order.title}</option>
          ))}
        </select>
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="workItemId" defaultValue="">
          <option value="">Sem demanda vinculada</option>
          {options.workItems.map((item) => (
            <option key={item.id} value={item.id}>{item.title}</option>
          ))}
        </select>
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="scheduleId" defaultValue="">
          <option value="">Sem escala vinculada</option>
          {options.schedules.map((schedule) => (
            <option key={schedule.id} value={schedule.id}>{schedule.title}</option>
          ))}
        </select>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="startsAt" type="datetime-local" />
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="endsAt" type="datetime-local" />
        </div>
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="effortMinutes" placeholder="Esforco previsto em minutos" type="number" min="0" />
        <textarea className="min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="notes" placeholder="Contexto, restricoes ou orientacoes" />
        <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Criar alocacao</button>
      </div>
    </form>
  );
}

export function TechnicianUnavailabilityForm({ options }: { options: Options }) {
  return (
    <form action={createTechnicianUnavailability} className="border border-[#d7dccf] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#111510]">Indisponibilidade</h2>
      <div className="mt-4 space-y-4">
        <select className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="technicianProfileId" required defaultValue="">
          <option value="">Selecione o tecnico</option>
          {options.technicians.map((technician) => (
            <option key={technician.id} value={technician.id}>{technician.name}</option>
          ))}
        </select>
        <input className="h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="reason" placeholder="Motivo" required />
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="startsAt" type="datetime-local" required />
          <input className="h-11 border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm" name="endsAt" type="datetime-local" />
        </div>
        <textarea className="min-h-20 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm" name="notes" placeholder="Observacoes" />
        <button className="h-11 w-full bg-[#1f2a1c] text-sm font-semibold text-white" type="submit">Registrar indisponibilidade</button>
      </div>
    </form>
  );
}
