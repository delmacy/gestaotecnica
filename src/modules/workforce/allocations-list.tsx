import Link from "next/link";
import {
  getTechnicianLevelLabel,
  getWorkforceAllocationStatusLabel,
  getWorkforceAllocationTypeLabel,
} from "./constants";

type Allocation = Awaited<ReturnType<typeof import("./queries").getWorkforceAllocations>>[number];
type Unavailability = Awaited<ReturnType<typeof import("./queries").getTechnicianUnavailabilities>>[number];

function formatDate(date: Date | null) {
  if (!date) return "Nao definido";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function WorkforceAllocationsList({ allocations }: { allocations: Allocation[] }) {
  if (allocations.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        Nenhuma alocacao registrada.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allocations.map((allocation) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={allocation.id}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#111510]">{allocation.technicianName}</h3>
              <p className="mt-1 text-sm text-[#5b6655]">
                {getTechnicianLevelLabel(allocation.technicianLevel)} | {allocation.teamName ?? "Sem equipe"}
              </p>
            </div>
            <p className="font-mono text-xs uppercase text-[#65705f]">
              {getWorkforceAllocationTypeLabel(allocation.allocationType)} | {getWorkforceAllocationStatusLabel(allocation.status)}
            </p>
          </div>
          <div className="mt-3 grid gap-2 text-sm text-[#4d5848] sm:grid-cols-2">
            <p>Inicio: {formatDate(allocation.startsAt)}</p>
            <p>Fim: {formatDate(allocation.endsAt)}</p>
            <p>Esforco: {allocation.effortMinutes ? `${allocation.effortMinutes} min` : "Nao estimado"}</p>
            {allocation.serviceOrderId ? (
              <Link className="underline-offset-4 hover:underline" href={`/service-orders/${allocation.serviceOrderId}`}>
                execucao: {allocation.serviceOrderCode} - {allocation.serviceOrderTitle}
              </Link>
            ) : null}
            {allocation.workItemId ? (
              <Link className="underline-offset-4 hover:underline" href={`/work-items/${allocation.workItemId}`}>
                Demanda: {allocation.workItemTitle}
              </Link>
            ) : null}
            {allocation.scheduleId ? <p>Escala: {allocation.scheduleTitle}</p> : null}
          </div>
          {allocation.notes ? <p className="mt-3 text-sm leading-6 text-[#4d5848]">{allocation.notes}</p> : null}
        </article>
      ))}
    </div>
  );
}

export function TechnicianUnavailabilitiesList({ unavailabilities }: { unavailabilities: Unavailability[] }) {
  if (unavailabilities.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-8 text-center shadow-sm">
        Nenhuma indisponibilidade registrada.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {unavailabilities.map((item) => (
        <article className="border border-[#d7dccf] bg-white p-5 shadow-sm" key={item.id}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#111510]">{item.technicianName}</h3>
              <p className="mt-1 text-sm text-[#5b6655]">{getTechnicianLevelLabel(item.technicianLevel)}</p>
            </div>
            <p className="text-sm font-medium text-[#273025]">{item.reason}</p>
          </div>
          <p className="mt-3 text-sm text-[#4d5848]">
            {formatDate(item.startsAt)} ate {formatDate(item.endsAt)}
          </p>
          {item.notes ? <p className="mt-2 text-sm leading-6 text-[#4d5848]">{item.notes}</p> : null}
        </article>
      ))}
    </div>
  );
}
