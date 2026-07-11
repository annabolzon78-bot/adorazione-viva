-- ============================================================
-- 004 — PARISHES & CHAPELS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.parishes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  address          TEXT,
  city             TEXT,
  region           TEXT,
  country_id       INT REFERENCES public.countries(id),
  diocese_id       UUID REFERENCES public.dioceses(id),
  lat              DOUBLE PRECISION,
  lng              DOUBLE PRECISION,
  email            TEXT,
  phone            TEXT,
  website_url      TEXT,
  logo_url         TEXT,
  cover_url        TEXT,
  status           parish_status NOT NULL DEFAULT 'PENDING',
  admin_id         UUID REFERENCES public.profiles(id),
  verified_by      UUID REFERENCES public.profiles(id),
  verified_at      TIMESTAMPTZ,
  rejection_reason TEXT,
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
  has_adoration    BOOLEAN NOT NULL DEFAULT FALSE,
  has_confession   BOOLEAN NOT NULL DEFAULT FALSE,
  has_streaming    BOOLEAN NOT NULL DEFAULT FALSE,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parishes_status   ON public.parishes(status);
CREATE INDEX IF NOT EXISTS idx_parishes_admin    ON public.parishes(admin_id);
CREATE INDEX IF NOT EXISTS idx_parishes_diocese  ON public.parishes(diocese_id);
CREATE INDEX IF NOT EXISTS idx_parishes_country  ON public.parishes(country_id);
CREATE INDEX IF NOT EXISTS idx_parishes_geo      ON public.parishes(lat, lng);
CREATE INDEX IF NOT EXISTS idx_parishes_slug     ON public.parishes(slug);

CREATE TRIGGER parishes_updated_at BEFORE UPDATE ON public.parishes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── CHAPELS ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.chapels (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id        UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL,
  description      TEXT,
  address          TEXT,
  lat              DOUBLE PRECISION,
  lng              DOUBLE PRECISION,
  adoration_type   adoration_type NOT NULL DEFAULT 'OCCASIONAL',
  is_open_now      BOOLEAN NOT NULL DEFAULT FALSE,
  is_24h           BOOLEAN NOT NULL DEFAULT FALSE,
  has_live_stream  BOOLEAN NOT NULL DEFAULT FALSE,
  has_confession   BOOLEAN NOT NULL DEFAULT FALSE,
  is_accessible    BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified      BOOLEAN NOT NULL DEFAULT FALSE,
  phone            TEXT,
  email            TEXT,
  opening_hours    JSONB,   -- { mon:{open:'09:00',close:'19:00'}, ... }
  image_url        TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(parish_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_chapels_parish ON public.chapels(parish_id);
CREATE INDEX IF NOT EXISTS idx_chapels_geo    ON public.chapels(lat, lng);
CREATE INDEX IF NOT EXISTS idx_chapels_type   ON public.chapels(adoration_type);

CREATE TRIGGER chapels_updated_at BEFORE UPDATE ON public.chapels
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── SCHEDULES ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.schedules (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapel_id     UUID NOT NULL REFERENCES public.chapels(id) ON DELETE CASCADE,
  type          schedule_type NOT NULL,
  day_of_week   INT CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Dom, 6=Sab
  start_time    TIME,
  end_time      TIME,
  is_recurring  BOOLEAN NOT NULL DEFAULT TRUE,
  rite          mass_rite,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schedules_chapel ON public.schedules(chapel_id);
CREATE INDEX IF NOT EXISTS idx_schedules_type   ON public.schedules(type);
CREATE INDEX IF NOT EXISTS idx_schedules_day    ON public.schedules(day_of_week);

-- ── GEO SEARCH FUNCTION ───────────────────────────────────────

CREATE OR REPLACE FUNCTION public.chapels_within_radius(
  center_lat DOUBLE PRECISION,
  center_lng DOUBLE PRECISION,
  radius_km  DOUBLE PRECISION DEFAULT 50
)
RETURNS TABLE (
  id            UUID,
  name          TEXT,
  lat           DOUBLE PRECISION,
  lng           DOUBLE PRECISION,
  distance_km   DOUBLE PRECISION,
  adoration_type adoration_type,
  is_open_now   BOOLEAN,
  is_24h        BOOLEAN,
  has_live_stream BOOLEAN,
  parish_name   TEXT
) AS $$
  SELECT
    c.id, c.name, c.lat, c.lng,
    (6371 * acos(
      cos(radians(center_lat)) * cos(radians(c.lat)) *
      cos(radians(c.lng) - radians(center_lng)) +
      sin(radians(center_lat)) * sin(radians(c.lat))
    )) AS distance_km,
    c.adoration_type, c.is_open_now, c.is_24h, c.has_live_stream,
    p.name AS parish_name
  FROM public.chapels c
  JOIN public.parishes p ON p.id = c.parish_id
  WHERE p.status = 'VERIFIED'
    AND c.lat IS NOT NULL AND c.lng IS NOT NULL
    AND (6371 * acos(
      cos(radians(center_lat)) * cos(radians(c.lat)) *
      cos(radians(c.lng) - radians(center_lng)) +
      sin(radians(center_lat)) * sin(radians(c.lat))
    )) <= radius_km
  ORDER BY distance_km;
$$ LANGUAGE sql STABLE;
