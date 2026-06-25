import { RegistryItemType, RegistryItemStatus } from './registry-types';

interface RegistryFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedType: string;
  onTypeChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
}

export function RegistryFilters({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedStatus,
  onStatusChange,
}: RegistryFiltersProps) {

  const itemTypes: RegistryItemType[] = [
    'capability', 'action', 'dependency_rule', 'capability_model',
    'entity_model', 'process_model', 'view_contract',
    'decision', 'document_contract'
  ];

  const itemStatuses: RegistryItemStatus[] = [
    'documented', 'needs_review', 'ready_for_design', 'future', 'blocked'
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 border-b border-border">
      <div className="flex-1">
        <label htmlFor="search" className="sr-only">Search</label>
        <div className="relative">
          <input
            id="search"
            type="text"
            placeholder="Search by name or slug..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <svg
            className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="flex gap-2">
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Filter by Type"
        >
          <option value="">All Types</option>
          {itemTypes.map(t => (
            <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label="Filter by Status"
        >
          <option value="">All Statuses</option>
          {itemStatuses.map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
