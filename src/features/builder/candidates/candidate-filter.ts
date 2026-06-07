import type { ProcessCandidate, ProcessCandidateFilter } from "./candidate.types";

export function filterProcessCandidates(
  candidates: ProcessCandidate[],
  filter: ProcessCandidateFilter
): ProcessCandidate[] {
  const normalizedSearch = filter.searchTerm?.trim().toLocaleLowerCase("pt-BR") ?? "";
  const status = filter.status ?? "all";

  return candidates.filter((candidate) => {
    const matchesSearch =
      !normalizedSearch ||
      candidate.name.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
      candidate.description?.toLocaleLowerCase("pt-BR").includes(normalizedSearch) === true;
    const matchesStatus = status === "all" || candidate.status === status;

    return matchesSearch && matchesStatus;
  });
}

export function findSelectedProcessCandidate(
  candidates: ProcessCandidate[],
  selectedId: string | null
): ProcessCandidate | null {
  if (!selectedId) {
    return null;
  }

  return candidates.find((candidate) => candidate.id === selectedId) ?? null;
}
