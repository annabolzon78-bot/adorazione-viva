import { useState, useEffect, useCallback, useRef } from 'react'
import type { Chapel, MapFilter } from '../types'

// Dati di fallback per sviluppo locale senza backend
const FALLBACK_CHAPELS: Chapel[] = [
  { id:'1', name:"Basilica di San Pietro", address:"Piazza San Pietro", city:"Roma", country:"Italy", lat:41.902, lng:12.453, adorationType:'PERPETUA', isOpenNow:true, is24h:true, hasLiveStream:false, hasConfessions:true, accessible:true, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'2', name:"Cappella dell'Adorazione", address:"Fair Green, Navan", city:"Navan", country:"Ireland", lat:53.655, lng:-6.69, adorationType:'PERPETUA', isOpenNow:true, is24h:true, hasLiveStream:true, hasConfessions:true, accessible:true, schedule:[], createdAt:'', updatedAt:'', streamUrl:'https://www.youtube.com/live/hMNLrStmcTs', hasMass:true },
  { id:'3', name:"Santuario di Lourdes", address:"Lourdes", city:"Lourdes", country:"France", lat:43.099, lng:-0.047, adorationType:'PERPETUA', isOpenNow:true, is24h:true, hasLiveStream:true, hasConfessions:true, accessible:true, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'4', name:"Santuario di Fátima", address:"Fátima", city:"Fátima", country:"Portugal", lat:39.627, lng:-8.672, adorationType:'PERPETUA', isOpenNow:true, is24h:true, hasLiveStream:true, hasConfessions:true, accessible:true, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'5', name:"Duomo di Milano", address:"Piazza del Duomo", city:"Milano", country:"Italy", lat:45.464, lng:9.190, adorationType:'GIORNALIERA', isOpenNow:false, is24h:false, hasLiveStream:false, hasConfessions:true, accessible:true, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'6', name:"Notre-Dame de Paris", address:"6 Parvis Notre-Dame", city:"Paris", country:"France", lat:48.852, lng:2.350, adorationType:'GIORNALIERA', isOpenNow:true, is24h:false, hasLiveStream:false, hasConfessions:true, accessible:true, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'7', name:"Westminster Cathedral", address:"Victoria Street", city:"London", country:"UK", lat:51.497, lng:-0.140, adorationType:'GIORNALIERA', isOpenNow:false, is24h:false, hasLiveStream:false, hasConfessions:true, accessible:true, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'8', name:"Cattedrale di Varsavia", address:"ul. Jana Pawła II 2", city:"Varsavia", country:"Poland", lat:52.230, lng:21.011, adorationType:'PERPETUA', isOpenNow:true, is24h:true, hasLiveStream:false, hasConfessions:true, accessible:true, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'9', name:"Wawel Cathedral", address:"Wawel 3", city:"Cracow", country:"Poland", lat:50.053, lng:19.935, adorationType:'SETTIMANALE', isOpenNow:false, is24h:false, hasLiveStream:false, hasConfessions:true, accessible:false, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'10', name:"National Shrine Washington", address:"400 Michigan Ave NE", city:"Washington DC", country:"USA", lat:38.934, lng:-76.999, adorationType:'PERPETUA', isOpenNow:true, is24h:true, hasLiveStream:false, hasConfessions:true, accessible:true, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'11', name:"Manila Cathedral", address:"Calle del Arzobispo", city:"Manila", country:"Philippines", lat:14.592, lng:120.973, adorationType:'PERPETUA', isOpenNow:true, is24h:true, hasLiveStream:false, hasConfessions:true, accessible:true, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'12', name:"Catedral Metropolitana BA", address:"San Martín 27", city:"Buenos Aires", country:"Argentina", lat:-34.609, lng:-58.374, adorationType:'GIORNALIERA', isOpenNow:false, is24h:false, hasLiveStream:false, hasConfessions:true, accessible:true, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'13', name:"Santuario di Sokółka", address:"ul. Białostocka 46", city:"Sokółka", country:"Poland", lat:53.407, lng:23.501, adorationType:'PERPETUA', isOpenNow:true, is24h:true, hasLiveStream:false, hasConfessions:false, accessible:true, schedule:[], createdAt:'', updatedAt:'', hasMass:false },
  { id:'14', name:"Basilica S. Francisco de Asís", address:"Av. Callao 542", city:"Buenos Aires", country:"Argentina", lat:-34.601, lng:-58.393, adorationType:'SETTIMANALE', isOpenNow:false, is24h:false, hasLiveStream:false, hasConfessions:true, accessible:false, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'15', name:"Cathedral of Good Shepherd", address:"A Queen St", city:"Singapore", country:"Singapore", lat:1.304, lng:103.852, adorationType:'GIORNALIERA', isOpenNow:true, is24h:false, hasLiveStream:false, hasConfessions:false, accessible:true, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'16', name:"Sacré-Cœur de Montmartre", address:"35 Rue du Chevalier de la Barre", city:"Paris", country:"France", lat:48.887, lng:2.343, adorationType:'PERPETUA', isOpenNow:true, is24h:true, hasLiveStream:true, hasConfessions:true, accessible:false, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'17', name:"Parrocchia Sacro Cuore", address:"Via Roma 12", city:"Roma", country:"Italy", lat:41.895, lng:12.482, adorationType:'SETTIMANALE', isOpenNow:false, is24h:false, hasLiveStream:false, hasConfessions:true, accessible:true, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'18', name:"St Mary's Cathedral", address:"Cathedral St", city:"Sydney", country:"Australia", lat:-33.873, lng:151.210, adorationType:'GIORNALIERA', isOpenNow:false, is24h:false, hasLiveStream:false, hasConfessions:true, accessible:true, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'19', name:"Catedral de São Paulo", address:"Praça da Sé", city:"São Paulo", country:"Brazil", lat:-23.550, lng:-46.634, adorationType:'GIORNALIERA', isOpenNow:true, is24h:false, hasLiveStream:false, hasConfessions:false, accessible:true, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
  { id:'20', name:"Holy Spirit Cathedral", address:"123 N China Ave", city:"Nairobi", country:"Kenya", lat:-1.286, lng:36.817, adorationType:'SETTIMANALE', isOpenNow:false, is24h:false, hasLiveStream:false, hasConfessions:false, accessible:false, schedule:[], createdAt:'', updatedAt:'', hasMass:true },
]

export interface UseMapChapelsOptions {
  filter: MapFilter
  searchTerm: string
  searchCity: string
  searchCountry: string
}

export interface UseMapChapelsResult {
  chapels:   Chapel[]
  loading:   boolean
  error:     string | null
  total:     number
  refetch:   () => void
}

export function useMapChapels(options: UseMapChapelsOptions): UseMapChapelsResult {
  const [chapels, setChapels] = useState<Chapel[]>([])
  const [loading, setLoading]  = useState(true)
  const [error, setError]      = useState<string | null>(null)
  const [total, setTotal]      = useState(0)
  const abortRef = useRef<AbortController | null>(null)

  const fetchChapels = useCallback(async () => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ limit: '200' })
      if (options.filter.type)           params.set('adorationType',  options.filter.type)
      if (options.filter.openNow)        params.set('openNow',        'true')
      if (options.filter.has24h)         params.set('is24h',          'true')
      if (options.filter.hasLive)        params.set('hasLiveStream',  'true')
      if (options.filter.hasConfessions) params.set('hasConfessions', 'true')
      if (options.filter.radiusKm)       params.set('radiusKm',       String(options.filter.radiusKm))
      if (options.filter.lat)            params.set('lat',            String(options.filter.lat))
      if (options.filter.lng)            params.set('lng',            String(options.filter.lng))
      if (options.searchCity)            params.set('q',              options.searchCity)
      if (options.searchCountry)         params.set('countryId',      options.searchCountry)

      const apiUrl = (import.meta as any).env?.VITE_API_URL ?? '/api'
      const res = await fetch(`${apiUrl}/chapels?${params}`, {
        signal: abortRef.current.signal,
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      let data: Chapel[] = json.data ?? []

      // Filtro client-side per searchTerm
      if (options.searchTerm.trim()) {
        const term = options.searchTerm.toLowerCase()
        data = data.filter(c =>
          c.name.toLowerCase().includes(term) ||
          c.city?.toLowerCase().includes(term) ||
          c.address?.toLowerCase().includes(term)
        )
      }

      setChapels(data)
      setTotal(json.meta?.total ?? data.length)
    } catch (err: any) {
      if (err.name === 'AbortError') return
      console.warn('API non disponibile, uso dati di esempio:', err.message)
      // Fallback locale per sviluppo senza backend
      let data = [...FALLBACK_CHAPELS]
      const { filter, searchTerm, searchCity, searchCountry } = options
      if (filter.type)           data = data.filter(c => c.adorationType === filter.type)
      if (filter.openNow)        data = data.filter(c => c.isOpenNow)
      if (filter.has24h)         data = data.filter(c => c.is24h)
      if (filter.hasLive)        data = data.filter(c => c.hasLiveStream)
      if (filter.hasConfessions) data = data.filter(c => c.hasConfessions)
      if (searchTerm) {
        const t = searchTerm.toLowerCase()
        data = data.filter(c => c.name.toLowerCase().includes(t) || c.city?.toLowerCase().includes(t))
      }
      if (searchCity)    data = data.filter(c => c.city?.toLowerCase().includes(searchCity.toLowerCase()))
      if (searchCountry) data = data.filter(c => c.country?.toLowerCase().includes(searchCountry.toLowerCase()))
      setChapels(data)
      setTotal(data.length)
      setError(null)
    } finally {
      setLoading(false)
    }
  }, [options.filter, options.searchTerm, options.searchCity, options.searchCountry])

  useEffect(() => { fetchChapels() }, [fetchChapels])

  return { chapels, loading, error, total, refetch: fetchChapels }
}
