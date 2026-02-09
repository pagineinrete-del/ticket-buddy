import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTicket } from '@/hooks/useTickets';
import { useToast } from '@/hooks/use-toast';

export function CreateTicketDialog() {
  const [open, setOpen] = useState(false);
  const [numeroTicket, setNumeroTicket] = useState('');
  const [telefono, setTelefono] = useState('');
  const [motivoTicket, setMotivoTicket] = useState('');
  const [chiAperto, setChiAperto] = useState('');
  const [referenteAssistenza, setReferenteAssistenza] = useState('');
  const [numeroPm, setNumeroPm] = useState('');
  
  const createTicket = useCreateTicket();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!telefono.trim() || !motivoTicket.trim()) {
      toast({
        title: 'Errore',
        description: 'Compila tutti i campi obbligatori',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createTicket.mutateAsync({
        telefono: telefono.trim(),
        motivo_ticket: motivoTicket.trim(),
        numero_ticket: numeroTicket.trim() || undefined,
        chi_aperto: chiAperto.trim() || undefined,
        referente_assistenza: referenteAssistenza.trim() || undefined,
        numero_pm: numeroPm.trim() || undefined,
      });
      
      toast({
        title: 'Ticket creato',
        description: 'Il ticket è stato creato con successo',
      });
      
      setOpen(false);
      setNumeroTicket('');
      setTelefono('');
      setMotivoTicket('');
      setChiAperto('');
      setReferenteAssistenza('');
      setNumeroPm('');
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Impossibile creare il ticket',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5 sm:gap-2 px-2.5 sm:px-4 h-8 sm:h-9 text-xs sm:text-sm">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuovo Ticket</span>
          <span className="sm:hidden">Nuovo</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle>Crea nuovo ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="numeroTicket" className="text-sm">Numero Ticket</Label>
            <Input
              id="numeroTicket"
              placeholder="es. TKT-001"
              value={numeroTicket}
              onChange={(e) => setNumeroTicket(e.target.value)}
              className="h-9 sm:h-10"
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="telefono" className="text-sm">Telefono *</Label>
            <Input
              id="telefono"
              type="tel"
              placeholder="es. 333 1234567"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="h-9 sm:h-10"
              required
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="motivo" className="text-sm">Motivo del ticket *</Label>
            <Textarea
              id="motivo"
              placeholder="Descrivi il problema o la richiesta..."
              value={motivoTicket}
              onChange={(e) => setMotivoTicket(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="numeroPm" className="text-sm">Numero PM</Label>
            <Input
              id="numeroPm"
              placeholder="es. PM-001"
              value={numeroPm}
              onChange={(e) => setNumeroPm(e.target.value)}
              className="h-9 sm:h-10"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="chiAperto" className="text-sm">Chi ha aperto</Label>
              <Input
                id="chiAperto"
                placeholder="Nome"
                value={chiAperto}
                onChange={(e) => setChiAperto(e.target.value)}
                className="h-9 sm:h-10"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="referente" className="text-sm">Referente</Label>
              <Input
                id="referente"
                placeholder="Nome"
                value={referenteAssistenza}
                onChange={(e) => setReferenteAssistenza(e.target.value)}
                className="h-9 sm:h-10"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-9 sm:h-10 text-sm"
            >
              Annulla
            </Button>
            <Button type="submit" disabled={createTicket.isPending} className="h-9 sm:h-10 text-sm">
              {createTicket.isPending ? 'Creazione...' : 'Crea Ticket'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
