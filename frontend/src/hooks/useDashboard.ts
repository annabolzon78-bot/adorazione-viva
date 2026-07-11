import { useState, useEffect, useCallback } from 'react'

const API = (import.meta as any).env?.VITE_API_URL ?? '/api'

// ── Tipi ──────────────────────────────────────────────────────
export type UserRole = 'USER' | 'PARISH_ADMIN' | 'DIOCESE_ADMIN' | 'ADMIN' | 'SUPER_ADMIN'

export interface DashUser {
  id: string; name: string; email: string; role: UserRole
  parish?: { id: string; name: string; status: string }
  diocese?: { id: string; name: string }
}

export interface Schedule {
  id: string; dayOfWeek: number; time?: string
  startTime?: string; endTime?: string
  type: 'MASS'|'CONFESSION'|'ADORATION'; rite?: string; notes?: string
}

export interface ParishEvent {
  id: string; title: string; slug: string; type: string
  startDate: string; endDate?: string; description: string
  isPublished: boolean; isFeatured: boolean; address?: string
  imageUrl?: string; isFree: boolean; price?: number
}

export interface DashStats {
  chapels: number; parishes: number; masses: number
  adorersNow: number; streams: number; events: number
  pendingParishes?: number; pendingMessages?: number
}

// ── Mock data ─────────────────────────────────────────────────
const MOCK_USER: DashUser = {
  id: 'u1', name: 'Don Marco', email: 'don.marco@stmarys.ie',
  role: 'PARISH_ADMIN',
  parish: { id: 'parish-navan', name: "St Mary's Parish — Navan", status: 'VERIFIED' }
}
const MOCK_STATS: DashStats = {
  chapels: 3, parishes: 1, masses: 12, adorersNow: 47,
  streams: 2, events: 5, pendingParishes: 0, pendingMessages: 3
}
const MOCK_SCHEDULES: Schedule[] = [
  { id:'s1', dayOfWeek:0, time:'09:00', type:'MASS', rite:'ROMANO' },
  { id:'s2', dayOfWeek:0, time:'11:30', type:'MASS', rite:'ROMANO' },
  { id:'s3', dayOfWeek:6, time:'18:00', type:'MASS', rite:'ROMANO' },
  { id:'s4', dayOfWeek:1, time:'08:00', type:'MASS', rite:'ROMANO' },
  { id:'s5', dayOfWeek:6, startTime:'10:00', endTime:'12:00', type:'CONFESSION' },
  { id:'s6', dayOfWeek:0, startTime:'00:00', endTime:'23:59', type:'ADORATION' },
]
const MOCK_EVENTS: ParishEvent[] = [
  { id:'e1', title:'Veglia di Adorazione', slug:'veglia-adorazione', type:'VEGLIA', startDate:'2026-08-01T20:00', description:'Veglia di preghiera notturna', isPublished:true, isFeatured:true, isFree:true },
  { id:'e2', title:'Pellegrinaggio a Fátima', slug:'pellegrinaggio-fatima', type:'PELLEGRINAGGIO', startDate:'2026-09-15T07:00', endDate:'2026-09-20', description:'Pellegrinaggio comunitario', isPublished:true, isFeatured:false, isFree:false, price:350 },
  { id:'e3', title:'Ritiro Eucaristico', slug:'ritiro-eucaristico', type:'RITIRO', startDate:'2026-10-05T09:00', description:'Ritiro spirituale di un giorno', isPublished:false, isFeatured:false, isFree:true },
]
const MOCK_MESSAGES = [
  { id:'m1', from:'Maria Rossi', email:'maria@email.it', subject:'Orario Messe', text:'Buongiorno, vorrei sapere gli orari delle Messe feriali. Grazie.', date:'2026-07-10', read:false },
  { id:'m2', from:'Giovanni B.', email:'giovanni@email.it', subject:'Adorazione', text:'È possibile prenotare un turno di adorazione notturna?', date:'2026-07-09', read:false },
  { id:'m3', from:'Lucia C.', email:'lucia@email.it', subject:'Streaming', text:'Ho problemi con il link dello streaming. Non si apre.', date:'2026-07-08', read:true },
]
const MOCK_PARISHES_ADMIN = [
  { id:'p1', name:"St Mary's Parish", city:'Navan', country:'Ireland', status:'VERIFIED', admin:'Don Marco', chapels:3, verifiedAt:'2026-01-15' },
  { id:'p2', name:'Basilica Sacro Cuore', city:'Roma', country:'Italy', status:'PENDING', admin:'Don Luca', chapels:1, verifiedAt:null },
  { id:'p3', name:'Notre-Dame Montmartre', city:'Paris', country:'France', status:'VERIFIED', admin:'Père Henri', chapels:2, verifiedAt:'2025-11-20' },
  { id:'p4', name:'Cathedral of Good Shepherd', city:'Singapore', country:'Singapore', status:'PENDING', admin:'Fr. James', chapels:1, verifiedAt:null },
  { id:'p5', name:'Catedral de São Paulo', city:'São Paulo', country:'Brazil', status:'SUSPENDED', admin:'Pe. Carlos', chapels:2, verifiedAt:'2025-08-10' },
]

