import { useEffect, useRef, useCallback } from 'react'
import type { Chapel } from '../../types'

// Configurazione colori per tipo adorazione
const TYPE_COLOR: Record<string, string> = {
  PERPETUA:    '#8b1a2a',
  GIORNALIERA: '#1e40af',
  SETTIMANALE: '#166534',
  MENSILE:     '#7c3aed',
  OCCASIONALE: '#6b7280',
}

function makeIcon(chapel: Chapel, L: any): any {
  const color = chapel.hasLiveStream ? '#c8a84b' : (TYPE_COLOR[chapel.adorationType] ?? '#6b7280')
  const ring  = chapel.isOpenNow     ? '3px solid #22c55e' : '3px solid rgba(255,255,255,0.8)'
  const size  = chapel.adorationType === 'PERPETUA' ? 16 : 13

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:${size}px; height:${size}px;
        background:${color};
        border-radius:50%;
        border:${ring};
        box-shadow:0 2px 8px rgba(0,0,0,.35);
        cursor:pointer;
        transition:transform .15s;
      " title="${chapel.name}"></div>`,
    iconSize:   [size, size],
    iconAnchor: [size/2, size/2],
  })
}

interface Props {
  chapels:        Chapel[]
  selectedChapel: Chapel | null
  onSelectChapel: (chapel: Chapel) => void
  loading?:       boolean
  center?:        { lat: number; lng: number }
  zoom?:          number
}

export function MapView({ chapels, selectedChapel, onSelectChapel, loading }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<any>(null)
  const clusterRef   = useRef<any>(null)
  const markersRef   = useRef<Map<string, any>>(new Map())
  const leafletRef   = useRef<any>(null)

  // Inizializza la mappa
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const init = async () => {
      const L = await import('leaflet')
      leafletRef.current = L

      // Fix icone di default Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      // Crea la mappa centrata sul mondo
      const map = L.map(containerRef.current!, {
        center:  [20, 10],
        zoom:    3,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false,
      })

      // Tiles OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Zoom control in basso a destra
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // Cluster group
      try {
        const { MarkerClusterGroup } = await import('leaflet.markercluster' as any)
        const cluster = new MarkerClusterGroup({
          showCoverageOnHover:   false,
          maxClusterRadius:      60,
          spiderfyOnMaxZoom:     true,
          disableClusteringAtZoom: 12,
          iconCreateFunction: (c: any) => {
            const count = c.getChildCount()
            const size  = count > 100 ? 44 : count > 10 ? 36 : 28
            return L.divIcon({
              className: '',
              html: `<div style="
                width:${size}px;height:${size}px;
                background:#8b1a2a;color:#fff;
                border-radius:50%;border:2px solid rgba(255,255,255,.7);
                display:flex;align-items:center;justify-content:center;
                font-size:${size > 36 ? 13 : 11}px;font-weight:700;font-family:Lato,sans-serif;
                box-shadow:0 3px 10px rgba(139,26,42,.4);
              ">${count}</div>`,
              iconSize:   [size, size],
              iconAnchor: [size/2, size/2],
            })
          },
        })
        map.addLayer(cluster)
        clusterRef.current = cluster
      } catch {
        // Fallback: no clustering (leaflet.markercluster non installato)
        console.warn('MarkerCluster non disponibile')
        clusterRef.current = map
      }

      mapRef.current = map
    }

    init()

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
      clusterRef.current = null
    }
  }, [])

  // Aggiorna marker quando cambiano le cappelle
  const updateMarkers = useCallback(() => {
    const L       = leafletRef.current
    const cluster = clusterRef.current
    if (!L || !cluster) return

    // Rimuovi tutti i marker esistenti
    if (cluster.clearLayers) cluster.clearLayers()
    markersRef.current.clear()

    // Aggiungi nuovi marker
    const newMarkers: any[] = []
    chapels.forEach(chapel => {
      if (!chapel.lat || !chapel.lng) return
      const marker = L.marker([chapel.lat, chapel.lng], { icon: makeIcon(chapel, L) })
      marker.on('click', () => onSelectChapel(chapel))
      marker.bindTooltip(chapel.name, {
        permanent:   false,
        direction:   'top',
        offset:      [0, -8],
        className:   'chapel-tooltip',
        opacity:     0.95,
      })
      markersRef.current.set(chapel.id, marker)
      newMarkers.push(marker)
    })

    if (cluster.addLayers) {
      cluster.addLayers(newMarkers)
    } else {
      newMarkers.forEach(m => m.addTo(cluster))
    }
  }, [chapels, onSelectChapel])

  useEffect(() => { updateMarkers() }, [updateMarkers])

  // Evidenzia il marker selezionato e centra la mappa
  useEffect(() => {
    if (!selectedChapel || !mapRef.current) return
    const marker = markersRef.current.get(selectedChapel.id)
    if (marker) {
      mapRef.current.setView([selectedChapel.lat, selectedChapel.lng], 14, { animate: true })
      marker.openTooltip()
    }
  }, [selectedChapel])

  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {loading && (
        <div className="map-loading-overlay">
          <div className="map-spinner">
            <span>❤️‍🔥</span>
            <span className="mls-text">Caricamento cappelle...</span>
          </div>
        </div>
      )}
    </div>
  )
}
