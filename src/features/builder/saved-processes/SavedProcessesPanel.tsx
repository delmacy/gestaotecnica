import type { SavedProcessListItem } from "../persistence";

export type SavedProcessesPanelProps = {
  items: SavedProcessListItem[];
  loading: boolean;
  error?: string;
  onRefresh: () => void;
  onOpen: (processDefinitionId: string) => void;
};

export function SavedProcessesPanel({
  items,
  loading,
  error,
  onRefresh,
  onOpen,
}: SavedProcessesPanelProps) {
  return (
    <div className="flex flex-col border border-border rounded-md bg-card w-full mb-4">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Processos Salvos</h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 disabled:opacity-50"
        >
          {loading ? "Carregando..." : "Atualizar"}
        </button>
      </div>

      <div className="flex flex-col max-h-64 overflow-y-auto p-2">
        {error ? (
          <div className="text-xs text-destructive p-2 text-center bg-destructive/10 rounded-md">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="text-xs text-muted-foreground p-4 text-center">
            {loading ? "Carregando..." : "Nenhum processo salvo encontrado."}
          </div>
        ) : (
          <ul className="space-y-1">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between p-2 rounded-md border border-border/50 hover:border-border transition-colors bg-background"
              >
                <div className="flex flex-col min-w-0 mr-2">
                  <span className="text-xs font-medium text-foreground truncate">
                    {item.name || "Sem título"}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                    <span className="uppercase">{item.status}</span>
                    <span>
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onOpen(item.id)}
                  disabled={loading}
                  className="shrink-0 text-xs font-medium px-2 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  Abrir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
