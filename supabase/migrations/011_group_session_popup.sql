-- =====================================================
-- 011: Pop-up za grupnu edukaciju (zahtjev klijentice 4.11.2026.)
-- Pop-up s terminom i linkom na prijavu prikazuje se na webu SAMO kad je
-- uključen u adminu (Termini edukacija → "Prikaži pop-up na webu").
-- Zadano isključen; klijentica/Bruno ga pale i gase bez deploya.
-- Sigurno pokrenuti odmah (kolona s defaultom, live kod je ne čita).
-- =====================================================

ALTER TABLE public.group_education_sessions
  ADD COLUMN IF NOT EXISTS show_popup BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.group_education_sessions.show_popup IS
  'Prikaži pop-up s ovim terminom na marketing webu (pali/gasi se u adminu).';
