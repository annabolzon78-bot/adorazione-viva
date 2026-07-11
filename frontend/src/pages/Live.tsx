import { useState } from 'react'
import { StreamCard }    from '../components/streaming/StreamCard'
import { StreamFilters } from '../components/streaming/StreamFilters'
import { StreamPlayer }  from '../components/streaming/StreamPlayer'
import { useStreams, type StreamData, type StreamFilter } from '../hooks/useStreams'
import '../styles/streaming.css'

export function Live() {
  const [filter, setFilter]           = useState<StreamFilter>({})
  const [selected, setSelected]       = useState<StreamData | null>(null)

  const { streams, loading, total } = useStreams(filter)

  // Featured in cima
  const featured = streams.filter(s => s.isFeatured && s.status === 'ACTIVE')
  const rest      = streams.filter(s => !s.isFeatured || s.status !== 'ACTIVE')

  return (
    <div className="live-page">

      {/* ── HEADER ── */}
      <div className="live-header">
        <div className="lh-left">
          <div className="lh-title">❤️‍🔥 Adorazione Eucaristica</div>
          <div className="lh-sub">Streaming in diretta da tutto il mondo</div>
        </div>
        <button
          className="lh-parish-btn"
          onClick={() => {}}
          title="Gestisci i tuoi stream"
        >
          📡 La mia parrocchia
        </button>
      </div>

      {/* ── PLAYER PRINCIPALE ── */}
      {selected ? (
        <div className="live-player-section">
          <div className="lps-info-row">
            <div>
              <div className="lps-title">{selected.title}</div>
              <div className="lps-location">
                {(selected.parish ?? selected.chapel)?.country?.flagEmoji} {' '}
                {(selected.parish ?? selected.chapel)?.name} · {' '}
                {(selected.parish ?? selected.chapel)?.city?.name}
              </div>
            </div>
            <button className="lps-close" onClick={() => setSelected(null)}>✕ Chiudi</button>
          </div>
          <StreamPlayer stream={selected} autoplay />
          {selected.description && (
            <div className="lps-desc">{selected.description}</div>
          )}
          {/* Orari */}
          {selected.schedules.length > 0 && (
            <div className="lps-schedules">
              <div className="lps-sch-title">ORARI STREAMING</div>
              <div className="lps-sch-list">
                {selected.schedules.map(s => {
                  const days = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab']
                  return (
                    <div key={s.id} className="lps-sch-item">
                      {s.dayOfWeek != null ? days[s.dayOfWeek] : 'Data specifica'}{' '}
                      {s.startTime}–{s.endTime}
                      <span className="lps-tz">{s.timezone}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {/* Link esterni */}
          <div className="lps-links">
            <a href={selected.url} target="_blank" rel="noopener noreferrer" className="lps-ext-link">
              Apri sorgente ↗
            </a>
            {selected.websiteUrl && (
              <a href={selected.websiteUrl} target="_blank" rel="noopener noreferrer" className="lps-ext-link">
                Sito web ↗
              </a>
            )}
          </div>
        </div>
      ) : (
        /* Featured streams */
        featured.length > 0 && (
          <div className="live-featured-section">
            <div className="lfs-label">★ IN DIRETTA ORA</div>
            <div className="lfs-grid">
              {featured.slice(0, 2).map(stream => (
                <div key={stream.id} className="lfs-item" onClick={() => setSelected(stream)}>
                  <StreamPlayer stream={stream} autoplay={false} />
                  <div className="lfs-overlay">
                    <div className="lfs-name">{stream.title}</div>
                    <div className="lfs-play">▶ Guarda</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* ── FILTRI ── */}
      <StreamFilters filter={filter} setFilter={setFilter} total={total} loading={loading} />

      {/* ── GRIGLIA STREAM ── */}
      <div className="live-grid-section">
        {loading ? (
          <div className="live-loading">
            <span>❤️‍🔥</span>
            <span>Caricamento stream...</span>
          </div>
        ) : streams.length === 0 ? (
          <div className="live-empty">
            <div className="live-empty-ico">📡</div>
            <div className="live-empty-text">Nessuno stream trovato con questi filtri.</div>
            <button className="live-empty-reset" onClick={() => setFilter({})}>Rimuovi filtri</button>
          </div>
        ) : (
          <div className="live-grid">
            {(selected ? rest : streams).map(stream => (
              <StreamCard
                key={stream.id}
                stream={stream}
                onClick={(s) => setSelected(s)}
                isSelected={selected?.id === stream.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
