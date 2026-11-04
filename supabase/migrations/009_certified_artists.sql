-- =====================================================
-- 009: Certificirane Brendia Pro® Artistice (faza 2, zadatak 2.7)
-- Javni popis certificiranih polaznica s pretragom po gradu i salonu.
-- Na popis idu SAMO polaznice koje su dale suglasnost (is_public).
-- Pokrenuti u Supabase SQL Editoru (shared baza) — ZAJEDNO s 008.
-- =====================================================

CREATE TABLE IF NOT EXISTS public.certified_artists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Veza na platformu (neobavezno — unos može biti i ručni)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  full_name TEXT NOT NULL,
  salon_name TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Hrvatska',

  instagram_url TEXT,
  website_url TEXT,

  certified_at DATE,

  -- Suglasnost polaznice za objavu na webu
  is_public BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certified_artists_city ON public.certified_artists(city);
CREATE INDEX IF NOT EXISTS idx_certified_artists_public ON public.certified_artists(is_public);

ALTER TABLE public.certified_artists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read public artists" ON public.certified_artists;
CREATE POLICY "Public can read public artists"
  ON public.certified_artists FOR SELECT
  USING (is_public = true);

DROP POLICY IF EXISTS "Service role manages artists" ON public.certified_artists;
CREATE POLICY "Service role manages artists"
  ON public.certified_artists FOR ALL
  USING (auth.role() = 'service_role');
