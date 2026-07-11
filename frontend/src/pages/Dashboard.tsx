import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../components/dashboard/DashboardLayout'
import { ParishOverview }  from '../components/dashboard/parish/ParishOverview'
import { ParishSchedules } from '../components/dashboard/parish/ParishSchedules'
import { ParishEvents }    from '../components/dashboard/parish/ParishEvents'
import { ParishMessages }  from '../components/dashboard/parish/ParishMessages'
import { ParishStreaming }  from '../components/dashboard/parish/ParishStreaming'
import { DioceseParishes } from '../components/dashboard/diocese/DioceseParishes'
import { AdminOverview }   from '../components/dashboard/admin/AdminOverview'
import { AdminUsers }      from '../components/dashboard/admin/AdminUsers'
import { useDashboard }    from '../hooks/useDashboard'
import '../styles/dashboard.css'

export function Dashboard() {
  const navigate = useNavigate()
  const {
    user, stats, schedules, events, messages, parishes, loading,
    loginAs, addSchedule, removeSchedule, addEvent, updateEvent, removeEvent,
    markRead, verifyParish, suspendParish,
  } = useDashboard()

  const [tab, setTab] = useState('overview')

  useEffect(() => {
    // In dev senza token: mostra selettore ruolo
    if (!loading && !user && !localStorage.getItem('av_token')) {
      // Usa mock come parish admin in dev
      loginAs('PARISH_ADMIN')
    }
  }, [loading, user])

  if (loading || !user) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:12, background:'#faf8f5' }}>
      <span style={{ fontSize:'2rem' }}>❤️‍🔥</span>
      <span style={{ fontFamily:'Cinzel,serif', color:'#8b1a2a' }}>Caricamento dashboard...</span>
    </div>
  )

  const unread = messages.filter(m => !m.read).length

  const renderPanel = () => {
    // ── PARISH ──────────────────────────────────────────────────
    if (tab === 'overview')    return <ParishOverview stats={stats} user={user} onNavigate={setTab} />
    if (tab === 'schedules')   return <ParishSchedules schedules={schedules} onAdd={addSchedule} onRemove={removeSchedule} type="MASS" />
    if (tab === 'confessions') return <ParishSchedules schedules={schedules} onAdd={addSchedule} onRemove={removeSchedule} type="CONFESSION" />
    if (tab === 'adoration')   return <ParishSchedules schedules={schedules} onAdd={addSchedule} onRemove={removeSchedule} type="ADORATION" />
    if (tab === 'events')      return <ParishEvents events={events} onAdd={addEvent} onUpdate={updateEvent} onRemove={removeEvent} />
    if (tab === 'messages')    return <ParishMessages messages={messages} onMarkRead={markRead} />
    if (tab === 'streaming')   return <ParishStreaming />
    if (tab === 'profile')     return <ParishProfileStub user={user} />
    // ── DIOCESE ─────────────────────────────────────────────────
    if (tab === 'parishes')    return <DioceseParishes parishes={parishes} onVerify={verifyParish} onSuspend={suspendParish} />
    // ── ADMIN ───────────────────────────────────────────────────
    if (tab === 'dioceses')    return <AdminOverview stats={stats} onNavigate={setTab} />
    if (tab === 'users')       return <AdminUsers />
    if (tab === 'miracles')    return <AdminMiraclesStub />
    return <div className="panel-wrap"><div className="panel-header"><h2 className="panel-title">{tab}</h2></div><div className="panel-empty">Sezione in arrivo</div></div>
  }

  // ── Dev role switcher (solo quando non c'è token reale) ──────
  const showRoleSwitcher = !localStorage.getItem('av_token') || localStorage.getItem('av_token') === 'mock'

  return (
    <>
      {showRoleSwitcher && (
        <div style={{ background:'#fef3c7', borderBottom:'2px solid #f59e0b', padding:'6px 14px', fontSize:'.72rem', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontWeight:700, color:'#92400e' }}>🛠 MODALITÀ DEV</span>
          {(['PARISH_ADMIN','DIOCESE_ADMIN','SUPER_ADMIN'] as const).map(r => (
            <button key={r} onClick={() => { loginAs(r); setTab('overview') }}
              style={{ padding:'2px 8px', borderRadius:4, border:'1px solid #f59e0b', background: user.role===r?'#f59e0b':'white', cursor:'pointer', fontSize:'.68rem' }}>
              {r}
            </button>
          ))}
        </div>
      )}
      <DashboardLayout user={user} activeTab={tab} setActiveTab={setTab} unread={unread}>
        {renderPanel()}
      </DashboardLayout>
    </>
  )
}

function ParishProfileStub({ user }: { user: any }) {
  return (
    <div className="panel-wrap">
      <div className="panel-header"><h2 className="panel-title">Profilo Parrocchia</h2></div>
      <div className="form-card">
        <div className="form-grid">
          {[['Nome parrocchia', user.parish?.name ?? ''],['Città','Navan'],['Paese','Ireland'],['Email contatto','don.marco@stmarys.ie'],['Sito web','https://stmarysnavan.ie'],['Diocesi','Diocese of Meath']].map(([label,val])=>(
            <div key={label} className="form-field">
              <label className="form-label">{label.toUpperCase()}</label>
              <input className="form-input" defaultValue={val}/>
            </div>
          ))}
        </div>
        <div className="form-actions"><button className="btn-primary">✓ Salva modifiche</button></div>
      </div>
    </div>
  )
}

function AdminMiraclesStub() {
  return (
    <div className="panel-wrap">
      <div className="panel-header"><h2 className="panel-title">Moderazione Miracoli</h2><p className="panel-sub">Revisione e approvazione contenuti dell'enciclopedia</p></div>
      <div className="alert-banner alert-info">ℹ️ Il workflow di moderazione dei miracoli sarà disponibile nella prossima versione.</div>
      <div className="panel-empty">Nessun miracolo in attesa di revisione al momento.</div>
    </div>
  )
}
