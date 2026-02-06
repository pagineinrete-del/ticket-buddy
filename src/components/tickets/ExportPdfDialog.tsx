import { useState } from 'react';
import { FileDown, Calendar } from 'lucide-react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subWeeks, subMonths, subYears } from 'date-fns';
import { it } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Ticket } from '@/types/ticket';

type DateRange = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear';

const dateRangeLabels: Record<DateRange, string> = {
  today: 'Oggi',
  yesterday: 'Ieri',
  thisWeek: 'Questa settimana',
  lastWeek: 'Settimana scorsa',
  thisMonth: 'Questo mese',
  lastMonth: 'Mese scorso',
  thisYear: 'Quest\'anno',
  lastYear: 'Anno scorso',
};

function getDateRange(range: DateRange): { start: Date; end: Date } {
  const now = new Date();
  
  switch (range) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'yesterday':
      const yesterday = subDays(now, 1);
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
    case 'thisWeek':
      return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
    case 'lastWeek':
      const lastWeek = subWeeks(now, 1);
      return { start: startOfWeek(lastWeek, { weekStartsOn: 1 }), end: endOfWeek(lastWeek, { weekStartsOn: 1 }) };
    case 'thisMonth':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'lastMonth':
      const lastMonth = subMonths(now, 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    case 'thisYear':
      return { start: startOfYear(now), end: endOfYear(now) };
    case 'lastYear':
      const lastYear = subYears(now, 1);
      return { start: startOfYear(lastYear), end: endOfYear(lastYear) };
    default:
      return { start: startOfDay(now), end: endOfDay(now) };
  }
}

const statusLabels: Record<string, string> = {
  aperto: 'Aperto',
  in_lavorazione: 'In Lavorazione',
  chiuso: 'Chiuso',
};

export function ExportPdfDialog() {
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('thisMonth');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportToPdf = async () => {
    setIsExporting(true);
    
    try {
      const { start, end } = getDateRange(dateRange);
      
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('*')
        .gte('data_apertura', start.toISOString())
        .lte('data_apertura', end.toISOString())
        .order('data_apertura', { ascending: false });

      if (error) throw error;

      if (!tickets || tickets.length === 0) {
        toast({
          title: 'Nessun ticket',
          description: 'Non ci sono ticket nel periodo selezionato',
          variant: 'destructive',
        });
        return;
      }

      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(18);
      doc.setTextColor(33, 37, 41);
      doc.text('Report Ticket', 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(108, 117, 125);
      doc.text(`Periodo: ${dateRangeLabels[dateRange]}`, 14, 28);
      doc.text(`Dal ${format(start, 'd MMMM yyyy', { locale: it })} al ${format(end, 'd MMMM yyyy', { locale: it })}`, 14, 34);
      doc.text(`Generato il: ${format(new Date(), 'd MMMM yyyy, HH:mm', { locale: it })}`, 14, 40);
      doc.text(`Totale ticket: ${tickets.length}`, 14, 46);

      // Stats
      const openCount = tickets.filter(t => t.stato_ticket === 'aperto').length;
      const workingCount = tickets.filter(t => t.stato_ticket === 'in_lavorazione').length;
      const closedCount = tickets.filter(t => t.stato_ticket === 'chiuso').length;
      
      doc.text(`Aperti: ${openCount} | In Lavorazione: ${workingCount} | Chiusi: ${closedCount}`, 14, 52);

      // Table
      const tableData = (tickets as Ticket[]).map(ticket => [
        ticket.numero_ticket || `#${ticket.id.slice(0, 8)}`,
        ticket.telefono,
        ticket.motivo_ticket.length > 40 ? ticket.motivo_ticket.slice(0, 40) + '...' : ticket.motivo_ticket,
        ticket.chi_aperto || '-',
        ticket.referente_assistenza || '-',
        statusLabels[ticket.stato_ticket] || ticket.stato_ticket,
        format(new Date(ticket.data_apertura), 'd/MM/yy HH:mm'),
        ticket.data_chiusura ? format(new Date(ticket.data_chiusura), 'd/MM/yy HH:mm') : '-',
      ]);

      autoTable(doc, {
        startY: 58,
        head: [['Ticket', 'Telefono', 'Motivo', 'Chi ha aperto', 'Referente', 'Stato', 'Apertura', 'Chiusura']],
        body: tableData,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { cellWidth: 22 },
          1: { cellWidth: 22 },
          2: { cellWidth: 40 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 22 },
          6: { cellWidth: 22 },
          7: { cellWidth: 22 },
        },
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Pagina ${i} di ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // Save
      const fileName = `ticket-report-${format(start, 'yyyy-MM-dd')}-${format(end, 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);

      toast({
        title: 'PDF generato',
        description: `Esportati ${tickets.length} ticket`,
      });

      setOpen(false);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile generare il PDF',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm">
          <FileDown className="h-4 w-4" />
          <span className="hidden sm:inline">Esporta PDF</span>
          <span className="sm:hidden">PDF</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Esporta Report PDF
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-sm">Periodo</Label>
            <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
              <SelectTrigger className="h-9 sm:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Oggi</SelectItem>
                <SelectItem value="yesterday">Ieri</SelectItem>
                <SelectItem value="thisWeek">Questa settimana</SelectItem>
                <SelectItem value="lastWeek">Settimana scorsa</SelectItem>
                <SelectItem value="thisMonth">Questo mese</SelectItem>
                <SelectItem value="lastMonth">Mese scorso</SelectItem>
                <SelectItem value="thisYear">Quest'anno</SelectItem>
                <SelectItem value="lastYear">Anno scorso</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={exportToPdf} className="w-full gap-2 h-9 sm:h-10" disabled={isExporting}>
            {isExporting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></span>
                Generazione...
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" />
                Genera PDF
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
