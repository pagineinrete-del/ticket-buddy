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
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary flex-shrink-0">
                <Ticket className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-foreground truncate">Gestione Ticket</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <ExportPdfDialog />
              <CreateTicketDialog />
              <Button variant="ghost" size="icon" onClick={handleSignOut} title="Esci" className="h-8 w-8 sm:h-9 sm:w-9">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-card border rounded-lg p-2.5 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Attivi</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground">
                {tickets.filter(t => t.stato_ticket !== 'chiuso').length}
              </p>
            </div>
            <div className="bg-card border rounded-lg p-2.5 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">In Lavoro</p>
              <p className="text-lg sm:text-2xl font-bold text-status-working">
                {tickets.filter(t => t.stato_ticket === 'in_lavorazione').length}
              </p>
            </div>
            <div className="bg-card border rounded-lg p-2.5 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Totale</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground">{tickets.length}</p>
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
