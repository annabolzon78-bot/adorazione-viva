import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function BottomNav() {
  const { t } = useTranslation()

  const NAV = [
    { to:'/',         icon:'❤️‍🔥', key:'nav.home'     },
    { to:'/trova',    icon:'🗺️',   key:'nav.trova'    },
    { to:'/live',     icon:'▶',    key:'nav.live'     },
    { to:'/miracoli', icon:'✝️',   key:'nav.miracoli' },
    { to:'/prega',    icon:'🙏',   key:'nav.prega'    },
    { to:'/comunita', icon:'👥',   key:'nav.comunita' },
  ]

  return (
    <nav className="bottom-nav">
      {NAV.map(({ to, icon, key }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `bn-item ${isActive ? 'bn-active' : ''}`}
        >
          <span className="bn-icon">{icon}</span>
          <span className="bn-label">{t(key)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
