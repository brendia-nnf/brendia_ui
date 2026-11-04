-- =====================================================
-- 010: Blog + galerija metode (faza 3 redizajna)
--   1. blog_posts — klijentica samostalno piše i objavljuje kroz admin
--      na platformi; web prikazuje samo objavljene članke
--   2. method_gallery — prije/poslije radovi na stranici /hr/metoda
-- Seed: dva članka iz uputa (NEOBJAVLJENA — klijentica dodaje naslovne
-- fotografije i objavljuje kroz admin; blog ulazi u izbornik tek tada).
-- Pokrenuti u Supabase SQL Editoru zajedno s 008 i 009.
-- =====================================================

-- 1) Blog ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  slug TEXT NOT NULL UNIQUE,
  locale TEXT NOT NULL DEFAULT 'hr' CHECK (locale IN ('hr', 'en')),
  category TEXT NOT NULL CHECK (category IN ('za-frizerke', 'za-klijentice', 'iza-kulisa')),

  title TEXT NOT NULL,
  excerpt TEXT,
  content_html TEXT NOT NULL,
  cover_image_url TEXT,
  cover_image_alt TEXT,
  author TEXT NOT NULL DEFAULT 'Brendia Pro®',

  -- SEO polja po članku
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,

  -- Poziv na akciju na dnu članka
  cta_label TEXT,
  cta_url TEXT,

  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published posts" ON public.blog_posts;
CREATE POLICY "Public can read published posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true);

DROP POLICY IF EXISTS "Service role manages posts" ON public.blog_posts;
CREATE POLICY "Service role manages posts"
  ON public.blog_posts FOR ALL
  USING (auth.role() = 'service_role');

-- 2) Galerija metode -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.method_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_before_url TEXT,
  image_after_url TEXT,
  -- Predložak opisa: "[Tip kose] · [broj redova] · [Hand-tied / Genius] weft"
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.method_gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read public gallery" ON public.method_gallery;
CREATE POLICY "Public can read public gallery"
  ON public.method_gallery FOR SELECT
  USING (is_public = true);

DROP POLICY IF EXISTS "Service role manages gallery" ON public.method_gallery;
CREATE POLICY "Service role manages gallery"
  ON public.method_gallery FOR ALL
  USING (auth.role() = 'service_role');

-- 3) Seed: dva napisana članka (neobjavljena) -----------------------------
INSERT INTO public.blog_posts
  (slug, category, title, excerpt, meta_title, meta_description, cta_label, cta_url, is_published, content_html)
SELECT
  'weft-keratin-ili-trake',
  'za-klijentice',
  'Weft, keratin ili trake: koje ekstenzije su prave za vas?',
  'Kad razmišljate o ekstenzijama, prvo pitanje obično nije boja ni dužina, nego način ugradnje. O njemu ovisi kako će kosa izgledati, koliko će vam biti udobno i koliko često morate u salon.',
  'Weft, keratin ili trake: koje ekstenzije odabrati?',
  'Usporedili smo tri najčešća načina ugradnje ekstenzija: kako se postavljaju, koliko traju i što znače za vašu vlastitu kosu.',
  'Frizerka ste i želite naučiti weft ekstenzije? Upoznajte Brendia Pro® metodu.',
  '/hr/metoda',
  false,
  $html$<p>Kad razmišljate o ekstenzijama, prvo pitanje obično nije boja ni dužina, nego način ugradnje. O njemu ovisi kako će kosa izgledati, koliko će vam biti udobno i koliko često morate u salon. Ukratko vam objašnjavamo tri najčešće metode.</p>
