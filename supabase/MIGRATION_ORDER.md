# Adorazione Viva — Ordine Esatto delle Migrazioni

**10 file totali** · Eseguire nell'ordine numerico rigoroso

---

## Ordine di esecuzione

| # | File | Contenuto | Dipendenze |
|---|------|-----------|------------|
| 0 | `000_prerequisites.sql` | Estensioni PostgreSQL (uuid-ossp, pgcrypto, pg_trgm) | nessuna |
| 1 | `001_enums.sql` | 14 enum types (idempotenti con DO block) | 000 |
| 2 | `002_auth_profiles.sql` | Tabella profiles + trigger auto-create su signup | 001 + auth.users Supabase |
| 3 | `003_geography.sql` | countries, cities, dioceses | 001 |
| 4 | `004_parishes.sql` | parishes, chapels, schedules + funzione geo-search | 001, 002, 003 |
| 5 | `005_adoration.sql` | adoration_sessions, adoration_shifts, global_stats + funzioni RPC | 001, 002, 004 |
| 6 | `006_streaming.sql` | live_streams, stream_schedules | 001, 002, 004 |
| 7 | `007_miracles.sql` | eucharistic_miracles + immagini/video/docs/biblio/pellegrinaggi | 001, 002, 003 |
| 8 | `008_community.sql` | prayers, events, testimonials, favorites, notifications, journals | 001, 002, 004, 005 |
| 9 | `009_rls_policies.sql` | RLS su tutte le tabelle + funzioni helper auth | tutte le precedenti |

**Dopo tutte le migrazioni:** eseguire `seed.sql`

---

## Come applicare su Supabase

1. Vai su **SQL Editor** nel tuo progetto Supabase
2. Per ogni file, nell'ordine: copia il contenuto → incolla → **Run**
3. Verifica che non ci siano errori rossi prima di procedere al file successivo
4. Errori "already exists": non bloccanti se stai rieseguendo (migrazioni idempotenti)
5. Dopo il file 009: esegui `seed.sql`

---

## Note tecniche

- Tutti i file usano `IF NOT EXISTS` o `CREATE OR REPLACE` dove possibile
- Gli ENUM (001) usano `DO $$ BEGIN ... END $$` per idempotenza PostgreSQL
- I trigger usano `DROP TRIGGER IF EXISTS` prima della creazione
- Le policy RLS usano nomi unici (string literal) — rilancio sicuro
- `seed.sql` usa `ON CONFLICT DO NOTHING` — sicuro rieseguire

---

## Verifica post-migrazione

Esegui queste query in SQL Editor per confermare:

```sql
-- Conta tabelle create
SELECT count(*) FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
-- Atteso: ≥ 25 tabelle

-- Verifica RLS attivo
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' ORDER BY tablename;
-- Tutte le tabelle devono avere rowsecurity = true

-- Verifica funzioni RPC
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public' ORDER BY routine_name;
-- Deve includere: start_adoration, end_adoration, book_shift, chapels_within_radius
```
