# Pre-Deploy Checklist — Adorazione Viva

Esegui questa checklist prima di ogni deploy in produzione.

---

## ✅ Verifica locale

```bash
cd frontend && npm install && npm run build && npm run lint && npm test
cd ../backend && npm install && npm run build && npm test
```

Tutti devono passare senza errori.

---

## ✅ Sicurezza

- [ ] Nessuna chiave API, token o password è committata in Git
- [ ] `.env` non è in `.gitignore`? → Errore critico
- [ ] `SUPABASE_SERVICE_ROLE_KEY` NON è nel frontend
- [ ] `dangerouslySetInnerHTML` non è presente nel frontend
- [ ] Rate limiting attivo nel backend Express
- [ ] CORS configurato per il dominio di produzione

```bash
# Verifica chiavi accidentali
git log --all -p | grep -E "eyJ[A-Za-z0-9]{40}|ghp_|sk-" | head -5
```

---

## ✅ Supabase

- [ ] Progetto Supabase creato
- [ ] Migrazioni 000→009 applicate in ordine
- [ ] `supabase/seed.sql` eseguito (opzionale, solo per demo iniziale)
- [ ] Bucket Storage creati: avatars, parishes, miracles, documents, thumbnails
- [ ] Auth email configurata con URL corretto
- [ ] RLS verificata: ogni tabella ha `rowsecurity = TRUE`

```sql
-- Verifica RLS
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' ORDER BY tablename;
```

---

## ✅ Variabili d'ambiente Vercel

- [ ] `VITE_SUPABASE_URL` = `https://xxxx.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = chiave anon (non service role)
- [ ] Nessuna variabile con valori di sviluppo/test

---

## ✅ Funzionalità da verificare post-deploy

- [ ] Home carica senza banner DEMO
- [ ] Registrazione nuovo utente → email di verifica arriva
- [ ] Login funzionante
- [ ] Dashboard Parish Admin accessibile dopo login
- [ ] Mappa carica cappelle (non dati DEMO)
- [ ] Streaming YouTube funzionante (richiede HTTPS)
- [ ] Geolocalizzazione chiede permesso e centra la mappa
- [ ] Cambio lingua funzionante (11 lingue)
- [ ] Contatore adoratori aggiornato (non statico)

---

## ✅ Cosa è ancora simulato in produzione

| Funzionalità | Stato | Richiede |
|---|---|---|
| Dati mappa | [DEMO] se backend non risponde | Backend o Supabase + dati reali |
| Streaming lista | [DEMO] se backend non risponde | Supabase + dati reali |
| Sfide spirituali progress | [DEMO] statico | Tabella `user_challenges` da creare |
| Paesi catena | [DEMO] statico | Viste Supabase `adorers_by_country` |
| Notifiche push | Non implementato | Supabase + FCM/APNS |
| Upload file | Codice pronto | Bucket Supabase da creare |
| Backend RTSP | Non deployato | Railway/Render/Fly.io |

---

## ✅ Rollback

Se qualcosa va storto dopo il deploy:

1. Su Vercel: **Settings → Deployments → scegli il deploy precedente → Redeploy**
2. Il database Supabase non viene toccato dal deploy Vercel
3. Per rollback del database: contatta Supabase support (backup automatici)
