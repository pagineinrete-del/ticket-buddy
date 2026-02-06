import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Phone, Calendar, User, Users } from 'lucide-react';
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
import { useIsMobile } from '@/hooks/use-mobile';

interface TicketTableProps {
  tickets: Ticket[];
  isLoading: boolean;
}

export function TicketTable({ tickets, isLoading }: TicketTableProps) {
  const updateStatus = useUpdateTicketStatus();
  const isMobile = useIsMobile();

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    updateStatus.mutate({ id: ticketId, status: newStatus });
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "d MMM yyyy, HH:mm", { locale: it });
  };

  const formatDateShort = (dateStr: string) => {
    return format(new Date(dateStr), "d/M/yy", { locale: it });
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
        <p className="text-base sm:text-lg">Nessun ticket trovato</p>
        <p className="text-xs sm:text-sm mt-1">Crea un nuovo ticket per iniziare</p>
      </div>
    );
  }

  // Mobile card view
  if (isMobile) {
    return (
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-card border rounded-lg p-3 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs font-medium text-foreground truncate">
                  {ticket.numero_ticket || `#${ticket.id.slice(0, 8)}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateShort(ticket.data_apertura)}
                </p>
              </div>
              <Select
                value={ticket.stato_ticket}
                onValueChange={(value: TicketStatus) => handleStatusChange(ticket.id, value)}
              >
                <SelectTrigger className="w-auto h-7 border-0 bg-transparent p-0 focus:ring-0">
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
            </div>
            
            <p className="text-sm text-foreground line-clamp-2">{ticket.motivo_ticket}</p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {ticket.telefono}
              </span>
              {ticket.chi_aperto && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {ticket.chi_aperto}
                </span>
              )}
              {ticket.referente_assistenza && (
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {ticket.referente_assistenza}
                </span>
              )}
              {ticket.data_chiusura && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Chiuso: {formatDateShort(ticket.data_chiusura)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="rounded-lg border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[180px]">Ticket</TableHead>
            <TableHead className="w-[140px]">Telefono</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead className="w-[120px]">Chi ha aperto</TableHead>
            <TableHead className="w-[140px]">Referente</TableHead>
            <TableHead className="w-[140px]">Stato</TableHead>
            <TableHead className="w-[160px]">Data Chiusura</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-xs font-medium text-foreground">
                    {ticket.numero_ticket || `#${ticket.id.slice(0, 8)}`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    aperto il {formatDate(ticket.data_apertura)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{ticket.telefono}</TableCell>
              <TableCell className="max-w-[200px] truncate" title={ticket.motivo_ticket}>
                {ticket.motivo_ticket}
              </TableCell>
              <TableCell className="text-sm">
                {ticket.chi_aperto || '—'}
              </TableCell>
              <TableCell className="text-sm">
                {ticket.referente_assistenza || '—'}
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
                {ticket.data_chiusura ? formatDate(ticket.data_chiusura) : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
