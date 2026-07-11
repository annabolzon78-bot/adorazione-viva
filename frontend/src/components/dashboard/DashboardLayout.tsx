import { supabase } from '../../lib/supabase'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { DashUser, UserRole } from '../../hooks/useDashboard'

interface NavItem { id: string; icon: string; label: string; roles: UserRole[] }

const NAV: NavItem[] = [
  { id:'overview',    icon:'📊', label:'Panoramica',         roles:['PARISH_ADMIN','DIOCESE_ADMIN','ADMIN','SUPER_ADMIN'] },
  { id:'schedules',   icon:'🕐', label:'Orari Messe',        roles:['PARISH_ADMIN','ADMIN','SUPER_ADMIN'] },
  { id:'adoration',   icon:'❤️\u200d🔥', label:'Adorazione', roles:['PARISH_ADMIN','ADMIN','SUPER_ADMIN'] },
  { id:'confessions', icon:'✝️', label:'Confessioni',        roles:['PARISH_ADMIN','ADMIN','SUPER_ADMIN'] },
  { id:'streaming',   icon:'▶',  label:'Streaming',          roles:['PARISH_ADMIN','ADMIN','SUPER_ADMIN'] },
  { id:'events',      icon:'📅', label:'Eventi',             roles:['PARISH_ADMIN','ADMIN','SUPER_ADMIN'] },
  { id:'messages',    icon:'💬', label:'Messaggi',           roles:['PARISH_ADMIN','ADMIN','SUPER_ADMIN'] },
  { id:'parishes',    icon:'⛪', label:'Parrocchie',         roles:['DIOCESE_ADMIN','ADMIN','SUPER_ADMIN'] },
  { id:'dioceses',    icon:'🏛', label:'Diocesi',            roles:['ADMIN','SUPER_ADMIN'] },
  { id:'users',       icon:'👥', label:'Utenti',             roles:['ADMIN','SUPER_ADMIN'] },
  { id:'profile',     icon:'⚙️', label:'Profilo Parrocchia', roles:['PARISH_ADMIN'] },
]

interface Props { user: DashUser; activeTab: string; setActiveTab: (t:string)=>void; unread?:number; children: ReactNode }

export function DashboardLayout({ user, activeTab, setActiveTab, unread=0, children }: Props) {
  const navigate = useNavigate()
  const [sideOpen, setSideOpen] = useState(false)
  const visible = NAV.filter(n => n.roles.includes(user.role))
  const roleLabel: Record<UserRole,string> = {
    USER:'Utente', PARISH_ADMIN:'Admin Parrocchia',
    DIOCESE_ADMIN:'Admin Diocesi', MODERATOR:'Moderatore', ADMIN:'Amministratore', SUPER_ADMIN:'Super Admin'
  }
  return (
    <div className="dash-root">
      <aside className={`dash-sidebar ${sideOpen?'open':''}`}>
        <div className="ds-brand">
          <span style={{fontSize:'1.4rem'}}>❤️\u200d🔥</span>
          <div><div className="ds-brand-name">Adorazione Viva</div><div className="ds-brand-sub">Dashboard</div></div>
          <button className="ds-close" onClick={()=>setSideOpen(false)}>✕</button>
        </div>
        <div className="ds-user-card">
          <div className="ds-avatar">{user.name.charAt(0)}</div>
          <div><div className="ds-user-name">{user.name}</div>
          <span className="ds-role-badge">{roleLabel[user.role]}</span></div>
        </div>
        {user.parish && (
          <div className="ds-context">
            <span>⛪</span>
            <div>
              <div className="ds-context-name">{user.parish.name}</div>
              <span className={`ds-status ds-status-${user.parish.status.toLowerCase()}`}>{user.parish.status}</span>
            </div>
          </div>
        )}
        {user.diocese && <div className="ds-context"><span>🏛</span><div className="ds-context-name">{user.diocese.name}</div></div>}
        <nav className="ds-nav">
          {visible.map(item => (
            <button key={item.id} className={`ds-nav-item ${activeTab===item.id?'active':''}`}
              onClick={()=>{setActiveTab(item.id);setSideOpen(false)}}>
              <span className="ds-nav-icon">{item.icon}</span>
              <span className="ds-nav-label">{item.label}</span>
              {item.id==='messages' && unread>0 && <span className="ds-nav-badge">{unread}</span>}
            </button>
          ))}
        </nav>
        <div className="ds-footer">
          <button className="ds-footer-btn" onClick={()=>navigate('/')}>← App</button>
          <button className="ds-footer-btn ds-footer-logout" onClick={async()=>{await supabase.auth.signOut();navigate('/')}}>Esci</button>
        </div>
      </aside>
      {sideOpen && <div className="dash-overlay" onClick={()=>setSideOpen(false)}/>}
      <main className="dash-main">
        <div className="dash-topbar">
          <button className="dt-menu-btn" onClick={()=>setSideOpen(true)}>☰</button>
          <span className="dt-title">{visible.find(n=>n.id===activeTab)?.icon} {visible.find(n=>n.id===activeTab)?.label}</span>
          <div className="dt-user-mini">{user.name.charAt(0)}</div>
        </div>
        <div className="dash-content">{children}</div>
      </main>
    </div>
  )
}