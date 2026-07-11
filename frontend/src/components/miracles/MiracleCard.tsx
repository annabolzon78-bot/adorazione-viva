import { useTranslation } from 'react-i18next'
import type { Miracle } from '../../hooks/useMiracles'

interface Props { miracle: Miracle; onClick: (m: Miracle) => void; selected: boolean }

const LEVEL_COLOR: Record<string, string> = {
  SCIENTIFICO:'#166534', PONTIFICIO:'#8b1a2a',
  DIOCESANO:'#1e40af',   STORICO:'#92400e',
}

export function MiracleCard({ miracle: m, onClick, selected }: Props) {
  const { t } = useTranslation()

  const levelKey = `miracles.level_${m.verificationLevel?.toLowerCase() ?? 'historical'}`
  const levelLabel = t(levelKey, m.verificationLevel)
  const levelColor = LEVEL_COLOR[m.verificationLevel] ?? '#6b7280'

  return (
    <div className={`mc-card ${selected ? 'mc-selected' : ''}`} onClick={() => onClick(m)}>
      {/* Immagine */}
      <div className="mc-card-thumb">
        {m.imageUrl
          ? <img src={m.imageUrl} alt={m.title} className="mc-card-img" />
          : <div className="mc-card-placeholder">❤️‍🔥</div>
        }
        <div className="mc-card-badge" style={{ background: levelColor }}>
          {levelLabel}
        </div>
        {m.isVisitableToday && (
          <div className="mc-card-visit">{t('miracles.visitable_badge')}</div>
        )}
      </div>

      {/* Info */}
      <div className="mc-card-body">
        <div className="mc-card-title">{m.title}</div>
        <div className="mc-card-loc">
          <span>{m.country?.flagEmoji}</span>
          <span>{m.location || m.city}</span>
          {m.country && <span className="mc-card-state">{(m.country as any).nameIt ?? (m.country as any).nameEn ?? ''}</span>}
          {(m.year || m.yearCa) && (
            <span className="mc-card-cont">
              {m.yearCa ?? m.year}
            </span>
          )}
        </div>
        <div className="mc-card-summary">
          {m.summary?.slice(0, 100)}{(m.summary?.length ?? 0) > 100 ? '…' : ''}
        </div>
        <div className="mc-card-counts">
          {(m.images?.length ?? 0) > 0 && <span>🖼 {m.images!.length}</span>}
          {(m.videos?.length ?? 0) > 0 && <span>▶ {m.videos!.length}</span>}
          {(m.documents?.length ?? 0) > 0 && <span>📄 {m.documents!.length}</span>}
        </div>
      </div>
    </div>
  )
}
