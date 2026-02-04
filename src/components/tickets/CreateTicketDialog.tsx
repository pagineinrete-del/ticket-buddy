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
  const [telefono, setTelefono] = useState('');
  const [motivoTicket, setMotivoTicket] = useState('');
  const [chiAperto, setChiAperto] = useState('');
  const [referenteAssistenza, setReferenteAssistenza] = useState('');
  
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
        chi_aperto: chiAperto.trim() || undefined,
        referente_assistenza: referenteAssistenza.trim() || undefined,
      });
      
      toast({
        title: 'Ticket creato',
        description: 'Il ticket è stato creato con successo',
      });
      
      setOpen(false);
      setTelefono('');
      setMotivoTicket('');
      setChiAperto('');
      setReferenteAssistenza('');
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
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuovo Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crea nuovo ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="telefono">Telefono *</Label>
            <Input
              id="telefono"
              type="tel"
              placeholder="es. 333 1234567"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo del ticket *</Label>
            <Textarea
              id="motivo"
              placeholder="Descrivi il problema o la richiesta..."
              value={motivoTicket}
              onChange={(e) => setMotivoTicket(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="chiAperto">Chi ha aperto</Label>
            <Input
              id="chiAperto"
              placeholder="Nome di chi apre il ticket"
              value={chiAperto}
              onChange={(e) => setChiAperto(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="referente">Referente assistenza</Label>
            <Input
              id="referente"
              placeholder="Nome del referente"
              value={referenteAssistenza}
              onChange={(e) => setReferenteAssistenza(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Annulla
            </Button>
            <Button type="submit" disabled={createTicket.isPending}>
              {createTicket.isPending ? 'Creazione...' : 'Crea Ticket'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
