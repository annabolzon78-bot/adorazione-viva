import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  const { t } = useTranslation()

  // Legge adoratori da store (fallback 18427)
  const [adorersNow] = [18427]

  return (
    <header className="app-header">
      <div className="ah-logo">
        <span style={{ fontSize:'1.4rem', animation:'hb 2s ease-in-out infinite' }}>❤️‍🔥</span>
        <div>
          <div className="ah-logo-name">Adorazione Viva</div>
          <div className="ah-tagline">{t('header.tagline')}</div>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div className="ah-stats">
          <div className="ah-stat">
            <strong>{adorersNow.toLocaleString()}</strong>
            {' '}{t('header.adorers_now')}
          </div>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  )
}
