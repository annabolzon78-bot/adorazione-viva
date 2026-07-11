# Guida Supabase — Passo per passo

> Pensata per chi non ha esperienza tecnica.
> Tempo stimato: 30–45 minuti.

---

## 1. Crea il progetto Supabase

1. Vai su **https://supabase.com**
2. Clicca **Start your project** e accedi con Google o GitHub
3. Clicca **New Project**
4. Scegli **Organization**: il tuo nome
5. Compila:
   - **Name**: `adorazione-viva`
   - **Database Password**: scegli una password forte e salvala in un posto sicuro
   - **Region**: Europe West (Ireland) — più vicino agli utenti europei
6. Clicca **Create new project**
7. Aspetta 2–3 minuti che finisca di configurarsi

---

## 2. Prendi le credenziali

1. Nel menu laterale: **Settings → API**
2. Copia questi due valori e incollali nel file `.env`:
   ```
   VITE_SUPABASE_URL    = URL del progetto (es. https://abcdefgh.supabase.co)
   VITE_SUPABASE_ANON_KEY = anon / public key (inizia con eyJ...)
   ```
3. ⚠️ Non copiare mai la **service_role key** nel frontend

---

## 3. Applica le migrazioni (crea il database)

Nel menu laterale: **SQL Editor**

Esegui i file nella cartella `supabase/migrations/` **nell'ordine numerico**:

1. Copia il contenuto di `001_enums.sql` → incolla nell'SQL Editor → clicca **Run**
2. Fai lo stesso con `002_auth_profiles.sql`
3. Continua fino a `009_rls_policies.sql`

Se vedi errori:
- "already exists" → non è un problema, il file è già applicato
- "undefined function" → controlla di aver applicato i file precedenti nell'ordine

---

## 4. Carica i dati demo (opzionale ma consigliato)

1. SQL Editor → incolla il contenuto di `supabase/seed.sql`
2. Clicca **Run**
3. Vedrai alcune righe di conferma. I dati demo hanno `[DEMO]` nel nome

---

## 5. Configura l'autenticazione email

1. **Authentication → Settings**
2. Sezione **Email**:
   - ✅ Abilita **Confirm email** (gli utenti devono verificare l'email)
3. Sezione **URL Configuration**:
   - **Site URL**: `https://adorazioneviva.vercel.app` (il tuo URL Vercel)
   - **Redirect URLs**: aggiungi `https://adorazioneviva.vercel.app/auth/callback`
4. (Opzionale) Sezione **Email Templates**: personalizza i testi

---

## 6. Crea i bucket Storage

1. **Storage** nel menu laterale → **New bucket**
2. Crea questi bucket nell'ordine:

| Nome        | Tipo   | Note |
|-------------|--------|------|
| `avatars`   | Public | Foto profilo utenti |
| `parishes`  | Public | Immagini parrocchie |
| `miracles`  | Public | Immagini miracoli |
| `thumbnails`| Public | Miniature streaming |
| `documents` | Private | Documenti riservati |

Per ogni bucket:
- Clicca **New bucket** → inserisci il nome → scegli Public o Private → **Create bucket**

---

## 7. Configura le policy Storage

Per il bucket `avatars`:
1. Seleziona il bucket → **Policies** → **New policy**
2. Template: **Give users access to only their own top level folder**

Per i bucket pubblici (parishes, miracles, thumbnails):
1. **New policy** → Template: **Allow public read access** → **Review** → **Save**

Per il bucket `documents`:
1. **New policy** → Template: **Give users access to only their own top level folder**

---

## 8. Verifica che tutto funzioni

1. Vai su **Table Editor**: dovresti vedere le tabelle (profiles, parishes, chapels, ecc.)
2. Vai su **Authentication → Users**: vuoto per ora, si popola con le registrazioni
3. Vai su **Storage**: dovresti vedere i bucket creati

---

## 9. Prendi nota dei valori per Vercel

Tieni pronti:
```
Project URL:   https://xxxx.supabase.co
Anon Key:      eyJ...
```

Questi vanno inseriti nelle variabili d'ambiente di Vercel (vedi `VERCEL_DEPLOY.md`).

---

## Problemi frequenti

**"permission denied for table profiles"**
→ Le policy RLS non sono state applicate. Riesegui `009_rls_policies.sql`

**"invalid JWT"**
→ Hai inserito la URL sbagliata o la key errata in `.env`

**Le email non arrivano**
→ Controlla che l'email non sia nella cartella SPAM. Su Supabase free tier le email passano per Supabase.io

**"new row violates row-level security policy"**
→ Stai cercando di inserire dati senza essere autenticato. Normal durante i test.
