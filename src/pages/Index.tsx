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
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary">
                <Ticket className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Gestione Ticket</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ExportPdfDialog />
              <CreateTicketDialog />
              <Button variant="ghost" size="icon" onClick={handleSignOut} title="Esci">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Ticket Attivi</p>
              <p className="text-2xl font-bold text-foreground">
                {tickets.filter(t => t.stato_ticket !== 'chiuso').length}
              </p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">In Lavorazione</p>
              <p className="text-2xl font-bold text-status-working">
                {tickets.filter(t => t.stato_ticket === 'in_lavorazione').length}
              </p>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Totale Visualizzati</p>
              <p className="text-2xl font-bold text-foreground">{tickets.length}</p>
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
