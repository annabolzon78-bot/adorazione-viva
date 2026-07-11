# Adorazione Viva — Architettura Autenticazione

## Decisione definitiva

**UNICA fonte di autenticazione per gli utenti: Supabase Auth**

Non esistono sistemi paralleli. Non esiste `av_token` nel frontend.

---

## Cosa è stato rimosso

| File rimosso | Motivo |
|---|---|
| `frontend/src/services/api.ts` | Axios wrapper con `av_token` Express — non usato |
| Logica `localStorage.getItem('av_token')` | Sostituita da `supabase.auth.getSession()` |
| `localStorage.getItem('av_refresh_token')` | Gestito automaticamente da Supabase client |
| Redirect basati su `av_token` | Sostituiti da `supabase.auth.onAuthStateChange` |

---

## Cosa resta nel backend Express

Il backend Express NON è più il sistema di autenticazione.
Resta attivo come **microservizio** per sole operazioni che Supabase non copre:

| Funzione | Endpoint | Auth richiesta |
|---|---|---|
| Conversione RTSP→HLS | `POST /api/streams/rtsp-proxy` | Supabase JWT (header `Authorization: Bearer <supabase_token>`) |
| Cleanup sessioni vecchie | `POST /api/internal/cleanup` | `SUPABASE_SERVICE_ROLE_KEY` (solo da server) |
| Webhook YouTube/Vimeo | `POST /api/webhooks/*` | Firma HMAC del provider |

Il backend verifica i JWT Supabase così:

```typescript
// backend/src/middleware/supabaseAuth.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function verifySupabaseJWT(token: string) {
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) throw new Error('Token non valido')
  return user
}
```

Il vecchio middleware `backend/src/middleware/auth.ts` (JWT Express custom) rimane
nel repository come riferimento ma **non viene usato** per le route utente.
Verrà rimosso in una fase successiva al deploy.

---

## Flusso autenticazione attuale

```
Utente → Login.tsx → supabase.auth.signInWithPassword()
                   → Supabase emette JWT
                   → supabase.ts salva in localStorage (chiave: av_session)
                   → ProtectedRoute.tsx verifica con supabase.auth.getSession()
                   → Dashboard.tsx carica profilo da supabase.from('profiles')
```

---

## Chiavi localStorage

| Chiave | Valore | Chi la gestisce |
|---|---|---|
| `av_session` | Token Supabase (JSON) | Supabase client automaticamente |

**Nessun'altra chiave auth in localStorage.**

---

## Modalità DEMO (development)

Quando `VITE_SUPABASE_URL` non è configurato:
- `isSupabaseConfigured()` ritorna `false`
- Il sistema usa dati statici chiaramente marcati `[DEMO]`
- Un banner arancione visibile avvisa l'utente
- Il selettore ruolo dev è visibile SOLO se `import.meta.env.DEV === true`
- In produzione con Supabase configurato: nessun dato DEMO mostrato mai
