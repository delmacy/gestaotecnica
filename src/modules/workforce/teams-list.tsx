type TeamRow = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
};

export function TeamsList({ teams }: { teams: TeamRow[] }) {
  if (teams.length === 0) {
    return (
      <div className="border border-[#d7dccf] bg-white p-5 text-sm text-[#5b6655] shadow-sm">
        Nenhuma equipe cadastrada.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {teams.map((team: any) => (
        <article className="border border-[#d7dccf] bg-white p-4 shadow-sm" key={team.id}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-[#182017]">{team.name}</h3>
            <span className="border border-[#b9c6ac] px-2 py-1 font-mono text-xs text-[#506247]">
              {team.isActive ? "Ativa" : "Inativa"}
            </span>
          </div>
          {team.description ? (
            <p className="mt-2 text-sm leading-6 text-[#5b6655]">{team.description}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
