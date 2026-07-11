-- ============================================================
-- 005 — ADORATION SESSIONS & SHIFTS
-- Il cuore del sistema: tracking adorazione in tempo reale
-- ============================================================

-- Sessioni adorazione (ogni volta che un utente preme "Sono davanti a Gesù")
CREATE TABLE IF NOT EXISTS public.adoration_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  chapel_id   UUID REFERENCES public.chapels(id)  ON DELETE SET NULL,
  country_code CHAR(2),   -- per utenti anonimi (solo paese)
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  status      session_status NOT NULL DEFAULT 'ACTIVE',
  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at    TIMESTAMPTZ,
  duration_minutes INT GENERATED ALWAYS AS (
    CASE WHEN ended_at IS NOT NULL
    THEN EXTRACT(EPOCH FROM (ended_at - started_at))::INT / 60
    ELSE NULL END
  ) STORED
);

CREATE INDEX IF NOT EXISTS idx_sessions_user    ON public.adoration_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_chapel  ON public.adoration_sessions(chapel_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status  ON public.adoration_sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_started ON public.adoration_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_sessions_country ON public.adoration_sessions(country_code);

-- Vista: adoratori ora (sessioni attive negli ultimi 15 min)
CREATE OR REPLACE VIEW public.adorers_now AS
  SELECT
    count(*)::INT                                    AS total,
    count(DISTINCT country_code)::INT                AS nations,
    count(*) FILTER (WHERE NOT is_anonymous)::INT    AS authenticated,
    count(*) FILTER (WHERE is_anonymous)::INT        AS anonymous
  FROM public.adoration_sessions
  WHERE status = 'ACTIVE'
    AND started_at > NOW() - INTERVAL '15 minutes';

-- Vista: adoratori per paese
CREATE OR REPLACE VIEW public.adorers_by_country AS
  SELECT
    country_code,
    count(*)::INT AS count
  FROM public.adoration_sessions
  WHERE status = 'ACTIVE'
    AND started_at > NOW() - INTERVAL '15 minutes'
    AND country_code IS NOT NULL
  GROUP BY country_code
  ORDER BY count DESC;

-- Funzione: inizia sessione adorazione
CREATE OR REPLACE FUNCTION public.start_adoration(
  p_user_id     UUID DEFAULT NULL,
  p_chapel_id   UUID DEFAULT NULL,
  p_country     CHAR(2) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_session_id UUID;
BEGIN
  -- Termina eventuali sessioni attive dello stesso utente
  IF p_user_id IS NOT NULL THEN
    UPDATE public.adoration_sessions
    SET status = 'ENDED', ended_at = NOW()
    WHERE user_id = p_user_id AND status = 'ACTIVE';
  END IF;

  INSERT INTO public.adoration_sessions (user_id, chapel_id, country_code, is_anonymous)
  VALUES (p_user_id, p_chapel_id, p_country, p_user_id IS NULL)
  RETURNING id INTO v_session_id;

  RETURN v_session_id;
END;
$$ LANGUAGE plpgsql;

-- Funzione: termina sessione
CREATE OR REPLACE FUNCTION public.end_adoration(p_session_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.adoration_sessions
  SET status = 'ENDED', ended_at = NOW()
  WHERE id = p_session_id AND status = 'ACTIVE';
END;
$$ LANGUAGE plpgsql;

-- Cron: marca ABANDONED sessioni > 2 ore (via pg_cron o Supabase scheduled functions)
CREATE OR REPLACE FUNCTION public.cleanup_old_sessions()
RETURNS INT AS $$
DECLARE
  v_count INT;
BEGIN
  UPDATE public.adoration_sessions
  SET status = 'ABANDONED', ended_at = NOW()
  WHERE status = 'ACTIVE'
    AND started_at < NOW() - INTERVAL '2 hours';
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ── TURNI ADORAZIONE (booking) ───────────────────────────────

CREATE TABLE IF NOT EXISTS public.adoration_shifts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapel_id    UUID NOT NULL REFERENCES public.chapels(id) ON DELETE CASCADE,
  day_of_week  INT CHECK (day_of_week BETWEEN 0 AND 6),
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  is_recurring BOOLEAN NOT NULL DEFAULT TRUE,
  booker_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  booked_at    TIMESTAMPTZ,
  notes        TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shifts_chapel    ON public.adoration_shifts(chapel_id);
CREATE INDEX IF NOT EXISTS idx_shifts_booker    ON public.adoration_shifts(booker_id);
CREATE INDEX IF NOT EXISTS idx_shifts_available ON public.adoration_shifts(is_available);

-- Funzione: prenota turno
CREATE OR REPLACE FUNCTION public.book_shift(
  p_shift_id UUID,
  p_user_id  UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_available BOOLEAN;
BEGIN
  SELECT is_available INTO v_available
  FROM public.adoration_shifts
  WHERE id = p_shift_id FOR UPDATE;

  IF NOT v_available THEN RETURN FALSE; END IF;

  UPDATE public.adoration_shifts
  SET booker_id = p_user_id, booked_at = NOW(), is_available = FALSE
  WHERE id = p_shift_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Statistiche globali (aggiornate da trigger)
CREATE TABLE IF NOT EXISTS public.global_stats (
  id              INT PRIMARY KEY DEFAULT 1,
  chapels_count   INT NOT NULL DEFAULT 0,
  parishes_count  INT NOT NULL DEFAULT 0,
  adorers_all_time BIGINT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);
INSERT INTO public.global_stats DEFAULT VALUES ON CONFLICT DO NOTHING;
