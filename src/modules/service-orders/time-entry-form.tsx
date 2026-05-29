import { createServiceOrderTimeEntry } from "./actions";

type AssignmentOption = {
  id: string;
  technicianProfileId: string;
  technicianName: string;
  role: string;
  releasedAt: Date | null;
};

function formatDateTimeLocal(date: Date) {
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function ServiceOrderTimeEntryForm({
  assignments,
  serviceOrderId,
}: {
  assignments: AssignmentOption[];
  serviceOrderId: string;
}) {
  const activeAssignments = assignments.filter((assignment) => !assignment.releasedAt);

  return (
    <form
      action={createServiceOrderTimeEntry}
      className="border border-[#d7dccf] bg-white p-5 shadow-sm"
    >
      <input name="serviceOrderId" type="hidden" value={serviceOrderId} />

      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#111510]">
          Apontar tempo
        </h2>
        <p className="mt-1 text-sm leading-6 text-[#5b6655]">
          Registre a execucao realizada por um responsavel atribuido.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Responsavel</span>
          <select
            className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
            disabled={activeAssignments.length === 0}
            name="technicianProfileId"
            required
          >
            <option value="">Selecione</option>
            {activeAssignments.map((assignment) => (
              <option
                key={assignment.id}
                value={assignment.technicianProfileId}
              >
                {assignment.technicianName} - {assignment.role}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Inicio</span>
            <input
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              defaultValue={formatDateTimeLocal(new Date())}
              name="startedAt"
              required
              type="datetime-local"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#273025]">Fim</span>
            <input
              className="mt-1 h-11 w-full border border-[#c8d0bf] bg-[#fbfcf8] px-3 text-sm outline-none focus:border-[#6b7d5d]"
              name="endedAt"
              type="datetime-local"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-[#273025]">Notas</span>
          <textarea
            className="mt-1 min-h-24 w-full resize-y border border-[#c8d0bf] bg-[#fbfcf8] px-3 py-2 text-sm leading-6 outline-none focus:border-[#6b7d5d]"
            name="notes"
            placeholder="Resumo responsavel, impedimentos, medicao ou atividade realizada."
          />
        </label>

        {activeAssignments.length === 0 ? (
          <p className="text-sm leading-6 text-[#5b6655]">
            Atribua um responsavel ativo antes de apontar tempo.
          </p>
        ) : null}

        <button
          className="h-11 w-full bg-[#1f2a1c] px-4 text-sm font-semibold text-white transition hover:bg-[#31402d] disabled:cursor-not-allowed disabled:bg-[#aab3a3]"
          disabled={activeAssignments.length === 0}
          type="submit"
        >
          Registrar tempo
        </button>
      </div>
    </form>
  );
}
