-- Create tickets table
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  motivo_ticket TEXT NOT NULL,
  telefono TEXT NOT NULL,
  stato_ticket TEXT CHECK (stato_ticket IN ('aperto', 'in_lavorazione', 'chiuso')) NOT NULL DEFAULT 'aperto',
  data_apertura TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data_chiusura TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (since no auth is required for this ticket system)
CREATE POLICY "Allow public read access" 
ON public.tickets 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access" 
ON public.tickets 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access" 
ON public.tickets 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access" 
ON public.tickets 
FOR DELETE 
USING (true);

-- Create function to auto-set data_chiusura when stato_ticket is set to 'chiuso'
CREATE OR REPLACE FUNCTION public.handle_ticket_closure()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stato_ticket = 'chiuso' AND (OLD.stato_ticket IS NULL OR OLD.stato_ticket != 'chiuso') THEN
    NEW.data_chiusura = now();
  END IF;
  
  IF NEW.stato_ticket != 'chiuso' THEN
    NEW.data_chiusura = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic closure date
CREATE TRIGGER set_ticket_closure_date
BEFORE UPDATE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.handle_ticket_closure();