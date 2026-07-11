# Adorazione Viva — Piano Migrazione Supabase

## Panoramica decisionale

Il progetto parte con un backend Express + Prisma custom.
Supabase lo sostituisce parzialmente, mantenendo Express solo dove Supabase non basta.

---

## Cosa RESTA del backend Express

| Modulo | Motivo |
|--------|--------|
| **Conversione RTSP→HLS** | Richiede un processo server-side persistente |
| **Controllo stato stream live** | Poll periodico verso YouTube/Vimeo API |
| **Cron job contatore adoratori** | Aggregazione sessioni in background |
| **Webhook da piattaforme terze** | YouTube Data API, invio email custom |
| **Rate limiting avanzato** | Regole dinamiche per ruolo/IP |

Il backend Express diventa un **microservizio leggero** con 3-4 endpoint, non più un'API completa.

---

## Cosa viene SOSTITUITO da Supabase

| Funzione Express attuale | Sostituto Supabase |
|--------------------------|-------------------|
| Auth (JWT, register, login) | **Supabase Auth** |
| PostgreSQL + Prisma ORM | **Supabase Database** (PostgreSQL nativo) |
| Upload immagini/documenti | **Supabase Storage** |
| Email verifica / reset | **Supabase Auth email** |
| Real-time (contatore adoratori) | **Supabase Realtime** |
| RLS / permessi per risorsa | **Row Level Security** |
| Notifiche | **Supabase Realtime subscriptions** |
| Ricerca full-text | **PostgreSQL pg_trgm** via Supabase |

---

## Cosa viene ELIMINATO

- `backend/src/middleware/auth.ts` — sostituito da Supabase JWT
- `backend/src/utils/jwt.ts` — gestito da Supabase
- `backend/src/utils/password.ts` — gestito da Supabase Auth
- `backend/src/services/auth.service.ts` — sostituito da `supabase.auth.*`
- `backend/src/services/tokenBlacklist.ts` — Supabase gestisce le sessioni
- Tutti i controller/route Auth (register, login, logout, refresh)
- Prisma ORM (le query diventano chiamate Supabase client)

---

## Schema dei Ruoli

```sql
-- Ruoli applicativi (custom claim in JWT Supabase)
CREATE TYPE user_role AS ENUM (
  'USER',           -- Fedele: può leggere, adorare, salvare
  'PARISH_ADMIN',   -- Admin parrocchia: gestisce la propria parrocchia
  'DIOCESE_ADMIN',  -- Admin diocesi: verifica parrocchie della diocesi
  'MODERATOR',      -- Moderatore: approva contenuti (miracoli, testimonianze)
  'ADMIN',          -- Admin globale: tutto tranne sistema
  'SUPER_ADMIN'     -- Super admin: accesso totale
);
```

I ruoli sono salvati nella tabella `profiles.role` e propagati come custom claim JWT via trigger.

---

## Schema RLS (Row Level Security)

### Principio generale
```
SELECT = pubblico (o autenticato per dati privati)
INSERT = solo utente autenticato con ruolo appropriato
UPDATE = solo proprietario o admin
DELETE = solo admin o SUPER_ADMIN
```

### Tabelle e policy

**`profiles`**
```sql
SELECT: chiunque può vedere profili pubblici
UPDATE: solo auth.uid() = id (il proprio profilo)
```

**`parishes`**
```sql
SELECT: tutti
INSERT: PARISH_ADMIN (la propria parrocchia)
UPDATE: PARISH_ADMIN sulla propria, DIOCESE_ADMIN sulla sua diocesi, ADMIN tutto
DELETE: ADMIN, SUPER_ADMIN
```

**`chapels`**
```sql
SELECT: tutti
INSERT/UPDATE: PARISH_ADMIN della parrocchia proprietaria
DELETE: ADMIN
```

**`live_streams`**
```sql
SELECT: tutti (solo attivi) | PARISH_ADMIN vede i propri
INSERT/UPDATE: PARISH_ADMIN della parrocchia
DELETE: PARISH_ADMIN o ADMIN
```

**`adoration_sessions`**
```sql
SELECT: solo auth.uid() = user_id | ADMIN vede tutto
INSERT: utente autenticato
UPDATE: solo il proprio
DELETE: solo il proprio o ADMIN
```

