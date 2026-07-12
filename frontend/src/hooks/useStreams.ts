import { useState, useEffect, useCallback, useRef } from 'react'

export interface StreamData {
  id:           string
  title:        string
  description?: string
  type:         string
  status:       'ACTIVE' | 'OFFLINE' | 'SCHEDULED' | 'UNKNOWN'
  language:     string
  continent:    string
  url:          string
  embedUrl?:    string
  embedHtml?:   string
  hlsUrl?:      string
  videoId?:     string
  channelId?:   string
  thumbnailUrl?: string
  tags:         string[]
  isDefault:    boolean
  isFeatured:   boolean
  viewerCount?: number
  totalViews:   number
  lastOnlineAt?: string
  chapel?:      { id: string; name: string; city?: { name: string }; country?: { nameIt: string; flagEmoji?: string } }
  parish?:      { id: string; name: string; city?: { name: string }; country?: { nameIt: string; flagEmoji?: string } }
  schedules:    StreamSchedule[]
  contactEmail?: string
  websiteUrl?:  string
  createdAt:    string
}

export interface StreamSchedule {
  id:          string
  dayOfWeek?:  number
  startTime:   string
  endTime:     string
  timezone:    string
  notes?:      string
  isRecurring: boolean
}

export interface StreamFilter {
  type?:      string
  status?:    string
  language?:  string
  continent?: string
  featured?:  boolean
  q?:         string
}

// Dati di fallback per sviluppo
// ⚠️  DATI DEMO — visualizzati solo quando il backend non risponde
const FALLBACK_STREAMS: StreamData[] = [
  {
    id: '1', title: "St Mary's Parish — Cappella Adorazione", type: 'YOUTUBE_LIVE',
    status: 'ACTIVE', language: 'EN', continent: 'EUROPA',
    url: 'https://www.youtube.com/live/hMNLrStmcTs',
    embedUrl: 'https://www.youtube.com/embed/hMNLrStmcTs?autoplay=1&rel=0',
    videoId: 'hMNLrStmcTs', isDefault: true, isFeatured: true,
    viewerCount: 47, totalViews: 12840, tags: ['adorazione', 'perpetua', 'irlanda'],
    description: 'Cappella dell\'Adorazione Eucaristica di St Mary\'s Parish, Navan. Streaming continuo 24 ore su 24.',
    parish: { id: 'p1', name: "St Mary's Parish", city: { name: 'Navan' }, country: { nameIt: 'Irlanda', flagEmoji: '🇮🇪' } },
    schedules: [
      { id: 's1', dayOfWeek: 0, startTime: '00:00', endTime: '23:59', timezone: 'Europe/Dublin', isRecurring: true },
    ], createdAt: '2024-01-01',
  },
  {
    id: '2', title: 'Sacré-Cœur de Montmartre — Adorazione', type: 'YOUTUBE_LIVE',
    status: 'ACTIVE', language: 'FR', continent: 'EUROPA',
    url: 'https://www.youtube.com/live/GlGkFWPKomU',
    embedUrl: 'https://www.youtube.com/embed/GlGkFWPKomU?autoplay=1&rel=0',
    videoId: 'GlGkFWPKomU', isDefault: false, isFeatured: true,
    viewerCount: 312, totalViews: 98430, tags: ['adorazione', 'perpetua', 'parigi'],
    description: 'Adorazione Eucaristica dalla Basilica del Sacro Cuore di Montmartre, Parigi.',
    parish: { id: 'p2', name: 'Sacré-Cœur Montmartre', city: { name: 'Paris' }, country: { nameIt: 'Francia', flagEmoji: '🇫🇷' } },
    schedules: [
      { id: 's2', dayOfWeek: 0, startTime: '00:00', endTime: '23:59', timezone: 'Europe/Paris', isRecurring: true },
    ], createdAt: '2024-01-01',
  },
]

const API_URL = (import.meta as any).env?.VITE_API_URL ?? '/api'

export function useStreams(filter: StreamFilter = {}) {
  const [streams, setStreams]   = useState<StreamData[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [total, setTotal]       = useState(0)
  const abortRef = useRef<AbortController | null>(null)

  const fetch = useCallback(async () => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (filter.type)      params.set('type',      filter.type)
      if (filter.status)    params.set('status',    filter.status)
      if (filter.language)  params.set('language',  filter.language)
      if (filter.continent) params.set('continent', filter.continent)
      if (filter.featured)  params.set('featured',  'true')
      if (filter.q)         params.set('q',         filter.q)

      const res  = await window.fetch(`${API_URL}/streams?${params}`, { signal: abortRef.current.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setStreams(json.data ?? [])
      setTotal(json.meta?.total ?? 0)
      setError(null)
    } catch (err: any) {
      if (err.name === 'AbortError') return
      // Fallback locale
      let data = [...FALLBACK_STREAMS]
      if (filter.type)      data = data.filter(s => s.type === filter.type)
      if (filter.status)    data = data.filter(s => s.status === filter.status)
      if (filter.language)  data = data.filter(s => s.language === filter.language)
      if (filter.continent) data = data.filter(s => s.continent === filter.continent)
      if (filter.featured)  data = data.filter(s => s.isFeatured)
      if (filter.q) {
        const q = filter.q.toLowerCase()
        data = data.filter(s => s.title.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q))
      }
      setStreams(data)
      setTotal(data.length)
      setError(null)
    } finally { setLoading(false) }
  }, [JSON.stringify(filter)])

  useEffect(() => { fetch() }, [fetch])
  return { streams, loading, error, total, refetch: fetch }
}

export async function updateStreamStatus(id: string, status: string, viewerCount?: number) {
  return window.fetch(`${API_URL}/streams/${id}/status`, {
    method: 'PATCH',

    body: JSON.stringify({ status, viewerCount }),
  })
}

export async function createStream(data: Record<string, unknown>) {
  const res = await window.fetch(`${API_URL}/streams`, {
    method: 'POST',

    body: JSON.stringify(data),
  })
  return res.json()
}
