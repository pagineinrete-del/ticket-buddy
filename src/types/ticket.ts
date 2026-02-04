export type TicketStatus = 'aperto' | 'in_lavorazione' | 'chiuso';

export interface Ticket {
  id: string;
  numero_ticket: string | null;
  motivo_ticket: string;
  telefono: string;
  stato_ticket: TicketStatus;
  data_apertura: string;
  data_chiusura: string | null;
  chi_aperto: string | null;
  referente_assistenza: string | null;
}

export interface CreateTicketData {
  motivo_ticket: string;
  telefono: string;
  numero_ticket?: string;
  chi_aperto?: string;
  referente_assistenza?: string;
}

export type StatusFilter = TicketStatus | 'tutti' | 'attivi';
