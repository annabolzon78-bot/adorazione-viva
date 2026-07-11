# ❤️‍🔥 Adorazione Viva

**Piattaforma mondiale per l'Adorazione Eucaristica**

React + TypeScript + Vite · Supabase · Vercel · 11 lingue

---

## Stato del progetto

| Area | Stato |
|------|-------|
| Frontend React | ✅ Operativo |
| Auth Supabase | ✅ Pronto (richiede credenziali Supabase) |
| Database SQL | ✅ Migrazioni complete (9 file) |
| RLS Policy | ✅ Complete |
| i18n (11 lingue) | ✅ Operativo |
| Dashboard 3 livelli | ✅ UI completa · [DEMO] senza Supabase |
| Contatore adoratori | ✅ Realtime con Supabase · [DEMO] senza |
| Streaming | ✅ YouTube/Vimeo/HLS/Facebook |
| Miracoli | ✅ Enciclopedia · dati demo marcati |
| Mappa cappelle | ✅ Leaflet + cluster · dati demo marcati |
| Storage file | ✅ Codice pronto · bucket da creare |
| Test frontend | ✅ 8 test (Vitest) |
| Test backend | ✅ 10 test (Jest) |
| Docker | ✅ dev + prod |
| CI/CD | ⏳ Richiede token GitHub con scope `workflow` |

---

## Setup rapido (sviluppo locale)

```bash
# 1. Clona
git clone https://github.com/annabolzon78-bot/adorazione-viva.git
cd adorazione-viva

# 2. Frontend
cd frontend
npm install
cp ../.env.example .env.local
# Compila le variabili Supabase in .env.local
npm run dev        # http://localhost:5173

# 3. Backend (opzionale in dev)
cd ../backend
npm install
npm run dev        # http://localhost:4000

# 4. Database (Docker)
cd ..
docker compose up postgres -d
cd backend && npm run db:migrate:dev
```

---

## Configurazione Supabase + Vercel

Segui le guide passo per passo:
- [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) — 30–45 minuti
- [`docs/VERCEL_DEPLOY.md`](docs/VERCEL_DEPLOY.md) — 15–20 minuti

---

## Struttura progetto

```
adorazione-viva/
├── frontend/            React + TypeScript + Vite
│   ├── src/
│   │   ├── components/  UI components
│   │   ├── hooks/       Custom hooks (useAdoration con Realtime)
│   │   ├── i18n/        11 lingue (it/en/es/fr/de/pt/pl/zh/ja/ko/ar)
│   │   ├── lib/         supabase.ts (client)
│   │   ├── pages/       7 pagine + Dashboard + Login + Register
│   │   ├── services/    auth.ts, storage.ts
│   │   ├── styles/      CSS (global, map, streaming, miracles, dashboard, auth)
│   │   └── test/        Vitest tests
│   └── package.json
├── backend/             Node.js + Express (microservizio residuo)
│   ├── src/
│   │   ├── controllers/ 11 controller
│   │   ├── routes/      12 route sets
│   │   ├── services/    11 service
│   │   ├── validators/  9 Zod schema
│   │   └── test/        Jest tests
│   └── package.json
├── supabase/
│   ├── migrations/      001–009 SQL completi
│   └── seed.sql         Dati demo [DEMO]
├── database/
│   └── prisma/          Schema Prisma (legacy, per riferimento)
├── docs/
│   ├── SUPABASE_MIGRATION_PLAN.md
│   ├── SUPABASE_SETUP.md    ← Guida per non tecnici
│   └── VERCEL_DEPLOY.md     ← Guida per non tecnici
├── docker-compose.yml   Sviluppo locale
├── docker-compose.prod.yml  Produzione
└── vercel.json          Configurazione deploy
```

---

## Variabili d'ambiente

Copia `.env.example` in `.env` e compila:

| Variabile | Dove si trova | Usata da |
|-----------|---------------|----------|
| `VITE_SUPABASE_URL` | Supabase Settings → API | Frontend |
| `VITE_SUPABASE_ANON_KEY` | Supabase Settings → API | Frontend |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings → API | Backend (solo) |
| `DATABASE_URL` | Supabase Settings → Database | Backend |

---

## Test

```bash
# Frontend (Vitest)
cd frontend && npm test

# Backend (Jest)
cd backend && npm test
```

---

## Lingue supportate

🇮🇹 Italiano · 🇬🇧 English · 🇪🇸 Español · 🇫🇷 Français · 🇩🇪 Deutsch
🇵🇹 Português · 🇵🇱 Polski · 🇨🇳 中文 · 🇯🇵 日本語 · 🇰🇷 한국어 · 🇸🇦 العربية (RTL)

---

## Licenza

Tutti i diritti riservati · Adorazione Viva © 2026
