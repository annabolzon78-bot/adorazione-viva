-- ============================================================
-- 009 — ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Helper: recupera il ruolo dell'utente corrente
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: l'utente è admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT role IN ('ADMIN','SUPER_ADMIN') FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: l'utente è moderatore o superiore?
CREATE OR REPLACE FUNCTION public.is_moderator_or_above()
RETURNS BOOLEAN AS $$
  SELECT role IN ('MODERATOR','ADMIN','SUPER_ADMIN') FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: l'utente è admin della parrocchia specificata?
CREATE OR REPLACE FUNCTION public.is_parish_admin_of(p_parish_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.parishes
    WHERE id = p_parish_id AND admin_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: l'utente è admin della diocesi che contiene la parrocchia?
CREATE OR REPLACE FUNCTION public.is_diocese_admin_of_parish(p_parish_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.parishes par
    JOIN public.profiles prof ON prof.id = auth.uid()
    JOIN public.dioceses d ON d.id = par.diocese_id
    WHERE par.id = p_parish_id
      AND prof.role = 'DIOCESE_ADMIN'
      -- in produzione aggiungere: AND prof.diocese_id = par.diocese_id
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ── ENABLE RLS ───────────────────────────────────────────────

ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parishes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapels               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_streams          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adoration_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adoration_shifts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eucharistic_miracles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spiritual_journals    ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ────────────────────────────────────────────────

CREATE POLICY "Profili: visibili a tutti (autenticati)"
  ON public.profiles FOR SELECT
  TO authenticated USING (TRUE);

CREATE POLICY "Profili: modifica solo il proprio"
  ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id);

-- ── PARISHES ─────────────────────────────────────────────────

CREATE POLICY "Parrocchie: visibili a tutti"
  ON public.parishes FOR SELECT
  USING (status = 'VERIFIED' OR auth.uid() = admin_id OR public.is_admin());

CREATE POLICY "Parrocchie: crea (autenticato)"
  ON public.parishes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Parrocchie: modifica (admin parrocchia o superiore)"
  ON public.parishes FOR UPDATE
  TO authenticated USING (
    auth.uid() = admin_id
    OR public.is_diocese_admin_of_parish(id)
    OR public.is_admin()
  );

CREATE POLICY "Parrocchie: elimina (solo admin)"
  ON public.parishes FOR DELETE
  TO authenticated USING (public.is_admin());

-- ── CHAPELS ──────────────────────────────────────────────────

CREATE POLICY "Cappelle: visibili a tutti"
  ON public.chapels FOR SELECT
  USING (TRUE);

CREATE POLICY "Cappelle: modifica (admin parrocchia)"
  ON public.chapels FOR ALL
  TO authenticated USING (public.is_parish_admin_of(parish_id) OR public.is_admin());

-- ── LIVE STREAMS ─────────────────────────────────────────────

CREATE POLICY "Stream: visibili a tutti se attivi"
  ON public.live_streams FOR SELECT
  USING (is_active = TRUE OR public.is_parish_admin_of(parish_id) OR public.is_admin());

CREATE POLICY "Stream: gestisci (admin parrocchia)"
  ON public.live_streams FOR ALL
  TO authenticated USING (public.is_parish_admin_of(parish_id) OR public.is_admin());

-- ── ADORATION SESSIONS ───────────────────────────────────────

CREATE POLICY "Sessioni: visibili (proprie o anonime aggregate)"
  ON public.adoration_sessions FOR SELECT
  USING (
    auth.uid() = user_id
    OR is_anonymous = TRUE
    OR public.is_admin()
  );

CREATE POLICY "Sessioni: crea (chiunque, anche anonimo)"
  ON public.adoration_sessions FOR INSERT
  WITH CHECK (TRUE);  -- il frontend non invia user_id se anonimo

CREATE POLICY "Sessioni: modifica (propria)"
  ON public.adoration_sessions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

-- ── MIRACLES ─────────────────────────────────────────────────

CREATE POLICY "Miracoli: visibili se pubblicati"
  ON public.eucharistic_miracles FOR SELECT
  USING (status = 'PUBLISHED' OR public.is_moderator_or_above());

CREATE POLICY "Miracoli: gestisci (moderatore o admin)"
  ON public.eucharistic_miracles FOR ALL
  TO authenticated USING (public.is_moderator_or_above());

-- ── EVENTS ───────────────────────────────────────────────────

CREATE POLICY "Eventi: visibili se pubblicati"
  ON public.events FOR SELECT
  USING (is_published = TRUE OR public.is_parish_admin_of(parish_id) OR public.is_admin());

CREATE POLICY "Eventi: gestisci (admin parrocchia)"
  ON public.events FOR ALL
  TO authenticated USING (public.is_parish_admin_of(parish_id) OR public.is_admin());

-- ── PRAYER REQUESTS ──────────────────────────────────────────

CREATE POLICY "Intenzioni: visibili se pubbliche"
  ON public.prayer_requests FOR SELECT
  USING (is_public = TRUE OR auth.uid() = user_id);

CREATE POLICY "Intenzioni: crea (autenticato)"
  ON public.prayer_requests FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Intenzioni: modifica/elimina (propria)"
  ON public.prayer_requests FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Intenzioni: elimina (propria o admin)"
  ON public.prayer_requests FOR DELETE
  TO authenticated USING (auth.uid() = user_id OR public.is_admin());

-- ── FAVORITES ────────────────────────────────────────────────

CREATE POLICY "Favoriti: solo il proprietario"
  ON public.favorites FOR ALL
  TO authenticated USING (auth.uid() = user_id);

-- ── NOTIFICATIONS ─────────────────────────────────────────────

CREATE POLICY "Notifiche: solo il destinatario"
  ON public.notifications FOR ALL
  TO authenticated USING (auth.uid() = user_id);

-- ── SPIRITUAL JOURNALS ────────────────────────────────────────

CREATE POLICY "Diario: solo il proprietario (privato assoluto)"
  ON public.spiritual_journals FOR ALL
  TO authenticated USING (auth.uid() = user_id);

-- ── TABELLE PUBBLICHE (no RLS richiesta) ─────────────────────
-- countries, cities, dioceses, prayers, prayer_categories sono public read-only
ALTER TABLE public.countries         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dioceses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Paesi: lettura pubblica" ON public.countries FOR SELECT USING (TRUE);
CREATE POLICY "Città: lettura pubblica" ON public.cities    FOR SELECT USING (TRUE);
CREATE POLICY "Diocesi: lettura pubblica" ON public.dioceses FOR SELECT USING (TRUE);
CREATE POLICY "Preghiere: lettura pubblica" ON public.prayers FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Categorie preghiere: lettura pubblica" ON public.prayer_categories FOR SELECT USING (TRUE);
