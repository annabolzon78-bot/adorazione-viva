-- ============================================================
-- 007 — EUCHARISTIC MIRACLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.eucharistic_miracles (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                      TEXT NOT NULL UNIQUE,
  title                     TEXT NOT NULL,
  location                  TEXT,
  city                      TEXT,
  state                     TEXT,
  country_id                INT REFERENCES public.countries(id),
  continent                 continent,
  year                      INT,
  year_ca                   TEXT,   -- "circa 700", "XIII sec."
  summary                   TEXT NOT NULL,
  full_description          TEXT,
  context                   TEXT,
  miracle                   TEXT,
  aftermath                 TEXT,
  verification_level        miracle_level NOT NULL DEFAULT 'STORICO',
  is_visitable_today        BOOLEAN NOT NULL DEFAULT FALSE,
  conserved_at              TEXT,
  opening_hours             TEXT,
  entry_fee                 TEXT,
  access_info               TEXT,
  visiting_info             TEXT,
  lat                       DOUBLE PRECISION,
  lng                       DOUBLE PRECISION,
  image_url                 TEXT,
  thumbnail_url             TEXT,
  -- Scientifico
  tissue_type               TEXT,
  blood_type                TEXT,
  analyzed_by               TEXT,
  analysis_year             INT,
  analysis_institution      TEXT,
  scientific_analysis       TEXT,
  -- Ecclesiastico
  official_recognition      TEXT,
  recognized_by             TEXT,
  recognition_year          INT,
  ecclesiastical_recognition TEXT,
  -- Contatori
  view_count                INT NOT NULL DEFAULT 0,
  -- Pubblicazione
  status                    publish_status NOT NULL DEFAULT 'DRAFT',
  published_by              UUID REFERENCES public.profiles(id),
  published_at              TIMESTAMPTZ,
  sources                   TEXT[],
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_miracles_slug    ON public.eucharistic_miracles(slug);
CREATE INDEX IF NOT EXISTS idx_miracles_level   ON public.eucharistic_miracles(verification_level);
CREATE INDEX IF NOT EXISTS idx_miracles_country ON public.eucharistic_miracles(country_id);
CREATE INDEX IF NOT EXISTS idx_miracles_status  ON public.eucharistic_miracles(status);
CREATE INDEX IF NOT EXISTS idx_miracles_geo     ON public.eucharistic_miracles(lat, lng);
-- Full-text search
CREATE INDEX IF NOT EXISTS idx_miracles_fts ON public.eucharistic_miracles
  USING GIN(to_tsvector('italian', coalesce(title,'') || ' ' || coalesce(summary,'')));

CREATE TRIGGER miracles_updated_at BEFORE UPDATE ON public.eucharistic_miracles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Immagini miracolo
CREATE TABLE IF NOT EXISTS public.miracle_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  miracle_id  UUID NOT NULL REFERENCES public.eucharistic_miracles(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  caption     TEXT,
  credit      TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Video miracolo
CREATE TABLE IF NOT EXISTS public.miracle_videos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  miracle_id  UUID NOT NULL REFERENCES public.eucharistic_miracles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  url         TEXT NOT NULL,
  embed_url   TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Documenti miracolo
CREATE TABLE IF NOT EXISTS public.miracle_documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  miracle_id  UUID NOT NULL REFERENCES public.eucharistic_miracles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  url         TEXT NOT NULL,
  file_type   TEXT DEFAULT 'PDF',
  author      TEXT,
  year        INT,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bibliografia
CREATE TABLE IF NOT EXISTS public.miracle_bibliography (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  miracle_id  UUID NOT NULL REFERENCES public.eucharistic_miracles(id) ON DELETE CASCADE,
  authors     TEXT NOT NULL,
  title       TEXT NOT NULL,
  publisher   TEXT,
  journal     TEXT,
  year        INT,
  volume      TEXT,
  pages       TEXT,
  isbn        TEXT,
  url         TEXT,
  notes       TEXT,
  sort_order  INT NOT NULL DEFAULT 0
);

-- Pellegrinaggi associati al miracolo
CREATE TABLE IF NOT EXISTS public.miracle_pilgrimages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  miracle_id  UUID NOT NULL REFERENCES public.eucharistic_miracles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  location    TEXT,
  organizer   TEXT,
  frequency   TEXT,
  next_date   DATE,
  description TEXT,
  website_url TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
