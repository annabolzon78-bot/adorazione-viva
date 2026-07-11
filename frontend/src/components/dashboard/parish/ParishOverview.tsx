
import type { DashStats, DashUser } from '../../../hooks/useDashboard'
interface Props { stats: DashStats; user: DashUser; onNavigate:(tab:string)=>void }
const CARDS = [
  { key:'adorersNow', label:'Adoratori ora',    icon:'❤️\u200d🔥', color:'#8b1a2a', tab:'adoration' },
  { key:'streams',    label:'Stream attivi',    icon:'▶',           color:'#c8a84b', tab:'streaming' },
  { key:'events',     label:'Eventi',           icon:'📅',          color:'#1e40af', tab:'events'    },
  { key:'masses',     label:'Messe settimanali',icon:'✝️',         color:'#166534', tab:'schedules' },
  { key:'chapels',    label:'Cappelle',         icon:'⛪',          color:'#7c3aed', tab:'overview'  },
  { key:'pendingMessages',label:'Messaggi da leggere',icon:'💬',   color:'#92400e', tab:'messages'  },
]
export function ParishOverview({ stats, user, onNavigate }: Props) {
  return (
    <div className="panel-wrap">
      <div className="panel-header">
        <h1 className="panel-title">Benvenuto, {user.name.split(' ')[0]} 👋</h1>
        <p className="panel-sub">{user.parish?.name}</p>
      </div>
      <div className="stats-grid">
        {CARDS.map(({key,label,icon,color,tab}) => (
          <div key={key} className="stat-card" onClick={()=>onNavigate(tab)} style={{'--card-color':color} as any}>
            <div className="sc-icon" style={{background:`${color}18`,color}}>{icon}</div>
            <div className="sc-value">{(stats as any)[key]??0}</div>
            <div className="sc-label">{label}</div>
          </div>
        ))}
      </div>
      <div className="panel-section-title">Azioni rapide</div>
      <div className="quick-actions">
        {[
          {label:'Aggiungi orario Messa',icon:'🕐',tab:'schedules'},
          {label:'Nuovo evento',icon:'📅',tab:'events'},
          {label:'Gestisci streaming',icon:'▶',tab:'streaming'},
          {label:'Rispondi messaggi',icon:'💬',tab:'messages'},
        ].map(({label,icon,tab}) => (
          <button key={tab} className="qa-btn" onClick={()=>onNavigate(tab)}>
            <span className="qa-icon">{icon}</span><span>{label}</span><span className="qa-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
