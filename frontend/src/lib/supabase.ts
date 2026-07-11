/**
 * ADORAZIONE VIVA — Supabase Client
 *
 * Variabili richieste in .env:
 *   VITE_SUPABASE_URL      = https://xxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY = eyJ...
 *
 * ⚠️  Non inserire mai la SERVICE_ROLE_KEY nel frontend.
 *     Quella va solo nel backend/edge functions.
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl  = (import.meta as any).env?.VITE_SUPABASE_URL  as string | undefined
const supabaseKey  = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Supabase] Variabili ambiente mancanti.\n' +
    'Crea un file .env con:\n' +
    '  VITE_SUPABASE_URL=https://xxxx.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=eyJ...\n' +
    'La app funzionerà in modalità DEMO fino a quel momento.'
  )
}

export const supabase = createClient<Database>(
  supabaseUrl  ?? 'https://placeholder.supabase.co',
  supabaseKey  ?? 'placeholder-anon-key',
  {
    auth: {
      autoRefreshToken:    true,
      persistSession:      true,
      detectSessionInUrl:  true,
      storageKey:          'av_session',
    },
    realtime: {
      params: {
        eventsPerSecond: 2,   // rate limit client-side
      },
    },
  }
)

/** True se le credenziali Supabase sono configurate */
export const isSupabaseConfigured = (): boolean =>
  !!supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co'

/** Tipizzazione helper */
export type SupabaseClient = typeof supabase
