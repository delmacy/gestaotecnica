import { assignTechnicianToServiceOrder } from "./actions";

type TechnicianOption = {
  id: string;
  name: string;
  email: string;
  teamName: string | null;
  level: string;
  specialty: string | null;
  registrationCode: string | null;
};

export function ServiceOrderAssignmentForm({
  serviceOrderId,
  technicians,
}: {
  serviceOrderId: string;
  technicians: TechnicianOption[];
}) {
  return (
    <form
      action={assignTechnicianToServiceOrder}
      className="border border-[#d7dccf] bg-white p-5 shadow-sm"
    >
      <input name="serviceOrderId" type="hidden" value={serviceOrderId} />

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">
          Atribuir tecnico
        </h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Defina o responsavel tecnico pela execucao desta OS.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Tecnico</span>
          <select
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            disabled={technicians.length === 0}
            name="technicianProfileId"
            required
          >
            <option value="">Selecione</option>
            {technicians.map((technician: any) => (
              <option key={technician.id} value={technician.id}>
                {technician.name}
                {technician.teamName ? ` - ${technician.teamName}` : ""}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Papel</span>
          <input
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            defaultValue="executor"
            name="role"
            placeholder="executor, apoio, supervisor"
          />
        </label>

        {technicians.length === 0 ? (
          <p className="text-sm leading-6 text-[#5b6655]">
            Cadastre um tecnico disponivel no modulo Workforce antes de atribuir.
          </p>
        ) : null}

        <button
          className="h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d] disabled:cursor-not-allowed disabled:bg-[#aab3a3]"
          disabled={technicians.length === 0}
          type="submit"
        >
          Atribuir tecnico
        </button>
      </div>
    </form>
  );
}