// ── Hook principale ────────────────────────────────────────────
export function useDashboard() {
  const [user,      setUser]      = useState<DashUser | null>(null)
  const [stats,     setStats]     = useState<DashStats>(MOCK_STATS)
  const [schedules, setSchedules] = useState<Schedule[]>(MOCK_SCHEDULES)
  const [events,    setEvents]    = useState<ParishEvent[]>(MOCK_EVENTS)
  const [messages,  setMessages]  = useState(MOCK_MESSAGES)
  const [parishes,  setParishes]  = useState(MOCK_PARISHES_ADMIN)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('av_token')
    if (!token) { setLoading(false); return }
    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(j => { if (j.success) setUser(j.data) })
      .catch(() => {})
      .finally(() => setLoading(false))

    // In dev senza auth, usa mock
    if (!token || token === 'mock') setUser(MOCK_USER)
    setLoading(false)
  }, [])

  // Simula login dashboard in dev
  const loginAs = (role: UserRole) => {
    const mock = { ...MOCK_USER, role }
    if (role === 'DIOCESE_ADMIN') mock.diocese = { id:'d1', name:'Diocese of Meath' }
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') { delete (mock as any).parish; delete (mock as any).diocese }
    setUser(mock)
  }

  const addSchedule   = useCallback((s: Omit<Schedule,'id'>) => setSchedules(prev => [...prev, { ...s, id:`s${Date.now()}` }]), [])
  const removeSchedule= useCallback((id: string) => setSchedules(prev => prev.filter(s => s.id !== id)), [])
  const addEvent      = useCallback((e: Omit<ParishEvent,'id'|'slug'>) => setEvents(prev => [...prev, { ...e, id:`e${Date.now()}`, slug:e.title.toLowerCase().replace(/\s+/g,'-') }]), [])
  const updateEvent   = useCallback((id: string, data: Partial<ParishEvent>) => setEvents(prev => prev.map(e => e.id===id ? {...e,...data} : e)), [])
  const removeEvent   = useCallback((id: string) => setEvents(prev => prev.filter(e => e.id !== id)), [])
  const markRead      = useCallback((id: string) => setMessages(prev => prev.map(m => m.id===id ? {...m,read:true} : m)), [])
  const verifyParish  = useCallback((id: string) => setParishes(prev => prev.map(p => p.id===id ? {...p,status:'VERIFIED',verifiedAt:new Date().toISOString().split('T')[0]} : p)), [])
  const suspendParish = useCallback((id: string) => setParishes(prev => prev.map(p => p.id===id ? {...p,status:'SUSPENDED'} : p)), [])

  return { user, stats, schedules, events, messages, parishes, loading, loginAs, addSchedule, removeSchedule, addEvent, updateEvent, removeEvent, markRead, verifyParish, suspendParish }
}

export const DAYS = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab']
export const DAYS_FULL = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato']
