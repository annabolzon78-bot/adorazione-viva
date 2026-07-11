-- ============================================================
-- 003 — GEOGRAPHY (Countries, Cities, Dioceses)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.countries (
  id           SERIAL PRIMARY KEY,
  code         CHAR(2) NOT NULL UNIQUE,   -- ISO 3166-1 alpha-2
  name_it      TEXT NOT NULL,
  name_en      TEXT NOT NULL,
  flag_emoji   TEXT,
  continent    continent,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_countries_code ON public.countries(code);

CREATE TABLE IF NOT EXISTS public.cities (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  region      TEXT,
  country_id  INT NOT NULL REFERENCES public.countries(id),
  lat         DOUBLE PRECISION,
  lng         DOUBLE PRECISION
);
CREATE INDEX IF NOT EXISTS idx_cities_country ON public.cities(country_id);
CREATE INDEX IF NOT EXISTS idx_cities_name    ON public.cities(name);

CREATE TABLE IF NOT EXISTS public.dioceses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  country_id   INT REFERENCES public.countries(id),
  bishop_name  TEXT,
  website_url  TEXT,
  email        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER dioceses_updated_at BEFORE UPDATE ON public.dioceses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
