import { useTranslation } from 'react-i18next'
import type { MiracleFilter } from '../../hooks/useMiracles'

interface Props {
  filter:    MiracleFilter
  setFilter: (f: MiracleFilter) => void
  total:     number
  loading:   boolean
}

export function MiracleFilters({ filter, setFilter, total, loading }: Props) {
  const { t } = useTranslation()
  const set = (k: keyof MiracleFilter, v: any) => setFilter({ ...filter, [k]: v || undefined })
  const hasAny = Object.values(filter).some(v => v !== undefined && v !== '')

  return (
    <div className="mf-panel">
      {/* Ricerca */}
      <div className="mfp-search-row">
        <div className="mfp-input-wrap">
          <span className="mfp-ico">🔍</span>
          <input
            className="mfp-input"
            placeholder={t('miracles.search_placeholder')}
            value={filter.q ?? ''}
            onChange={e => set('q', e.target.value)}
          />
          {filter.q && <button className="mfp-clear" onClick={() => set('q', '')}>✕</button>}
        </div>
        <span className="mfp-count">
          {loading
            ? t('common.loading')
            : <><strong>{total}</strong> {t('miracles.miracles_count')}</>
          }
        </span>
      </div>

      {/* Filtri */}
      <div className="mfp-row">
        <select className="mfp-select" value={filter.continent ?? ''} onChange={e => set('continent', e.target.value)}>
          <option value="">{t('miracles.all_continents')}</option>
          <option value="EUROPA">🌍 Europa</option>
          <option value="AMERICA_NORD">🌎 America del Nord</option>
          <option value="AMERICA_SUD">🌎 America del Sud</option>
          <option value="AFRICA">🌍 Africa</option>
          <option value="ASIA">🌏 Asia</option>
          <option value="OCEANIA">🌏 Oceania</option>
          <option value="MEDIO_ORIENTE">🕌 Medio Oriente</option>
        </select>

        <select className="mfp-select" value={filter.verificationLevel ?? ''} onChange={e => set('verificationLevel', e.target.value)}>
          <option value="">{t('miracles.all_levels')}</option>
          <option value="SCIENTIFICO">{t('miracles.level_scientific')}</option>
          <option value="PONTIFICIO">{t('miracles.level_pontifical')}</option>
          <option value="DIOCESANO">{t('miracles.level_diocesan')}</option>
          <option value="STORICO">{t('miracles.level_historical')}</option>
        </select>

        <select className="mfp-select mfp-select-sm" value={filter.sortBy ?? ''} onChange={e => set('sortBy', e.target.value)}>
          <option value="">{t('miracles.sort_order')}</option>
          <option value="year">{t('miracles.sort_year')}</option>
          <option value="name">{t('miracles.sort_name')}</option>
          <option value="views">{t('miracles.sort_views')}</option>
        </select>
      </div>

      {/* Quick filters */}
      <div className="mfp-quick-row">
        {[
          { key:'isVisitable', label: t('miracles.visitable') },
          { key:'hasScientific', label: t('miracles.scientific') },
          { key:'hasVideo',    label: t('miracles.has_video') },
        ].map(({ key, label }) => (
          <button key={key}
            className={`mfp-quick ${(filter as any)[key] ? 'on' : ''}`}
            onClick={() => set(key as keyof MiracleFilter, !(filter as any)[key] || undefined)}>
            {label}
          </button>
        ))}
        {hasAny && (
          <button className="mfp-reset" onClick={() => setFilter({})}>
            {t('common.remove_filters')}
          </button>
        )}
      </div>
    </div>
  )
}
