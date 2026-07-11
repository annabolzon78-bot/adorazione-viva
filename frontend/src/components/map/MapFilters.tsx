import { useTranslation } from 'react-i18next'
import { type Dispatch, type SetStateAction } from 'react'
import type { MapFilter } from '../../types'

// MapFilters — i18n applied via props labels (passed from Trova.tsx)
interface Props {
  filter:     MapFilter
  setFilter:  Dispatch<SetStateAction<MapFilter>>
  total:      number
  loading:    boolean
}

type FilterKey = 'openNow' | 'has24h' | 'hasLive' | 'hasConfessions'

const ADORATION_TYPES = [
  { value: undefined,       label: 'Tutte',      color: '#6b7280' },
  { value: 'PERPETUA',      label: '♾ Perpetua', color: '#8b1a2a' },
  { value: 'GIORNALIERA',   label: '🌅 Giornaliera', color: '#1e40af' },
  { value: 'SETTIMANALE',   label: '📅 Settimanale', color: '#166534' },
  { value: 'OCCASIONALE',   label: '🎯 Occasionale', color: '#92400e' },
] as const

const QUICK_FILTERS: { key: FilterKey; label: string; icon: string }[] = [
  { key: 'openNow',        label: 'Aperta ora',   icon: '●' },
  { key: 'has24h',         label: '24h',          icon: '🕐' },
  { key: 'hasLive',        label: 'Live stream',  icon: '▶' },
  { key: 'hasConfessions', label: 'Confessioni',  icon: '✝️' },
]

export function MapFilters({ filter, setFilter, total, loading }: Props) {
  const toggleQuick = (key: FilterKey) =>
    setFilter(f => ({ ...f, [key]: f[key] ? undefined : true }))

  const setType = (type: typeof filter.type) =>
    setFilter(f => ({ ...f, type }))

  const reset = () => setFilter({})

  const activeCount =
    (filter.type ? 1 : 0) +
    (filter.openNow ? 1 : 0) +
    (filter.has24h ? 1 : 0) +
    (filter.hasLive ? 1 : 0) +
    (filter.hasConfessions ? 1 : 0)

  return (
    <div className="map-filters-panel">
      {/* Risultati */}
      <div className="mf-header">
        <span className="mf-count">
          {loading ? '...' : <><strong>{total}</strong> cappelle</>}
        </span>
        {activeCount > 0 && (
          <button className="mf-reset" onClick={reset}>
            Rimuovi filtri ({activeCount})
          </button>
        )}
      </div>

      {/* Tipo adorazione */}
      <div className="mf-section-label">TIPO DI ADORAZIONE</div>
      <div className="mf-type-row">
        {ADORATION_TYPES.map(({ value, label, color }) => (
          <button
            key={String(value)}
            className={`mf-type-btn ${filter.type === value ? 'active' : ''}`}
            style={filter.type === value ? { background: color, borderColor: color, color: '#fff' } : {}}
            onClick={() => setType(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Filtri rapidi */}
      <div className="mf-section-label" style={{ marginTop: 12 }}>FILTRI RAPIDI</div>
      <div className="mf-quick-row">
        {QUICK_FILTERS.map(({ key, label, icon }) => (
          <button
            key={key}
            className={`mf-quick-btn ${filter[key] ? 'active' : ''}`}
            onClick={() => toggleQuick(key)}
          >
            <span className="mq-icon">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Legenda colori */}
      <div className="mf-section-label" style={{ marginTop: 12 }}>LEGENDA</div>
      <div className="mf-legend">
        <div className="ml-row"><span className="ml-dot" style={{ background: '#8b1a2a' }}/><span>Adorazione perpetua</span></div>
        <div className="ml-row"><span className="ml-dot" style={{ background: '#1e40af' }}/><span>Giornaliera</span></div>
        <div className="ml-row"><span className="ml-dot" style={{ background: '#166534' }}/><span>Settimanale</span></div>
        <div className="ml-row"><span className="ml-dot" style={{ background: '#c8a84b' }}/><span>Live stream attivo</span></div>
        <div className="ml-row"><span className="ml-dot" style={{ background: '#6b7280' }}/><span>Altro / Occasionale</span></div>
      </div>
    </div>
  )
}
