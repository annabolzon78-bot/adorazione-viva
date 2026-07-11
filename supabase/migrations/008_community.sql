-- ============================================================
-- 008 — COMMUNITY (Prayers, Events, Testimonials, Favorites)
-- ============================================================

-- Categorie preghiere
CREATE TABLE IF NOT EXISTS public.prayer_categories (
  id         SERIAL PRIMARY KEY,
  name_it    TEXT NOT NULL,
  name_en    TEXT,
  slug       TEXT NOT NULL UNIQUE,
  icon       TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- Preghiere
CREATE TABLE IF NOT EXISTS public.prayers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id INT REFERENCES public.prayer_categories(id),
  title_it    TEXT NOT NULL,
  title_en    TEXT,
  body_it     TEXT NOT NULL,
  body_en     TEXT,
  author      TEXT,
  source      TEXT,
  is_public   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Intenzioni di preghiera
CREATE TABLE IF NOT EXISTS public.prayer_requests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  text         TEXT NOT NULL,
  author_name  TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  is_public    BOOLEAN NOT NULL DEFAULT TRUE,
  prayer_count INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Testimonianze
CREATE TABLE IF NOT EXISTS public.testimonials (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  location    TEXT,
  text        TEXT NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_public   BOOLEAN NOT NULL DEFAULT FALSE,   -- richiede approvazione
  approved_by UUID REFERENCES public.profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── EVENTI ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parish_id    UUID NOT NULL REFERENCES public.parishes(id) ON DELETE CASCADE,
  created_by   UUID REFERENCES public.profiles(id),
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL,
  type         event_type NOT NULL DEFAULT 'ALTRO',
  description  TEXT,
  address      TEXT,
  lat          DOUBLE PRECISION,
  lng          DOUBLE PRECISION,
  start_date   TIMESTAMPTZ NOT NULL,
  end_date     TIMESTAMPTZ,
  image_url    TEXT,
  is_free      BOOLEAN NOT NULL DEFAULT TRUE,
  price        NUMERIC(10,2),
  max_attendees INT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(parish_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_events_parish    ON public.events(parish_id);
CREATE INDEX IF NOT EXISTS idx_events_published ON public.events(is_published);
CREATE INDEX IF NOT EXISTS idx_events_start     ON public.events(start_date);

CREATE TRIGGER events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── FAVORITI ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.favorites (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  entity_type  TEXT NOT NULL CHECK (entity_type IN ('CHAPEL','PARISH','STREAM','MIRACLE','EVENT')),
  entity_id    UUID NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, entity_type, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);

-- ── NOTIFICHE ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        notification_type NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  data        JSONB,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user   ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read);

-- ── DIARIO SPIRITUALE ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.spiritual_journals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT,
  content     TEXT NOT NULL,
  mood        TEXT CHECK (mood IN ('JOY','PEACE','SADNESS','DOUBT','GRATITUDE','OTHER')),
  session_id  UUID REFERENCES public.adoration_sessions(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journals_user ON public.spiritual_journals(user_id);
-- Privato: solo l'utente vede il proprio diario (RLS)

CREATE TRIGGER journals_updated_at BEFORE UPDATE ON public.spiritual_journals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
