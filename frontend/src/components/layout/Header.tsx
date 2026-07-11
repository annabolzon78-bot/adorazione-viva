import { useTranslation }  from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useAdoration }    from '../../hooks/useAdoration'

export function Header() {
  const { t }    = useTranslation()
  const { stats } = useAdoration()

  return (
    <header className="app-header">
      <div className="ah-logo">
        <span style={{ fontSize:'1.4rem' }}>❤️‍🔥</span>
        <div>
          <div className="ah-logo-name">Adorazione Eucaristica</div>
          <div className="ah-tagline">{t('header.tagline')}</div>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {!stats.isLoading && (
          <div className="ah-stats">
            <div className="ah-stat">
              <strong>{stats.total.toLocaleString()}</strong>
              {' '}{t('header.adorers_now')}
              {stats.isDemo && <span style={{ fontSize:'.55rem', color:'#f59e0b', marginLeft:3 }}>[DEMO]</span>}
            </div>
          </div>
        )}
        <LanguageSwitcher />
      </div>
    </header>
  )
}
