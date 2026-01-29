import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusFilter } from '@/types/ticket';
import { cn } from '@/lib/utils';

interface TicketFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
}

const filterOptions: { value: StatusFilter; label: string }[] = [
  { value: 'attivi', label: 'Attivi' },
  { value: 'aperto', label: 'Aperti' },
  { value: 'in_lavorazione', label: 'In lavorazione' },
  { value: 'chiuso', label: 'Chiusi' },
  { value: 'tutti', label: 'Tutti' },
];

export function TicketFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: TicketFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cerca per telefono, motivo o ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant="ghost"
            size="sm"
            onClick={() => onStatusFilterChange(option.value)}
            className={cn(
              'px-3 py-1.5 h-auto text-sm font-medium rounded-md transition-all',
              statusFilter === option.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
