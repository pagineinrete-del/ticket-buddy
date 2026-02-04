-- Add new columns for ticket opener and support reference
ALTER TABLE public.tickets 
ADD COLUMN chi_aperto text,
ADD COLUMN referente_assistenza text;