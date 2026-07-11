-- ============================================================
-- 006 — LIVE STREAMS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.live_streams (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id     UUID REFERENCES public.parishes(id) ON DELETE CASCADE,
  chapel_id     UUID REFERENCES public.chapels(id)  ON DELETE SET NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  type          stream_type NOT NULL,
  url           TEXT NOT NULL,
  embed_url     TEXT,
  embed_html    TEXT,   -- sanitized server-side ONLY
  channel_id    TEXT,
  video_id      TEXT,
  hls_url       TEXT,
  thumbnail_url TEXT,
  language      stream_language NOT NULL DEFAULT 'IT',
  continent     continent,
  status        stream_status NOT NULL DEFAULT 'UNKNOWN',
  is_default    BOOLEAN NOT NULL DEFAULT FALSE,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  tags          TEXT[],
  contact_email TEXT,
  website_url   TEXT,
  last_checked  TIMESTAMPTZ,
  viewers_count INT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_streams_parish   ON public.live_streams(parish_id);
CREATE INDEX IF NOT EXISTS idx_streams_status   ON public.live_streams(status);
CREATE INDEX IF NOT EXISTS idx_streams_active   ON public.live_streams(is_active);
CREATE INDEX IF NOT EXISTS idx_streams_featured ON public.live_streams(is_featured);
CREATE INDEX IF NOT EXISTS idx_streams_lang     ON public.live_streams(language);

CREATE TRIGGER streams_updated_at BEFORE UPDATE ON public.live_streams
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Orari streaming ricorrenti
CREATE TABLE IF NOT EXISTS public.stream_schedules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id   UUID NOT NULL REFERENCES public.live_streams(id) ON DELETE CASCADE,
  day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6),
  start_time  TIME,
  end_time    TIME,
  title       TEXT,
  notes       TEXT
);