**`eucharistic_miracles`**
```sql
SELECT: tutti (solo published=true) | MODERATOR vede tutte
INSERT: MODERATOR, ADMIN
UPDATE: MODERATOR (review), ADMIN
DELETE: ADMIN, SUPER_ADMIN
```

**`prayer_requests`**
```sql
SELECT: solo is_public=true | auth.uid() = user_id
INSERT: utente autenticato
UPDATE: solo il proprio
DELETE: solo il proprio o ADMIN
```

**`spiritual_journals`**
```sql
SELECT: solo auth.uid() = user_id (privato assoluto)
INSERT/UPDATE/DELETE: solo auth.uid() = user_id
```

---

## Struttura Storage

```
Bucket: avatars         (public)
  └── {user_id}/avatar.{ext}
  Limiti: 2MB, jpg/png/webp

Bucket: parishes        (public)
  └── {parish_id}/
      ├── logo.{ext}
      ├── cover.{ext}
      └── gallery/{uuid}.{ext}
  Limiti: 5MB/immagine, jpg/png/webp

Bucket: miracles        (public)
  └── {miracle_slug}/
      ├── images/{uuid}.{ext}
      ├── videos/{uuid}.mp4
      └── documents/{uuid}.pdf
  Limiti: immagini 10MB, pdf 20MB

Bucket: documents       (private, solo admin)
  └── ecclesiastical/{uuid}.pdf
  Limiti: 50MB, solo pdf

Bucket: thumbnails      (public)
  └── streams/{stream_id}/thumb.{ext}
  Limiti: 1MB, jpg/png/webp
```

---

## Ordine di Migrazione

### Step 1 — Supabase Project
1. Creare progetto su supabase.com
2. Salvare URL e anon key in `.env`
3. Abilitare email auth

### Step 2 — Database
```bash
# Applica le migration SQL nell'ordine:
supabase/migrations/001_enums.sql
supabase/migrations/002_auth_profiles.sql
supabase/migrations/003_geography.sql
supabase/migrations/004_parishes.sql
supabase/migrations/005_chapels.sql
supabase/migrations/006_adoration.sql
supabase/migrations/007_streaming.sql
supabase/migrations/008_miracles.sql
supabase/migrations/009_prayers.sql
supabase/migrations/010_community.sql
supabase/migrations/011_rls_policies.sql
supabase/migrations/012_functions.sql
supabase/migrations/013_triggers.sql
supabase/seed.sql
```

### Step 3 — Storage
1. Creare i bucket nell'ordine: avatars, parishes, miracles, documents, thumbnails
2. Impostare policy bucket come da docs

### Step 4 — Auth
1. Configurare email templates in Supabase Dashboard
2. Abilitare magic link (opzionale)
3. Configurare redirect URLs

### Step 5 — Frontend
1. Inserire VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
2. Deploy su Vercel

### Step 6 — Backend microservizio (opzionale)
1. Deploy Express ridotto su Railway/Render
2. Inserire SUPABASE_SERVICE_ROLE_KEY solo nel backend

---

## Rischi

| Rischio | Probabilità | Mitigazione |
|---------|-------------|-------------|
| RLS troppo permissiva | Media | Test con ruoli diversi prima del go-live |
| Rate limit Supabase free tier | Alta | 500MB DB, 1GB storage, 50k MAU — sufficiente per MVP |
| Cold start Vercel | Bassa | App SPA, no serverless functions critiche |
| Email spam filter | Media | Configurare dominio custom SPF/DKIM |
| Realtime quota | Media | Limitare subscriptions attive per utente |

---

## Rollback

Se Supabase non funziona dopo il deploy:

1. **Database**: esportare dump con `pg_dump` (Supabase lo permette)
2. **Auth**: gli utenti sono in auth.users — esportabile
3. **Storage**: i file sono su S3-compatible — scaricabili via API
4. **Fallback**: riattivare il backend Express su Railway puntando allo stesso PostgreSQL

Il rollback completo richiede ~2 ore.

---

## Note architetturali finali

Il frontend non importa MAI la `service_role_key`.
Tutte le operazioni privilegiate passano per:
- RLS policies (sicuro lato DB)
- Edge Functions Supabase (se servono operazioni server-side)
- Il microservizio Express residuo (per streaming e cron)
