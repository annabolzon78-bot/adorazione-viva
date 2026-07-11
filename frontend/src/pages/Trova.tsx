import { useState, useEffect } from 'react'
import { useTranslation }     from 'react-i18next'
import { MapView }            from '../components/map/MapView'
import { MapFilters }         from '../components/map/MapFilters'
import { ChapelPanel }        from '../components/map/ChapelPanel'
import { useMapChapels }      from '../hooks/useMapChapels'
import { useGeolocation }     from '../hooks/useGeolocation'
import type { Chapel, MapFilter } from '../types'
import '../styles/map.css'

const RADIUS_OPTIONS = [
  { km: 5,    label: '5 km'  },
  { km: 20,   label: '20 km' },
  { km: 50,   label: '50 km' },
  { km: 9999, label: 'Tutto il mondo' },
]

export function Trova() {
  const { t }         = useTranslation()
  const geo           = useGeolocation()
  const [filter,      setFilter]       = useState<MapFilter>({})
  const [selected,    setSelected]     = useState<Chapel | null>(null)
  const [geoRadius,   setGeoRadius]    = useState(20) // km default
  const [mapCenter,   setMapCenter]    = useState<{lat:number;lng:number} | null>(null)
  const [geoStatus,   setGeoStatus]    = useState<'idle'|'loading'|'ok'|'denied'>('idle')

  // Applica posizione alla mappa quando disponibile
  useEffect(() => {
    if (geo.lat && geo.lng) {
      setMapCenter({ lat: geo.lat, lng: geo.lng })
      setFilter(prev => ({ ...prev, lat: geo.lat!, lng: geo.lng!, radiusKm: geoRadius }))
      setGeoStatus('ok')
    }
    if (geo.error) {
      setGeoStatus('denied')
    }
    if (geo.loading) {
      setGeoStatus('loading')
    }
  }, [geo.lat, geo.lng, geo.error, geo.loading, geoRadius])

  const handleLocateMe = () => {
    setGeoStatus('loading')
    geo.locate()
  }

  const handleRadiusChange = (km: number) => {
    setGeoRadius(km)
    if (geo.lat && geo.lng) {
      setFilter(prev => ({ ...prev, radiusKm: km }))
    }
  }

  const clearGeo = () => {
    setGeoStatus('idle')
    setMapCenter(null)
    setFilter(prev => { const f = {...prev}; delete f.lat; delete f.lng; delete f.radiusKm; return f })
  }

  const { chapels, loading, total, isDemoData } = useMapChapels({ filter })

  // Messaggio status geolocalizzazione tradotto
  const geoMessage: Record<typeof geoStatus, string> = {
    idle:    t('map.locate_me'),
    loading: t('common.loading'),
    ok:      `📍 ${total} ${t('map.chapels')} entro ${geoRadius} km`,
    denied:  t('map.geo_denied') || 'Posizione non disponibile',
  }

  return (
    <div className="pg trova-page">
      {/* Demo banner */}
      {isDemoData && (
        <div className="demo-banner">
          ⚠️ [DEMO] Cappelle simulate — dati reali disponibili dopo configurazione Supabase
        </div>
      )}

      {/* Geolocalizzazione */}
      <div className="geo-bar">
        {geoStatus === 'idle' || geoStatus === 'denied' ? (
          <button
            className={`geo-btn ${geoStatus === 'denied' ? 'geo-btn-denied' : ''}`}
            onClick={handleLocateMe}
            disabled={geoStatus === 'denied'}
            title={geoStatus === 'denied' ? 'Autorizzazione posizione negata' : ''}
          >
            📍 {geoStatus === 'denied' ? (t('map.geo_denied') || 'Posizione negata') : t('map.locate_me')}
          </button>
        ) : geoStatus === 'loading' ? (
          <div className="geo-loading">📍 {t('common.loading')}</div>
        ) : (
          <div className="geo-active">
            <span className="geo-ok">📍 {geoMessage.ok}</span>
            <div className="geo-radius-pills">
              {RADIUS_OPTIONS.map(({ km, label }) => (
                <button
                  key={km}
                  className={`geo-radius-pill ${geoRadius === km ? 'active' : ''}`}
                  onClick={() => handleRadiusChange(km)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button className="geo-clear" onClick={clearGeo} title="Rimuovi filtro posizione">✕</button>
          </div>
        )}
      </div>

      {/* Filtri */}
      <MapFilters filter={filter} setFilter={setFilter} total={total} loading={loading} />

      {/* Mappa */}
      <div className="map-container">
        <MapView
          chapels={chapels}
          selectedChapel={selected}
          onSelectChapel={setSelected}
          center={mapCenter ?? undefined}
          zoom={mapCenter ? 12 : 4}
        />
        {loading && (
          <div className="map-loading-overlay">
            <span>❤️‍🔥 {t('map.loading')}</span>
          </div>
        )}
      </div>

      {/* Pannello dettaglio cappella */}
      {selected && (
        <ChapelPanel chapel={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
