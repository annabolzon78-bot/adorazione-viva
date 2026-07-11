import { useTranslation } from 'react-i18next'
import { useState, useRef } from 'react'

const COUNTRIES = [
  { value: '',          label: 'Tutte le nazioni' },
  { value: 'Italy',     label: '🇮🇹 Italia' },
  { value: 'Ireland',   label: '🇮🇪 Irlanda' },
  { value: 'Poland',    label: '🇵🇱 Polonia' },
  { value: 'France',    label: '🇫🇷 Francia' },
  { value: 'Portugal',  label: '🇵🇹 Portogallo' },
  { value: 'Spain',     label: '🇪🇸 Spagna' },
  { value: 'Germany',   label: '🇩🇪 Germania' },
  { value: 'UK',        label: '🇬🇧 Regno Unito' },
  { value: 'USA',       label: '🇺🇸 USA' },
  { value: 'Brazil',    label: '🇧🇷 Brasile' },
  { value: 'Argentina', label: '🇦🇷 Argentina' },
  { value: 'Mexico',    label: '🇲🇽 Messico' },
  { value: 'Philippines', label: '🇵🇭 Filippine' },
  { value: 'Australia', label: '🇦🇺 Australia' },
]

interface Props {
  searchTerm:       string
  setSearchTerm:    (v: string) => void
  searchCity:       string
  setSearchCity:    (v: string) => void
  searchCountry:    string
  setSearchCountry: (v: string) => void
  onLocateMe:       () => void
  locating:         boolean
}

export function MapSearch({
  searchTerm, setSearchTerm,
  searchCity, setSearchCity,
  searchCountry, setSearchCountry,
  onLocateMe, locating,
}: Props) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="map-search-box">
      {/* Barra di ricerca principale */}
      <div className="ms-main-row">
        <div className="ms-input-wrap">
          <span className="ms-ico">🔍</span>
          <input
            ref={inputRef}
            className="ms-input"
            type="text"
            placeholder={t('map.search_placeholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={() => setExpanded(true)}
          />
          {searchTerm && (
            <button className="ms-clear" onClick={() => { setSearchTerm(''); inputRef.current?.focus() }}>✕</button>
          )}
        </div>
        <button
          className={`ms-locate-btn ${locating ? 'locating' : ''}`}
          onClick={onLocateMe}
          title="Trovami"
        >
          {locating ? '⟳' : '📍'}
        </button>
      </div>

      {/* Ricerca avanzata */}
      {expanded && (
        <div className="ms-advanced">
          <div className="ms-row">
            <div className="ms-field">
              <label className="ms-label">CITTÀ</label>
              <input
                className="ms-input-sm"
                type="text"
                placeholder={t('map.city_placeholder')}
                value={searchCity}
                onChange={e => setSearchCity(e.target.value)}
              />
            </div>
            <div className="ms-field">
              <label className="ms-label">NAZIONE</label>
              <select
                className="ms-select"
                value={searchCountry}
                onChange={e => setSearchCountry(e.target.value)}
              >
                {COUNTRIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="ms-close-adv"
            onClick={() => {
              setExpanded(false)
              if (!searchCity && !searchCountry) return
            }}
          >
            Chiudi ↑
          </button>
        </div>
      )}
    </div>
  )
}
