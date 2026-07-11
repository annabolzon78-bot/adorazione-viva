
interface Props { stats:any; onNavigate:(tab:string)=>void }
const GLOBAL_STATS = [
  { label:'Cappelle nel mondo', value:'4.218', icon:'⛪', color:'#7c3aed' },
  { label:'Parrocchie registrate', value:'847', icon:'🏛', color:'#1e40af' },
  { label:'Adoratori ora', value:'18.427', icon:'❤️\u200d🔥', color:'#8b1a2a' },
  { label:'Stream attivi', value:'312', icon:'▶', color:'#c8a84b' },
  { label:'Utenti registrati', value:'12.841', icon:'👥', color:'#166534' },
  { label:'Miracoli nel database', value:'154', icon:'🌟', color:'#92400e' },
]
const PENDING = [
  { label:'Parrocchie da verificare', value:3, tab:'parishes', urgent:true },
  { label:'Miracoli da revisionare', value:8, tab:'miracles', urgent:false },
  { label:'Streaming da approvare', value:2, tab:'streaming', urgent:false },
]
export function AdminOverview({ stats, onNavigate }: Props) {
  return (
    <div className="panel-wrap">
      <div className="panel-header">
        <h1 className="panel-title">🌍 Pannello Amministratore Mondiale</h1>
        <p className="panel-sub">Gestione globale della piattaforma Adorazione Eucaristica</p>
      </div>
      <div className="stats-grid">
        {GLOBAL_STATS.map(({label,value,icon,color})=>(
          <div key={label} className="stat-card" style={{'--card-color':color} as any}>
            <div className="sc-icon" style={{background:`${color}18`,color}}>{icon}</div>
            <div className="sc-value">{value}</div>
            <div className="sc-label">{label}</div>
          </div>
        ))}
      </div>
      <div className="panel-section-title">Azioni in sospeso</div>
      {PENDING.map(({label,value,tab,urgent})=>(
        <div key={tab} className={`pending-row ${urgent?'urgent':''}`} onClick={()=>onNavigate(tab)}>
          <div className="pd-left">
            {urgent && <span className="pd-urgent">!</span>}
            <span>{label}</span>
          </div>
          <div className="pd-right">
            <span className="pd-count">{value}</span>
            <span className="qa-arrow">→</span>
          </div>
        </div>
      ))}
    </div>
  )
}