<h2>Keratinske ekstenzije</h2>
<p>Kod keratinskih ekstenzija svaki pramen ima vrh od keratina koji se toplinom spaja s malim pramenom vlastite kose. Za punu glavu potrebno je mnogo pojedinačnih spojeva, pa ugradnja traje dulje. Spojevi su mali i diskretni, ali se pri skidanju odvajaju posebnim sredstvom. Kosa se može ponovno ugraditi, no skidanjem se izgubi otprilike polovica, pa je treba nadopuniti kupnjom nove kose.</p>
<h2>Trake</h2>
<p>Trake su tanke trake kose s ljepljivim slojem koje se postavljaju s obje strane tankog pramena vlastite kose. Ugradnja je brza, a rezultat ravan i neprimjetan. Zbog ljepila je važno paziti na proizvode za njegu i redovito dolaziti na podizanje traka, obično svakih nekoliko tjedana.</p>
<h2>Weft ekstenzije</h2>
<p>Weft je duža traka kose šivena u jedan red. Postavlja se u redovima, pa je spojeva mnogo manje nego kod pojedinačnih pramenova. Kod Brendia Pro® metode weft se šiva na precizno izrađenu bazu, bez topline i ljepila. Težina se raspoređuje kroz planirani red, pa se ekstenzije bolje stapaju s vlastitom kosom, a uklanjanje je brzo. Na održavanju, svakih 2 do 2,5 mjeseca, red se skida i ponovno postavlja, a ista se kosa koristi kroz više održavanja.</p>
<h2>Kako odabrati</h2>
<p>Ne postoji metoda koja je najbolja za svakoga. Pitajte se:</p>
<ul>
<li><strong>Koliko je gusta vaša kosa?</strong> Kod tanke i rjeđe kose posebno je važna ravnomjerna raspodjela težine.</li>
<li><strong>Kako želite nositi kosu?</strong> Ako je često vežete u rep ili punđu, pitajte kako će se spojevi vidjeti.</li>
<li><strong>Koliko često možete u salon?</strong> Svaka metoda traži održavanje, ali u različitim razmacima.</li>
<li><strong>Zašto želite ekstenzije?</strong> Za volumen, dužinu ili oboje? O tome ovisi broj redova ili pramenova.</li>
</ul>
<p>Najviše će vam pomoći konzultacija s frizerkom koja radi s ekstenzijama. Dobra frizerka najprije će pogledati vašu kosu, pitati vas o navikama i tek onda predložiti metodu.</p>
<h2>Gdje napraviti weft ekstenzije</h2>
<p>Šivane weft ekstenzije po Brendia Pro® metodi radi Nikolina Kljaić u Studio One by Nina. Certificirane Brendia Pro® Artistice u svom gradu možete pronaći na popisu certificiranih na našem webu.</p>$html$
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'weft-keratin-ili-trake');

INSERT INTO public.blog_posts
  (slug, category, title, excerpt, meta_title, meta_description, cta_label, cta_url, is_published, content_html)
SELECT
  'weft-ekstenzije-u-ponudi-salona',
  'za-frizerke',
  'Kako uvesti weft ekstenzije u ponudu salona',
  'Klijentice sve češće traže volumen i dužinu koji izgledaju prirodno. Weft ekstenzije su usluga koja to omogućuje, a salonu donosi i nešto jednako vrijedno: klijenticu koja se redovito vraća na održavanje.',
  'Kako uvesti weft ekstenzije u ponudu salona',
  'Pet koraka do nove premium usluge: od edukacije i prvih modela do cijene, konzultacija i održavanja koje klijentice vraća u salon.',
  'Brendia Pro® edukacija vodi vas kroz cijeli postupak, od analize kose do certifikata. Usporedite programe.',
  '/hr/tecajevi',
  false,
  $html$<p>Klijentice sve češće traže volumen i dužinu koji izgledaju prirodno. Weft ekstenzije su usluga koja to omogućuje, a salonu donosi i nešto jednako vrijedno: klijenticu koja se redovito vraća na održavanje. Evo kako krenuti.</p>
<h2>1. Naučite metodu, ne samo tehniku</h2>
<p>Ugradnja wefta nije samo postavljanje kose. Uključuje analizu kose klijentice, sekcioniranje, raspodjelu težine, usklađivanje boje i šišanje na kraju. Kad sve to naučite kao jedan sustav, rezultat je isti na svakoj klijentici. Zato vrijedi odabrati edukaciju koja vas vodi korak po korak i daje vam povratnu informaciju na vaš rad.</p>
<h2>2. Vježbajte prije prve klijentice</h2>
<p>Prve ugradnje napravite na lutki pa na modelu. Fotografirajte svaku, prije i poslije. Te fotografije postaju vaš prvi portfelj i najbolji dokaz za klijentice koje se dvoume.</p>
<h2>3. Odredite cijenu</h2>
<p>Cijena ugradnje uključuje vaše vrijeme, iskustvo i kosu. Održavanje je zasebna usluga koju klijentica ponavlja svakih nekoliko tjedana. Pogledajte cijene u svom gradu i nemojte se natjecati najnižom cijenom. Weft je premium usluga i treba je tako i predstaviti.</p>
<h2>4. Konzultacija prije svake ugradnje</h2>
<p>Dobra konzultacija traži 15–20 minuta, a štedi puno nesporazuma. Pogledajte gustoću i stanje kose, pitajte klijenticu kako je nosi i što očekuje, objasnite održavanje i jasno kažite cijenu. Klijentica koja zna što dobiva postaje zadovoljna klijentica.</p>
<h2>5. Pokažite rezultate</h2>
<p>Objavljujte radove na Instagramu i u salonu, uz pristanak klijentica. Kratki video prije i poslije govori više od bilo kakvog opisa. Klijentice s ekstenzijama najbolji su ambasadori: kad ih netko pita za kosu, upućuju ih na vas.</p>
<h2>Od ugradnje do stalne klijentice</h2>
<p>Najveća vrijednost wefta nije jedna ugradnja, nego odnos koji slijedi. Svako održavanje prilika je za njegu, šišanje ili boju. Tako jedna usluga postaje redovit prihod salona.</p>$html$
WHERE NOT EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = 'weft-ekstenzije-u-ponudi-salona');
