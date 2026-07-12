import { useState } from 'react'
import type { Miracle } from '../../hooks/useMiracles'

interface Props { miracle: Miracle; onClick: (m: Miracle) => void; selected: boolean }

// Foto generica di un ostensorio, usata come sfondo quando il singolo
// miracolo non ha ancora una foto dedicata verificata.
// Fonte: Wikimedia Commons, licenza CC-BY-SA 3.0, autore PerfectUnityOrg.
const GENERIC_PHOTO = 'https://upload.wikimedia.org/wikipedia/commons/6/62/Eucharistic_Adoration_-_Monstrance.jpg'

/**
 * Stato ecclesiale del miracolo, derivato dai dati disponibili — non è
 * una "classifica" o un giudizio di autenticità, solo la categoria che
 * meglio descrive cosa si sa di questo caso specifico.
 */
function deriveStatus(m: Miracle): { label: string; tone: string } {
  if (m.recognizedBy) return { label: 'Riconosciuto dall\'autorità ecclesiastica', tone: '#8b1a2a' }
  if (m.scientificAnalysis || m.analyzedBy) return { label: 'Oggetto di analisi', tone: '#1e40af' }
  if (m.year && m.year < 1900) return { label: 'Documentato storicamente', tone: '#92400e' }
  return { label: 'Tradizione locale', tone: '#6b6258' }
}

function MiracleThumb({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  const useGeneric = !src || failed
  return (
    <img
      src={useGeneric ? GENERIC_PHOTO : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="mc-card-img"
    />
  )
}

export function MiracleCard({ miracle: m, onClick, selected }: Props) {
  const status = deriveStatus(m)

  return (
    <div className={`mc-card ${selected ? 'mc-selected' : ''}`} onClick={() => onClick(m)}>
      {/* Immagine */}
      <div className="mc-card-thumb">
        <MiracleThumb src={m.imageUrl} alt={`${m.title} — luogo del miracolo eucaristico`} />
        <div className="mc-card-badge" style={{ background: status.tone }}>
          {status.label}
        </div>
        {m.isVisitableToday && (
          <div className="mc-card-visit">Visitabile oggi</div>
        )}
      </div>

      {/* Info */}
      <div className="mc-card-body">
        <div className="mc-card-title">{m.title}</div>
        <div className="mc-card-loc">
          <span>{m.country?.flagEmoji}</span>
          <span>{m.location || m.city}</span>
          {m.country && <span className="mc-card-state">{(m.country as any).nameIt ?? ''}</span>}
          {(m.year || m.yearCa) && (
            <span className="mc-card-cont">
              {m.yearCa ?? m.year}
            </span>
          )}
        </div>
        <div className="mc-card-summary">
          {m.summary?.slice(0, 130)}{(m.summary?.length ?? 0) > 130 ? '…' : ''}
        </div>
        {m.sourceUrl && m.summary?.startsWith('Miracolo eucaristico elencato') && (
          <a
            href={m.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="mc-card-source"
          >
            Scheda ufficiale ↗
          </a>
        )}
        {m.sourceUrl && m.summary?.startsWith('Testimonianza legata') && (
          <a
            href={m.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="mc-card-source"
          >
            Scheda ufficiale ↗
          </a>
        )}
      </div>
    </div>
  )
}
