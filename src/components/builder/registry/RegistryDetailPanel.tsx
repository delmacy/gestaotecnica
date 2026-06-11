import { RegistryItem } from './registry-types';

interface RegistryDetailPanelProps {
  item: RegistryItem;
  onClose: () => void;
}

export function RegistryDetailPanel({ item, onClose }: RegistryDetailPanelProps) {
  const riskColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex flex-col h-full bg-background border-l border-border overflow-y-auto">
      <div className="p-4 border-b border-border flex justify-between items-center sticky top-0 bg-background/95 backdrop-blur z-10">
        <div>
          <h2 className="text-lg font-bold">{item.name}</h2>
          <p className="text-sm text-muted-foreground">{item.slug}</p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-muted"
          aria-label="Close details"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1">
        {/* Metadata Section */}
        <section className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 py-1 bg-muted rounded text-xs font-medium text-muted-foreground">
              Type: {item.type.replace(/_/g, ' ')}
            </span>
            <span className="px-2 py-1 bg-muted rounded text-xs font-medium text-muted-foreground">
              Status: {item.status.replace(/_/g, ' ')}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${riskColors[item.risk_level]}`}
            >
              Risk: {item.risk_level}
            </span>
            {item.synthetic && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium border border-purple-200">
                Mock Data
              </span>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Description</h3>
            <p className="text-sm">{item.description}</p>
          </div>

          {item.notes && (
            <div className="bg-muted/50 p-3 rounded-md text-sm">
              <h4 className="font-semibold mb-1 text-xs text-muted-foreground">Notes</h4>
              <p>{item.notes}</p>
            </div>
          )}
        </section>

        {/* References Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b pb-1">References & Contracts</h3>

          {item.source_document && (
            <div className="text-sm">
              <span className="text-muted-foreground">Source Document: </span>
              <span className="font-mono bg-muted px-1 py-0.5 rounded text-xs">{item.source_document}</span>
            </div>
          )}

          {item.related_capability && (
            <div className="text-sm">
              <span className="text-muted-foreground">Related Capability: </span>
              <span className="font-mono bg-muted px-1 py-0.5 rounded text-xs">{item.related_capability}</span>
            </div>
          )}

          {item.document_links.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground block mb-1">Document Links:</span>
              <ul className="list-disc list-inside text-sm space-y-1">
                {item.document_links.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="text-blue-600 hover:underline">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Dependencies Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground border-b pb-1">Dependencies</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground block mb-2">Depends On:</span>
              {item.depends_on.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {item.depends_on.map((dep) => (
                    <span key={dep} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
                      {dep}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground italic">None</span>
              )}
            </div>

            <div>
              <span className="text-sm text-muted-foreground block mb-2">Used By:</span>
              {item.used_by.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {item.used_by.map((dep) => (
                    <span key={dep} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
                      {dep}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground italic">None</span>
              )}
            </div>
          </div>
        </section>

        {/* Rules Section */}
        {item.rules.length > 0 && (
          <section className="space-y-2">
             <h3 className="text-sm font-semibold text-foreground border-b pb-1">Rules Assessed</h3>
             <ul className="list-disc list-inside text-sm space-y-1">
                {item.rules.map((rule, idx) => (
                  <li key={idx} className="font-mono text-xs">{rule}</li>
                ))}
             </ul>
          </section>
        )}
      </div>
    </div>
  );
}
