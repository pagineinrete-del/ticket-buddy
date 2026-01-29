import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Ticket, CreateTicketData, TicketStatus, StatusFilter } from '@/types/ticket';

export function useTickets(filter: StatusFilter = 'attivi', searchQuery: string = '') {
  return useQuery({
    queryKey: ['tickets', filter, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('tickets')
        .select('*')
        .order('data_apertura', { ascending: false });

      // Apply status filter
      if (filter === 'attivi') {
        query = query.in('stato_ticket', ['aperto', 'in_lavorazione']);
      } else if (filter !== 'tutti') {
        query = query.eq('stato_ticket', filter);
      }

      // Apply search filter
      if (searchQuery.trim()) {
        const search = searchQuery.trim();
        query = query.or(`telefono.ilike.%${search}%,motivo_ticket.ilike.%${search}%,id.ilike.%${search}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Ticket[];
    },
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateTicketData) => {
      const { data: ticket, error } = await supabase
        .from('tickets')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return ticket as Ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TicketStatus }) => {
      const { data, error } = await supabase
        .from('tickets')
        .update({ stato_ticket: status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}
