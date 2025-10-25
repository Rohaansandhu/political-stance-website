import { Badge } from "../ui/badge";
import { X } from "lucide-react";

interface FilterChipProps {
  label: string;
  value: string;
  onRemove?: () => void;
}

export function FilterChip({ label, value, onRemove }: FilterChipProps) {
  return (
    <Badge variant="secondary" className="gap-2 px-3 py-1">
      <span className="text-xs">
        <span className="opacity-75">{label}:</span> {value}
      </span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:bg-foreground/10 rounded-full p-0.5 transition-colors"
          aria-label="Remove filter"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}
