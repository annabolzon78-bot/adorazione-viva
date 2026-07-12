import { useState } from 'react'
import { MiracleCard }    from '../components/miracles/MiracleCard'
import { MiracleFilters } from '../components/miracles/MiracleFilters'
import { MiracleDetail }  from '../components/miracles/MiracleDetail'
import { useMiracles, type Miracle, type MiracleFilter } from '../hooks/useMiracles'
import '../styles/miracles.css'

export function Miracoli() {
  const [filter, setFilter]       = useState<MiracleFilter>({})
  const [selected, setSelected]   = useState<Miracle | null>(null)
  const { miracles, loading, total } = useMiracles(filter)

  const handleSelect = (m: Miracle) => { setSelected(m); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const handleClose  = () => setSelected(null)

  return (
    <div className="miracoli-page">
      {/* Header */}
      <div className="mp-header">
        <div className="mp-header-title">Miracoli Eucaristici</div>
        <div className="mp-header-sub">Testimonianze documentate nel corso dei secoli</div>
      </div>

      {/* Detail overlay */}
      {selected && (
        <div className="mp-detail-overlay">
          <MiracleDetail miracle={selected} slug={selected.slug} onClose={handleClose} />
        </div>
      )}

      {/* Filtri */}
      <MiracleFilters filter={filter} setFilter={setFilter} total={total} loading={loading} />

      {/* Grid, raggruppata per Paese nell'ordine della fonte ufficiale */}
      <div className="mp-body">
        {loading ? (
          <div className="mp-loading"><span>❤️‍🔥</span><span>Caricamento enciclopedia...</span></div>
        ) : miracles.length === 0 ? (
          <div className="mp-empty">
            <div className="mp-empty-ico">🕯</div>
            <div>Nessun miracolo trovato con questi filtri.</div>
            <button className="mp-empty-reset" onClick={() => setFilter({})}>Rimuovi filtri</button>
          </div>
        ) : (
          groupByCountry(miracles).map(([country, items]) => (
            <div key={country} className="mp-country-group">
              <div className="mp-country-title">{country}</div>
              <div className="mp-grid">
                {items.map(m => (
                  <MiracleCard key={m.id} miracle={m} onClick={handleSelect} selected={selected?.id === m.id} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/** Raggruppa mantenendo l'ordine di prima comparsa (= ordine della fonte ufficiale) */
function groupByCountry(miracles: Miracle[]): [string, Miracle[]][] {
  const order: string[] = []
  const groups = new Map<string, Miracle[]>()
  for (const m of miracles) {
    const key = m.country?.nameIt || 'Altro'
    if (!groups.has(key)) { groups.set(key, []); order.push(key) }
    groups.get(key)!.push(m)
  }
  return order.map(k => [k, groups.get(k)!])
}
