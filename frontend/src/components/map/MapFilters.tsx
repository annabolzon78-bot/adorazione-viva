import { useTranslation } from 'react-i18next'
import type { MapFilter } from '../../types'

interface Props {
  filter:    MapFilter
  setFilter: (f: MapFilter) => void
  total:     number
  loading:   boolean
}

export function MapFilters({ filter, setFilter, total, loading }: Props) {
  const { t } = useTranslation()
  const set = (k: keyof MapFilter, v: any) => setFilter({ ...filter, [k]: v || undefined })
  const hasAny = Object.values(filter).some(v => v !== undefined && v !== '')

  const TYPES = [
    { value:'',           label: t('map.all_types', 'Tutte') },
    { value:'PERPETUA',   label: t('common.perpetual', 'Perpetua') },
    { value:'GIORNALIERA',label: t('common.daily', 'Giornaliera') },
    { value:'SETTIMANALE',label: t('common.weekly', 'Settimanale') },
    { value:'MENSILE',    label: t('common.monthly', 'Mensile') },
    { value:'OCCASIONALE',label: t('common.occasional', 'Occasionale') },
    { value:'ONLINE',     label: t('common.online', 'Online') },
  ]

  return (
    <div className="mf-panel">
      {/* Contatore */}
      <div className="mfp-count">
        {loading
          ? t('map.loading', 'Caricamento...')
          : <><strong>{total}</strong> {t('map.chapels', 'cappelle')}</>
        }
      </div>

      {/* Tipo adorazione */}
      <div className="mfp-row">
        <select className="mfp-select"
          value={filter.type ?? ''}
          onChange={e => set('type', e.target.value as any)}>
          {TYPES.map(({ value, label }) =>
            <option key={value} value={value}>{label}</option>
          )}
        </select>
      </div>

      {/* Filtri rapidi */}
      <div className="mfp-quick-row">
        {[
          { key:'openNow',       label: t('common.open_now', 'Aperta ora') },
          { key:'has24h',        label: t('common.always_open', '24h') },
          { key:'hasLive',       label: t('common.live_stream', 'Live') },
          { key:'hasConfessions',label: t('common.confessions', 'Confessioni') },
        ].map(({ key, label }) => (
          <button key={key}
            className={`mfp-quick ${(filter as any)[key] ? 'on' : ''}`}
            onClick={() => set(key as keyof MapFilter, !(filter as any)[key] || undefined)}>
            {label}
          </button>
        ))}
        {hasAny && (
          <button className="mfp-reset"
            onClick={() => setFilter({})}>
            {t('common.remove_filters', 'Rimuovi filtri')}
          </button>
        )}
      </div>
    </div>
  )
}
