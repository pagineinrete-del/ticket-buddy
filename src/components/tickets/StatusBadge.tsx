import { cn } from '@/lib/utils';
import { TicketStatus } from '@/types/ticket';

interface StatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  aperto: {
    label: 'Aperto',
    className: 'bg-status-open-bg text-status-open',
  },
  in_lavorazione: {
    label: 'In lavorazione',
    className: 'bg-status-working-bg text-status-working',
  },
  chiuso: {
    label: 'Chiuso',
    className: 'bg-status-closed-bg text-status-closed',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
