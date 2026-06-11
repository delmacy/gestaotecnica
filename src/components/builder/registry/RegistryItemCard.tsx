import { RegistryItem } from './registry-types';

interface RegistryItemCardProps {
  item: RegistryItem;
  isSelected: boolean;
  onClick: (item: RegistryItem) => void;
}

export function RegistryItemCard({ item, isSelected, onClick }: RegistryItemCardProps) {
  const statusColors = {
    documented: 'bg-blue-100 text-blue-800 border-blue-200',
    needs_review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    ready_for_design: 'bg-green-100 text-green-800 border-green-200',
    future: 'bg-gray-100 text-gray-800 border-gray-200',
    blocked: 'bg-red-100 text-red-800 border-red-200',
  };

  const riskColors = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    critical: 'text-red-600',
  };

  return (
    <div
      onClick={() => onClick(item)}
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-sm">{item.name}</h3>
          <p className="text-xs text-muted-foreground">{item.slug}</p>
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusColors[item.status]}`}
        >
          {item.status.replace(/_/g, ' ')}
        </span>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{item.description}</p>

      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex gap-2">
          <span className="bg-muted px-2 py-0.5 rounded text-muted-foreground">
            {item.type.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="flex gap-2 text-muted-foreground">
          <span title="Risk Level" className={`font-medium ${riskColors[item.risk_level]}`}>
            Risk: {item.risk_level}
          </span>
        </div>
      </div>
    </div>
  );
}
