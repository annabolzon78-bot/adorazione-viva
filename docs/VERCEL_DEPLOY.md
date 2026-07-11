# Guida Deploy Vercel — Passo per passo

> Pensata per chi non ha esperienza tecnica.
> Tempo stimato: 15–20 minuti.
> Prerequisito: aver completato la guida Supabase.

---

## 1. Crea account Vercel

1. Vai su **https://vercel.com**
2. Clicca **Sign Up**
3. Accedi con il tuo **account GitHub** (quello dove hai il repository adorazione-viva)
4. Autorizza Vercel ad accedere ai tuoi repository

---

## 2. Importa il progetto

1. Nella dashboard Vercel: clicca **Add New → Project**
2. Trova il repository **adorazione-viva** e clicca **Import**
3. Vercel riconosce automaticamente la configurazione grazie a `vercel.json`

---

## 3. Configura le variabili d'ambiente

> ⚠️ Questo è il passaggio più importante.

Prima di cliccare Deploy, scorri giù fino a **Environment Variables**.

Aggiungi queste due variabili:

| Nome | Valore |
|------|--------|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` (dal tuo progetto Supabase) |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` (la chiave anon da Supabase → Settings → API) |

Come aggiungere:
1. Campo **Name**: inserisci il nome (es. `VITE_SUPABASE_URL`)
2. Campo **Value**: incolla il valore
3. Clicca **Add**
4. Ripeti per la seconda variabile

---

## 4. Deploy

1. Clicca **Deploy**
2. Aspetta 1–3 minuti
3. Quando vedi la schermata verde con il link: il sito è online! 🎉

---

## 5. Configura il dominio (opzionale)

Se hai un dominio personalizzato (es. adorazioneviva.com):

1. Vercel Dashboard → il tuo progetto → **Settings → Domains**
2. Inserisci il dominio e segui le istruzioni per i DNS
3. Vercel gestisce automaticamente il certificato SSL (https)

---

## 6. Aggiorna Supabase con il tuo URL

Ora che hai l'URL del sito (es. `https://adorazione-viva.vercel.app`):

1. Torna su Supabase → **Authentication → Settings**
2. **Site URL**: inserisci il tuo URL Vercel
3. **Redirect URLs**: aggiungi `https://adorazione-viva.vercel.app/auth/callback`
4. Clicca **Save**

---

## 7. Deploy automatico futuri

Ogni volta che fai `git push` sul branch `main`:
- Vercel rileva il cambiamento
- Ri-compila automaticamente
- Pubblica la nuova versione in ~2 minuti

Non devi fare nulla manualmente.

---

## Variabili d'ambiente — Riepilogo completo

| Variabile | Dove si trova | Obbligatoria |
|-----------|---------------|--------------|
| `VITE_SUPABASE_URL` | Supabase → Settings → API | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API | ✅ |

---

## Problemi frequenti

**Pagina bianca dopo il deploy**
→ Controlla le variabili d'ambiente. Devono iniziare con `VITE_`.

**"Network Error" o "Failed to fetch"**
→ La URL Supabase non è corretta. Verifica `VITE_SUPABASE_URL`.

**La pagina carica ma non riesci ad accedere**
→ Verifica che Supabase abbia il tuo URL nella lista dei Redirect URLs.

**Vecchia versione ancora visibile**
→ Svuota la cache del browser (Ctrl+Shift+R o Cmd+Shift+R).
