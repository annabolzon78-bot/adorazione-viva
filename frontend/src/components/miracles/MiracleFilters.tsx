import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import type { MiracleFilter } from '../../hooks/useMiracles'

const CONTINENTS = [
  { value:'',              label:'Tutti i continenti' },
  { value:'EUROPA',        label:'🌍 Europa' },
  { value:'AMERICA_NORD',  label:'🌎 America del Nord' },
  { value:'AMERICA_SUD',   label:'🌎 America del Sud' },
  { value:'AFRICA',        label:'🌍 Africa' },
  { value:'ASIA',          label:'🌏 Asia' },
  { value:'OCEANIA',       label:'🌏 Oceania' },
  { value:'MEDIO_ORIENTE', label:'🌍 Medio Oriente' },
]
const LEVELS = [
  { value:'',            label:'Tutti i livelli' },
  { value:'SCIENTIFICO', label:'🔬 Scientifico', color:'#166534' },
  { value:'PONTIFICIO',  label:'✝️ Pontificio',  color:'#8b1a2a' },
  { value:'DIOCESANO',   label:'⛪ Diocesano',   color:'#1e40af' },
  { value:'STORICO',     label:'📜 Storico',     color:'#92400e' },
]
const SORTS = [
  { value:'featuredOrder', label:'Ordinamento' },
  { value:'year',          label:'Anno' },
  { value:'title',         label:'Nome A→Z' },
  { value:'viewCount',     label:'Più visti' },
]

interface Props { filter: MiracleFilter; setFilter: (f: MiracleFilter) => void; total: number; loading: boolean }

export function MiracleFilters({ filter, setFilter, total, loading }: Props) {
  const [yearFrom, setYearFrom] = useState(filter.yearFrom?.toString() ?? '')
  const [yearTo,   setYearTo]   = useState(filter.yearTo?.toString()   ?? '')

  const set = (k: keyof MiracleFilter, v: any) => setFilter({ ...filter, [k]: v || undefined })

  const applyYears = () => setFilter({
    ...filter,
    yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
    yearTo:   yearTo   ? parseInt(yearTo)   : undefined,
  })

  const activeCount = Object.values(filter).filter(v => v !== undefined && v !== '').length
  const reset = () => { setFilter({}); setYearFrom(''); setYearTo('') }

  return (
    <div className="mf-panel">
      {/* Ricerca */}
      <div className="mfp-search-row">
        <div className="mfp-input-wrap">
          <span className="mfp-ico">🔍</span>
          <input className="mfp-input" type="text" placeholder="Cerca miracolo, luogo, descrizione..."
            value={filter.q ?? ''} onChange={e => set('q', e.target.value)} />
          {filter.q && <button className="mfp-clear" onClick={() => set('q', '')}>✕</button>}
        </div>
        <span className="mfp-count">{loading ? '...' : <><strong>{total}</strong> miracoli</>}</span>
      </div>

      {/* Selects */}
      <div className="mfp-row">
        <select className="mfp-select" value={filter.continent ?? ''} onChange={e => set('continent', e.target.value)}>
          {CONTINENTS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select className="mfp-select" value={filter.verificationLevel ?? ''} onChange={e => set('verificationLevel', e.target.value)}>
          {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
        <select className="mfp-select mfp-select-sm" value={filter.sortBy ?? 'featuredOrder'} onChange={e => set('sortBy', e.target.value)}>
          {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Anno range */}
      <div className="mfp-year-row">
        <span className="mfp-year-label">Anno</span>
        <input className="mfp-year-input" type="number" placeholder="dal" min="0" max="2024"
          value={yearFrom} onChange={e => setYearFrom(e.target.value)} onBlur={applyYears} />
        <span className="mfp-year-sep">→</span>
        <input className="mfp-year-input" type="number" placeholder="al" min="0" max="2024"
          value={yearTo} onChange={e => setYearTo(e.target.value)} onBlur={applyYears} />
      </div>

      {/* Quick toggles */}
      <div className="mfp-quick-row">
        {[
          { key:'isVisitable', label:'📍 Visitabile oggi' },
          { key:'hasScience',  label:'🔬 Con analisi scientifica' },
          { key:'hasVideo',    label:'▶ Con video' },
        ].map(({ key, label }) => (
          <button key={key} className={`mfp-quick ${(filter as any)[key] ? 'on' : ''}`}
            onClick={() => set(key as any, (filter as any)[key] ? undefined : true)}>
            {label}
          </button>
        ))}
        {activeCount > 0 && (
          <button className="mfp-reset" onClick={reset}>✕ Rimuovi ({activeCount})</button>
        )}
      </div>
    </div>
  )
}
