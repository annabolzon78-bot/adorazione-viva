/**
 * useDashboard — Data layer con adapter DEMO/produzione
 *
 * In PRODUCTION (isSupabaseConfigured = true):
 *   - legge dati reali da Supabase
 *   - verifica sessione via supabase.auth
 *
 * In DEVELOPMENT (isSupabaseConfigured = false):
 *   - usa DEMO_* data esplicitamente marcati
 *   - mostra banner visibile all'utente
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// ── Tipi ──────────────────────────────────────────────────────
export type UserRole = 'USER'|'PARISH_ADMIN'|'DIOCESE_ADMIN'|'MODERATOR'|'ADMIN'|'SUPER_ADMIN'

export interface DashUser {
  id: string; name: string; email: string; role: UserRole
  parish?: { id:string; name:string; status:string } | null
  diocese?: { id:string; name:string } | null
}

export interface Schedule {
  id:string; dayOfWeek:number; time?:string
  startTime?:string; endTime?:string
  type:'MASS'|'CONFESSION'|'ADORATION'; rite?:string; notes?:string
}

export interface ParishEvent {
  id:string; title:string; slug:string; type:string
  startDate:string; endDate?:string; description:string
  isPublished:boolean; isFeatured:boolean
  address?:string; isFree:boolean; price?:number
}

export interface DashStats {
  chapels:number; parishes:number; masses:number
  adorersNow:number; streams:number; events:number
  pendingParishes?:number; pendingMessages?:number
}

// ── DEMO DATA (solo in development) ──────────────────────────
const DEMO_USER: DashUser = {
  id:'demo-u1', name:'[DEMO] Don Marco', email:'demo@adorazioneviva.test',
  role:'PARISH_ADMIN',
  parish:{ id:'demo-parish', name:"[DEMO] St Mary's Parish — Navan", status:'VERIFIED' },
}
const DEMO_STATS: DashStats = {
  chapels:3, parishes:1, masses:12, adorersNow:47, streams:2, events:5,
  pendingParishes:0, pendingMessages:3
}
const DEMO_SCHEDULES: Schedule[] = [
  { id:'d-s1', dayOfWeek:0, time:'09:00', type:'MASS', rite:'ROMANO' },
  { id:'d-s2', dayOfWeek:0, time:'11:30', type:'MASS', rite:'ROMANO' },
  { id:'d-s3', dayOfWeek:6, time:'18:00', type:'MASS', rite:'ROMANO' },
  { id:'d-s4', dayOfWeek:1, time:'08:00', type:'MASS', rite:'ROMANO' },
  { id:'d-s5', dayOfWeek:6, startTime:'10:00', endTime:'12:00', type:'CONFESSION' },
  { id:'d-s6', dayOfWeek:0, startTime:'00:00', endTime:'23:59', type:'ADORATION' },
]
const DEMO_EVENTS: ParishEvent[] = [
  { id:'d-e1', title:'[DEMO] Veglia di Adorazione', slug:'demo-veglia', type:'VEGLIA', startDate:'2026-08-01T20:00', description:'Dato dimostrativo.', isPublished:true, isFeatured:true, isFree:true },
  { id:'d-e2', title:'[DEMO] Pellegrinaggio Fátima', slug:'demo-fatima', type:'PELLEGRINAGGIO', startDate:'2026-09-15T07:00', description:'Dato dimostrativo.', isPublished:true, isFeatured:false, isFree:false, price:350 },
]
const DEMO_MESSAGES = [
  { id:'d-m1', from:'[DEMO] Maria Rossi', email:'demo@test.it', subject:'Orario Messe', text:'Dato dimostrativo — non è un messaggio reale.', date:'2026-07-10', read:false },
  { id:'d-m2', from:'[DEMO] Giovanni B.', email:'demo2@test.it', subject:'Adorazione', text:'Dato dimostrativo — non è un messaggio reale.', date:'2026-07-09', read:false },
]
const DEMO_PARISHES = [
  { id:'d-p1', name:"[DEMO] St Mary's Parish", city:'Navan', country:'Ireland', status:'VERIFIED', admin:'Don Marco', chapels:3, verifiedAt:'2026-01-15' },
  { id:'d-p2', name:'[DEMO] Basilica Sacro Cuore', city:'Roma', country:'Italy', status:'PENDING', admin:'Don Luca', chapels:1, verifiedAt:null },
]

// ── Supabase data fetcher ──────────────────────────────────────
async function fetchDashboardData(userId: string) {
  const [profileRes, statsRes] = await Promise.all([
    supabase.from('profiles').select('id,name,email,role').eq('id', userId).single(),
    supabase.from('adorers_now').select('total').single(),
  ])
  const profile = profileRes.data as any
  if (!profile) throw new Error('Profilo non trovato')

  // Carica parrocchia se admin
  let parish = null
  if (profile.role === 'PARISH_ADMIN') {
    const { data } = await supabase
      .from('parishes')
      .select('id,name,status')
      .eq('admin_id', userId)
      .single()
    parish = data
  }

  const user: DashUser = { id: profile.id, name: profile.name, email: profile.email, role: profile.role as UserRole, parish }
  const stats: DashStats = { chapels:0, parishes:0, masses:0, adorersNow: (statsRes.data as any)?.total ?? 0, streams:0, events:0 }
  return { user, stats }
}

// ── Hook principale ────────────────────────────────────────────
export function useDashboard() {
  const isConfigured = isSupabaseConfigured()
  const isDev = (import.meta as any).env?.DEV ?? false

  const [user,      setUser]      = useState<DashUser | null>(null)
  const [stats,     setStats]     = useState<DashStats>(isConfigured ? { chapels:0, parishes:0, masses:0, adorersNow:0, streams:0, events:0 } : DEMO_STATS)
  const [schedules, setSchedules] = useState<Schedule[]>(isConfigured ? [] : DEMO_SCHEDULES)
  const [events,    setEvents]    = useState<ParishEvent[]>(isConfigured ? [] : DEMO_EVENTS)
  const [messages,  setMessages]  = useState<typeof DEMO_MESSAGES>(isConfigured ? [] : DEMO_MESSAGES)
  const [parishes,  setParishes]  = useState<typeof DEMO_PARISHES>(isConfigured ? [] : DEMO_PARISHES)
  const [loading,   setLoading]   = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(!isConfigured)

  useEffect(() => {
    const load = async () => {
      // Modalità DEMO: Supabase non configurato
      if (!isConfigured) {
        setUser(DEMO_USER)
        setIsDemoMode(true)
        setLoading(false)
        return
      }

      // Produzione: usa sessione Supabase
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }

      try {
        const { user: u, stats: s } = await fetchDashboardData(session.user.id)
        setUser(u); setStats(s)
        setIsDemoMode(false)
      } catch (err) {
        console.error('[Dashboard] Errore caricamento dati:', err)
        // In PRODUZIONE: non nascondere l'errore con dati DEMO
        if (!isDev) throw err
        // In DEV: fallback DEMO con avviso
        setUser(DEMO_USER); setIsDemoMode(true)
      } finally {
        setLoading(false)
      }
    }
    load()

    // Listener sessione Supabase (unico sistema auth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) { setUser(null); return }
      if (isConfigured) fetchDashboardData(session.user.id).then(({ user: u }) => setUser(u)).catch(() => {})
    })
    return () => subscription.unsubscribe()
  }, [isConfigured, isDev])

  // Dev only: switcher ruolo
  const loginAs = useCallback((role: UserRole) => {
    if (!isDev) return // Bloccato in produzione
    setUser({ ...DEMO_USER, role })
    setSchedules(DEMO_SCHEDULES)
    setEvents(DEMO_EVENTS)
    setMessages(DEMO_MESSAGES)
    setIsDemoMode(true)
  }, [isDev])

  const addSchedule    = useCallback((s: Omit<Schedule,'id'>) =>    setSchedules(p => [...p, { ...s, id:`s${Date.now()}` }]), [])
  const removeSchedule = useCallback((id: string) =>                setSchedules(p => p.filter(s => s.id !== id)), [])
  const addEvent       = useCallback((e: Omit<ParishEvent,'id'|'slug'>) => setEvents(p => [...p, { ...e, id:`e${Date.now()}`, slug:e.title.toLowerCase().replace(/\s+/g,'-') }]), [])
  const updateEvent    = useCallback((id: string, data: Partial<ParishEvent>) => setEvents(p => p.map(e => e.id===id ? {...e,...data} : e)), [])
  const removeEvent    = useCallback((id: string) =>                setEvents(p => p.filter(e => e.id !== id)), [])
  const markRead       = useCallback((id: string) =>                setMessages(p => p.map(m => m.id===id ? {...m,read:true} : m)), [])
  const verifyParish   = useCallback((id: string) =>                setParishes(p => p.map(x => x.id===id ? {...x,status:'VERIFIED'} : x)), [])
  const suspendParish  = useCallback((id: string) =>                setParishes(p => p.map(x => x.id===id ? {...x,status:'SUSPENDED'} : x)), [])

  return {
    user, stats, schedules, events, messages, parishes,
    loading, isDemoMode,
    loginAs, addSchedule, removeSchedule,
    addEvent, updateEvent, removeEvent,
    markRead, verifyParish, suspendParish,
  }
}

export const DAYS_FULL = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato']
