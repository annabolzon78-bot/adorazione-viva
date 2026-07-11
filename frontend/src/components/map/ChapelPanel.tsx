import { useTranslation } from 'react-i18next'
import type { Chapel } from '../../types'

interface Props { chapel: Chapel; onClose: () => void }

const TYPE_LABEL: Record<string, string> = {
  PERPETUA:'Perpetua 24h', GIORNALIERA:'Giornaliera',
  SETTIMANALE:'Settimanale', MENSILE:'Mensile',
  OCCASIONALE:'Occasionale', ONLINE:'Online',
}

export function ChapelPanel({ chapel, onClose }: Props) {
  const { t } = useTranslation()

  const goo = `https://www.google.com/maps/dir/?api=1&destination=${chapel.lat},${chapel.lng}`
  const osm = `https://www.openstreetmap.org/?mlat=${chapel.lat}&mlon=${chapel.lng}&zoom=15`

  return (
    <div className="chapel-panel">
      {/* Header */}
      <div className="cp-header">
        <div>
          <div className="cp-name">{chapel.name}</div>
          {chapel.parish && <div className="cp-parish">{chapel.parish.name}</div>}
        </div>
        <button className="cp-close" onClick={onClose}>✕</button>
      </div>

      {/* Status */}
      <div className="cp-status-row">
        <span className={`cp-status ${chapel.isOpenNow ? 'open' : 'closed'}`}>
          {chapel.isOpenNow ? `● ${t('map.open_at')}` : `○ ${t('map.closed')}`}
        </span>
        {chapel.is24h && <span className="cp-tag">{t('common.always_open')}</span>}
        {chapel.hasLiveStream && <span className="cp-tag cp-tag-live">● Live</span>}
        {chapel.hasConfessions && <span className="cp-tag">{t('common.confessions')}</span>}
        {chapel.accessible && <span className="cp-tag">♿</span>}
      </div>

      {/* Tipo adorazione */}
      <div className="cp-section">
        <div className="cp-section-label">{t('map.adoration_type')}</div>
        <div className="cp-value">{TYPE_LABEL[chapel.adorationType] ?? chapel.adorationType}</div>
      </div>

      {/* Indirizzo */}
      {chapel.address && (
        <div className="cp-section">
          <div className="cp-section-label">{t('map.address')}</div>
          <div className="cp-value">{chapel.address}{chapel.city ? `, ${chapel.city}` : ''}</div>
        </div>
      )}

      {/* Contatti */}
      {(chapel.phone || chapel.email || chapel.websiteUrl) && (
        <div className="cp-section">
          <div className="cp-section-label">{t('map.contact', 'CONTATTI')}</div>
          {chapel.phone      && <div className="cp-contact">📞 {chapel.phone}</div>}
          {chapel.email      && <div className="cp-contact">✉️ {chapel.email}</div>}
          {chapel.websiteUrl && <a href={chapel.websiteUrl} target="_blank" rel="noopener noreferrer" className="cp-link">🌐 {t('common.website')}</a>}
        </div>
      )}

      {/* Navigazione */}
      <div className="cp-nav-row">
        <a href={goo} target="_blank" rel="noopener noreferrer" className="cp-nav-btn cp-nav-google">
          📍 {t('common.directions_google')}
        </a>
        <a href={osm} target="_blank" rel="noopener noreferrer" className="cp-nav-btn cp-nav-osm">
          🗺 {t('common.directions_osm')}
        </a>
      </div>

      {/* Pulsante principale */}
      <a href={goo} target="_blank" rel="noopener noreferrer" className="cp-portami">
        {t('map.portami')}
      </a>
    </div>
  )
}
