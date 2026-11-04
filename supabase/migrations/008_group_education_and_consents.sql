-- =====================================================
-- 008: Nova ponuda (faza 1 redizajna, upute 29.10.2026)
--   1. Termini grupne edukacije (uredivi kroz admin)
--   2. Kvačica za trenutnu aktivaciju digitalnog sadržaja (bilježi se uz narudžbu)
--   3. Predujam (30 %) za edukacije uživo
-- Pokrenuti u Supabase SQL Editoru (shared baza).
-- =====================================================

-- 1) Termini grupne edukacije -------------------------------------------
CREATE TABLE IF NOT EXISTS public.group_education_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL DEFAULT 'artist-group',

  -- Prikaz na webu: "5. i 6. prosinca 2026." / "5 and 6 December 2026"
  dates_label_hr TEXT NOT NULL,
  dates_label_en TEXT NOT NULL,
  starts_on DATE NOT NULL,
  enrollment_deadline DATE NOT NULL,

  total_seats INTEGER NOT NULL DEFAULT 5 CHECK (total_seats > 0),
  seats_taken INTEGER NOT NULL DEFAULT 0 CHECK (seats_taken >= 0),
  is_open BOOLEAN NOT NULL DEFAULT true,

  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.group_education_sessions ENABLE ROW LEVEL SECURITY;

-- Javno čitanje otvorenih termina (web prikazuje slobodna mjesta),
-- pisanje samo service role (admin na platformi).
DROP POLICY IF EXISTS "Public can read open sessions" ON public.group_education_sessions;
CREATE POLICY "Public can read open sessions"
  ON public.group_education_sessions FOR SELECT
  USING (is_open = true);

DROP POLICY IF EXISTS "Service role manages sessions" ON public.group_education_sessions;
CREATE POLICY "Service role manages sessions"
  ON public.group_education_sessions FOR ALL
  USING (auth.role() = 'service_role');

-- Atomsko zauzimanje mjesta nakon uspješne uplate predujma.
-- Vraća true ako je mjesto zauzeto, false ako je termin popunjen.
CREATE OR REPLACE FUNCTION public.claim_group_seat(session_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  claimed INTEGER;
BEGIN
  UPDATE public.group_education_sessions
  SET seats_taken = seats_taken + 1,
      updated_at = NOW()
  WHERE id = session_id
    AND seats_taken < total_seats;
  GET DIAGNOSTICS claimed = ROW_COUNT;
  RETURN claimed > 0;
END;
$$;

-- Mjesto smije zauzeti samo backend (service role) nakon uplate — bez
-- ovoga bi funkciju preko PostgREST-a mogao pozvati bilo tko.
REVOKE EXECUTE ON FUNCTION public.claim_group_seat(UUID) FROM PUBLIC, anon, authenticated;

-- Prva grupa: 5. i 6. prosinca 2026., upis do 21. studenoga 2026.
INSERT INTO public.group_education_sessions
  (dates_label_hr, dates_label_en, starts_on, enrollment_deadline, total_seats)
SELECT '5. i 6. prosinca 2026.', '5 and 6 December 2026', '2026-12-05', '2026-11-21', 5
WHERE NOT EXISTS (
  SELECT 1 FROM public.group_education_sessions WHERE starts_on = '2026-12-05'
);

-- 2) Kvačica za trenutnu aktivaciju digitalnog sadržaja ------------------
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS digital_activation_consent BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS digital_activation_consent_at TIMESTAMPTZ;

-- 3) Predujam za edukacije uživo ----------------------------------------
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_type TEXT NOT NULL DEFAULT 'full'
    CHECK (payment_type IN ('full', 'deposit')),
  -- Puna (bruto) cijena programa kod predujma, u centima
  ADD COLUMN IF NOT EXISTS program_price INTEGER,
  ADD COLUMN IF NOT EXISTS group_session_id UUID REFERENCES public.group_education_sessions(id),
  -- Pristanak na uvjete rezervacije (predujam 30 %, promjena termina >= 14 dana)
  ADD COLUMN IF NOT EXISTS reservation_terms_accepted BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.orders.digital_activation_consent IS
  'Obavezna kvačica na naplati online programa: pristanak na trenutnu aktivaciju digitalnog sadržaja i gubitak prava na jednostrani raskid.';
COMMENT ON COLUMN public.orders.payment_type IS
  'full = puna cijena; deposit = predujam 30 % za edukacije uživo (ostatak prije/na dan edukacije).';
