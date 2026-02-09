import { useState } from 'react';
import { Ticket, LogOut } from 'lucide-react';
import { CreateTicketDialog } from '@/components/tickets/CreateTicketDialog';
import { TicketTable } from '@/components/tickets/TicketTable';
import { TicketFilters } from '@/components/tickets/TicketFilters';
import { ExportPdfDialog } from '@/components/tickets/ExportPdfDialog';
import { useTickets } from '@/hooks/useTickets';
import { useAuth } from '@/hooks/useAuth';
import { StatusFilter } from '@/types/ticket';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('attivi');
  
  const { data: tickets = [], isLoading } = useTickets(statusFilter, searchQuery);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: 'Errore',
        description: 'Impossibile effettuare il logout',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-primary flex-shrink-0">
                <Ticket className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-sm sm:text-xl font-bold text-foreground truncate">Ticket</h1>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <ExportPdfDialog />
              <CreateTicketDialog />
              <Button variant="ghost" size="icon" onClick={handleSignOut} title="Esci" className="h-8 w-8">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="space-y-3 sm:space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-4">
            <div className="bg-card border rounded-lg p-2 sm:p-4 text-center">
              <p className="text-[10px] sm:text-sm text-muted-foreground leading-tight">Attivi</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {tickets.filter(t => t.stato_ticket !== 'chiuso').length}
              </p>
            </div>
            <div className="bg-card border rounded-lg p-2 sm:p-4 text-center">
              <p className="text-[10px] sm:text-sm text-muted-foreground leading-tight">In Lavoro</p>
              <p className="text-xl sm:text-2xl font-bold text-status-working">
                {tickets.filter(t => t.stato_ticket === 'in_lavorazione').length}
              </p>
            </div>
            <div className="bg-card border rounded-lg p-2 sm:p-4 text-center">
              <p className="text-[10px] sm:text-sm text-muted-foreground leading-tight">Totale</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">{tickets.length}</p>
            </div>
          </div>

          {/* Filters */}
          <TicketFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {/* Table */}
          <TicketTable tickets={tickets} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Index;
