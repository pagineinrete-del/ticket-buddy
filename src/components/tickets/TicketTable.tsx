import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Ticket, TicketStatus } from '@/types/ticket';
import { StatusBadge } from './StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateTicketStatus } from '@/hooks/useTickets';
import { Skeleton } from '@/components/ui/skeleton';

interface TicketTableProps {
  tickets: Ticket[];
  isLoading: boolean;
}

export function TicketTable({ tickets, isLoading }: TicketTableProps) {
  const updateStatus = useUpdateTicketStatus();

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    updateStatus.mutate({ id: ticketId, status: newStatus });
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "d MMM yyyy, HH:mm", { locale: it });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">Nessun ticket trovato</p>
        <p className="text-sm mt-1">Crea un nuovo ticket per iniziare</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px]">ID</TableHead>
            <TableHead className="w-[140px]">Telefono</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead className="w-[140px]">Stato</TableHead>
            <TableHead className="w-[160px]">Data Apertura</TableHead>
            <TableHead className="w-[160px]">Data Chiusura</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {ticket.id.slice(0, 8)}...
              </TableCell>
              <TableCell className="font-medium">{ticket.telefono}</TableCell>
              <TableCell className="max-w-[300px] truncate" title={ticket.motivo_ticket}>
                {ticket.motivo_ticket}
              </TableCell>
              <TableCell>
                <Select
                  value={ticket.stato_ticket}
                  onValueChange={(value: TicketStatus) => handleStatusChange(ticket.id, value)}
                >
                  <SelectTrigger className="w-[140px] h-8 border-0 bg-transparent p-0 focus:ring-0">
                    <SelectValue>
                      <StatusBadge status={ticket.stato_ticket} />
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aperto">
                      <StatusBadge status="aperto" />
                    </SelectItem>
                    <SelectItem value="in_lavorazione">
                      <StatusBadge status="in_lavorazione" />
                    </SelectItem>
                    <SelectItem value="chiuso">
                      <StatusBadge status="chiuso" />
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(ticket.data_apertura)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {ticket.data_chiusura ? formatDate(ticket.data_chiusura) : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
