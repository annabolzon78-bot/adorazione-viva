import { useTranslation } from 'react-i18next'

interface StreamFilter {
  q?: string; status?: string; type?: string
  language?: string; continent?: string; featured?: boolean
}

interface Props { filter: StreamFilter; setFilter: (f: StreamFilter) => void; total?: number; loading?: boolean }

export function StreamFilters({ filter, setFilter }: Props) {
  const { t } = useTranslation()
  const set = (k: keyof StreamFilter, v: any) => setFilter({ ...filter, [k]: v || undefined })

  return (
    <div className="sf-panel">
      {/* Ricerca */}
      <div className="sf-search-row">
        <div className="sf-input-wrap">
          <span className="sf-ico">🔍</span>
          <input
            className="sf-input"
            placeholder={t('live.loading', 'Cerca stream...')}
            value={filter.q ?? ''}
            onChange={e => set('q', e.target.value)}
          />
          {filter.q && <button className="sf-clear" onClick={() => set('q', '')}>✕</button>}
        </div>
        <button
          className={`sf-featured ${filter.featured ? 'on' : ''}`}
          onClick={() => set('featured', !filter.featured)}>
          {t('live.featured', '★ In evidenza')}
        </button>
      </div>

      {/* Select filtri */}
      <div className="sf-row">
        <select className="sf-select" value={filter.status ?? ''} onChange={e => set('status', e.target.value)}>
          <option value="">{t('live.all_statuses', 'Tutti gli stati')}</option>
          <option value="ACTIVE">● {t('common.online', 'Live ora')}</option>
          <option value="OFFLINE">{t('common.offline', 'Offline')}</option>
          <option value="SCHEDULED">{t('common.scheduled', 'Programmato')}</option>
        </select>

        <select className="sf-select" value={filter.language ?? ''} onChange={e => set('language', e.target.value)}>
          <option value="">{t('live.all_languages', 'Tutte le lingue')}</option>
          <option value="IT">🇮🇹 Italiano</option>
          <option value="EN">🇬🇧 English</option>
          <option value="ES">🇪🇸 Español</option>
          <option value="FR">🇫🇷 Français</option>
          <option value="PT">🇵🇹 Português</option>
          <option value="PL">🇵🇱 Polski</option>
          <option value="DE">🇩🇪 Deutsch</option>
          <option value="AR">🇸🇦 عربي</option>
          <option value="ZH">🇨🇳 中文</option>
          <option value="JA">🇯🇵 日本語</option>
          <option value="KO">🇰🇷 한국어</option>
          <option value="LA">✝️ Latina</option>
        </select>

        <select className="sf-select" value={filter.continent ?? ''} onChange={e => set('continent', e.target.value)}>
          <option value="">{t('live.all_continents', 'Tutti i continenti')}</option>
          <option value="EUROPA">🌍 Europa</option>
          <option value="AMERICA_NORD">🌎 America del Nord</option>
          <option value="AMERICA_SUD">🌎 America del Sud</option>
          <option value="AFRICA">🌍 Africa</option>
          <option value="ASIA">🌏 Asia</option>
          <option value="OCEANIA">🌏 Oceania</option>
        </select>
      </div>
    </div>
  )
}
