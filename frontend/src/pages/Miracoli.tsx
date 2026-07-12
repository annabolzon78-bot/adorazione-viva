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

      {/* Grid */}
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
          <div className="mp-grid">
            {miracles.map(m => (
              <MiracleCard key={m.id} miracle={m} onClick={handleSelect} selected={selected?.id === m.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
