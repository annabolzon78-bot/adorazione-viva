import { useTranslation } from 'react-i18next'
import type { StreamData } from '../../hooks/useStreams'

interface Props {
  stream: StreamData
  isSelected: boolean
  onClick: (s: StreamData) => void
}

const TYPE_ICON: Record<string, string> = {
  YOUTUBE_LIVE:'▶', YOUTUBE_CHANNEL:'📺', VIMEO:'🎬',
  HLS:'📡', FACEBOOK_LIVE:'📘', TWITCH:'🎮', CUSTOM_EMBED:'🖥',
}

const LANG_FLAG: Record<string, string> = {
  IT:'🇮🇹', EN:'🇬🇧', ES:'🇪🇸', FR:'🇫🇷', DE:'🇩🇪',
  PT:'🇵🇹', PL:'🇵🇱', LA:'✝️', AR:'🇸🇦', ZH:'🇨🇳',
  JA:'🇯🇵', KO:'🇰🇷', OTHER:'🌐',
}

export function StreamCard({ stream, isSelected, onClick }: Props) {
  const { t } = useTranslation()

  return (
    <div className={`stream-card ${isSelected ? 'selected' : ''}`} onClick={() => onClick(stream)}>
      {/* Thumbnail o placeholder */}
      <div className="sc-thumb">
        {stream.thumbnailUrl
          ? <img src={stream.thumbnailUrl} alt={stream.title} className="sc-thumb-img" />
          : <div className="sc-thumb-placeholder">{TYPE_ICON[stream.type] ?? '▶'}</div>
        }
        {stream.status === 'ACTIVE' && (
          <span className="sc-live-badge">● {t('live.live_now')}</span>
        )}
        {stream.isFeatured && <span className="sc-featured">★</span>}
      </div>

      {/* Info */}
      <div className="sc-body">
        <div className="sc-title">{stream.title}</div>
        <div className="sc-meta">
          <span>{LANG_FLAG[stream.language] ?? '🌐'} {stream.language}</span>
          {stream.viewerCount && (
            <span> · {stream.viewerCount} {t('live.viewers')}</span>
          )}
        </div>
        {stream.description && (
          <div className="sc-desc">{stream.description.slice(0, 80)}{stream.description.length > 80 ? '…' : ''}</div>
        )}
      </div>
    </div>
  )
}
