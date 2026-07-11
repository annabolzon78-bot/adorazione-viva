/**
 * useAdoration — Contatore mondiale REALE
 *
 * In PROD: usa Supabase Realtime per aggiornamenti live
 * In DEV (senza Supabase): mostra banner DEMO e valore statico
 */

import { useState, useEffect, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export interface AdorationStats {
  total:          number
  nations:        number
  isDemo:         boolean
  isLoading:      boolean
}

export function useAdoration() {
  const [stats,     setStats]     = useState<AdorationStats>({ total:0, nations:0, isDemo:true, isLoading:true })
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [adoring,   setAdoring]   = useState(false)
  const channelRef = useRef<any>(null)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Modalità DEMO: valore statico con animazione
      setStats({ total:18427, nations:132, isDemo:true, isLoading:false })
      return
    }

    // Carica contatore iniziale dalla view adorers_now
    const loadStats = async () => {
      const { data, error } = await supabase
        .from('adorers_now')
        .select('total,nations')
        .single()
      if (!error && data) {
        const d = data as any
        setStats({ total: d.total ?? 0, nations: d.nations ?? 0, isDemo: false, isLoading: false })
      }
    }
    loadStats()

    // Supabase Realtime: aggiorna contatore a ogni cambio in adoration_sessions
    channelRef.current = supabase
      .channel('adorers-count')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'adoration_sessions',
      }, () => loadStats())
      .subscribe()

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [])

  /** Inizia adorazione (crea sessione nel DB) */
  const startAdoration = async (chapelId?: string): Promise<void> => {
    if (!isSupabaseConfigured()) {
      setAdoring(true)
      setStats(p => ({ ...p, total: p.total + 1 }))
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    const country = await detectCountry()

    const { data, error } = await (supabase.rpc as any)('start_adoration', {
      p_user_id:   user?.id ?? null,
      p_chapel_id: chapelId ?? null,
      p_country:   country,
    })
    if (error) { console.error('[Adoration] start error:', error); return }
    setSessionId(data)
    setAdoring(true)
  }

  /** Termina adorazione */
  const stopAdoration = async (): Promise<void> => {
    if (!isSupabaseConfigured()) {
      setAdoring(false)
      setStats(p => ({ ...p, total: Math.max(0, p.total - 1) }))
      return
    }
    if (!sessionId) return
    await (supabase.rpc as any)('end_adoration', { p_session_id: sessionId })
    setSessionId(null)
    setAdoring(false)
  }

  const toggle = () => adoring ? stopAdoration() : startAdoration()

  return { stats, adoring, toggle, startAdoration, stopAdoration }
}

/** Rileva paese via IP (Supabase Edge Function o fallback) */
async function detectCountry(): Promise<string | null> {
  try {
    const r = await fetch('https://ipapi.co/country_code/', { signal: AbortSignal.timeout(2000) })
    if (r.ok) return r.text()
  } catch {}
  return null
}
