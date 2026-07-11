# ❤️‍🔥 Adorazione Viva

**Piattaforma mondiale per l'Adorazione Eucaristica**

React 18 + TypeScript + Vite · Supabase Auth + Database · Vercel · 11 lingue

---

## Stato del progetto — Pre-Deploy Supabase/Vercel

| Area | Stato | Note |
|------|-------|------|
| Frontend React | ✅ Build pulita | 0 errori TS |
| Auth Supabase | ✅ Pronto | Unica fonte auth, no JWT paralleli |
| Database SQL | ✅ 10 migrazioni (000–009) | Con RLS completa |
| Dashboard 3 livelli | ✅ UI + adapter DEMO/prod | Dati reali dopo Supabase |
| Geolocalizzazione | ✅ Integrata nella mappa | Raggio 5/20/50km |
| i18n 11 lingue | ✅ Incluso RTL arabo | Geo messages tradotti |
| Streaming | ✅ YouTube/Vimeo/HLS/Facebook | HLS lazy load |
| Test frontend | ✅ 21 test (6 file, Vitest) | 0 warning |
| Test backend | ✅ 10 test (2 file, Jest) | 0 warning |
| Docker dev/prod | ✅ Funzionante | |
| Docs utente | ✅ Guide passo-per-passo | Per non tecnici |

**Non richiede intervento:** tutto il codice è pronto.
**Richiede il tuo intervento:** creare Supabase e Vercel (guide incluse).

---

## Autenticazione

**Unica fonte: Supabase Auth** — nessun JWT Express parallelo.

```
Utente → Login.tsx → supabase.auth.signInWithPassword()
                   → Sessione in localStorage (chiave: av_session)
                   → ProtectedRoute verifica con supabase.auth.getSession()
                   → Dashboard carica profilo da supabase.from('profiles')
```

Vedi [`docs/AUTH_ARCHITECTURE.md`](docs/AUTH_ARCHITECTURE.md) per i dettagli.

---

## Setup rapido (sviluppo locale senza Supabase)

```bash
git clone https://github.com/annabolzon78-bot/adorazione-viva.git
cd adorazione-viva/frontend
npm install
npm run dev   # http://localhost:5173
```

L'app si avvia in **modalità DEMO** (banner arancione visibile).
I dati sono simulati finché non si configura Supabase.

---

## Deploy su Supabase + Vercel

| Guida | Tempo | Per chi |
|-------|-------|---------|
| [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) | 30–45 min | Prima |
| [`docs/VERCEL_DEPLOY.md`](docs/VERCEL_DEPLOY.md) | 15–20 min | Dopo Supabase |
| [`docs/PRE_DEPLOY_CHECKLIST.md`](docs/PRE_DEPLOY_CHECKLIST.md) | 10 min | Prima di ogni deploy |

---

## Struttura

```
adorazione-viva/
├── frontend/           React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── lib/        supabase.ts (client, unica fonte auth)
│   │   ├── services/   auth.ts (Supabase Auth), storage.ts
│   │   ├── hooks/      useAdoration (Realtime), useDashboard (DEMO/prod)
│   │   ├── pages/      10 pagine + Dashboard + Login + Register
│   │   ├── i18n/       11 lingue (RTL arabo incluso)
│   │   └── test/       6 file test, 21 test (Vitest)
├── backend/            Express (microservizio residuo — RTSP, webhook)
│   └── src/test/       2 file test, 10 test (Jest)
├── supabase/
│   ├── migrations/     000–009 (10 file SQL, idempotenti)
│   ├── seed.sql        Dati demo [DEMO]
│   └── MIGRATION_ORDER.md
├── docs/
│   ├── AUTH_ARCHITECTURE.md
│   ├── SUPABASE_MIGRATION_PLAN.md
│   ├── SUPABASE_SETUP.md      ← Guida passo-per-passo
│   ├── VERCEL_DEPLOY.md       ← Guida passo-per-passo
│   └── PRE_DEPLOY_CHECKLIST.md
├── vercel.json         Config deploy (SPA routing, security headers)
└── .env.example        Template variabili (no valori reali)
```

---

## Test

```bash
cd frontend && npm test   # 21 test
cd backend  && npm test   # 10 test
```

---

## Lingue

🇮🇹 🇬🇧 🇪🇸 🇫🇷 🇩🇪 🇵🇹 🇵🇱 🇨🇳 🇯🇵 🇰🇷 🇸🇦
