import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { DashboardLayout }     from '../components/dashboard/DashboardLayout'
import { ParishOverview }      from '../components/dashboard/parish/ParishOverview'
import { ParishSchedules }     from '../components/dashboard/parish/ParishSchedules'
import { ParishEvents }        from '../components/dashboard/parish/ParishEvents'
import { ParishMessages }      from '../components/dashboard/parish/ParishMessages'
import { ParishStreaming }      from '../components/dashboard/parish/ParishStreaming'
import { DioceseParishes }     from '../components/dashboard/diocese/DioceseParishes'
import { AdminOverview }       from '../components/dashboard/admin/AdminOverview'
import { AdminUsers }          from '../components/dashboard/admin/AdminUsers'
import { useDashboard }        from '../hooks/useDashboard'
import type { UserRole }       from '../hooks/useDashboard'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import '../styles/dashboard.css'

export function Dashboard() {
  const navigate = useNavigate()
  const {
    user, stats, schedules, events, messages, parishes,
    loading, isDemoMode,
    loginAs, addSchedule, removeSchedule,
    addEvent, updateEvent, removeEvent,
    markRead, verifyParish, suspendParish,
  } = useDashboard()

  const [tab, setTab] = useState('overview')

  // Redirect a /login se Supabase è configurato ma non c'è sessione
  useEffect(() => {
    if (!loading && !user && isSupabaseConfigured()) {
      navigate('/login', { replace: true })
    }
  }, [loading, user, navigate])

  // Dev only: selettore ruolo (import.meta.env.DEV = false in prod)
  const isDev = (import.meta as any).env?.DEV ?? false

  if (loading || !user) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:12, background:'#faf8f5' }}>
      <span style={{ fontSize:'2rem' }}>❤️‍🔥</span>
      <span style={{ fontFamily:'Cinzel,serif', color:'#8b1a2a' }}>
        {isSupabaseConfigured() ? 'Verifica sessione...' : 'Caricamento dashboard...'}
      </span>
    </div>
  )

  const unread = messages.filter(m => !m.read).length

  const renderPanel = () => {
    if (tab === 'overview')    return <ParishOverview stats={stats} user={user} onNavigate={setTab} />
    if (tab === 'schedules')   return <ParishSchedules schedules={schedules} onAdd={addSchedule} onRemove={removeSchedule} type="MASS" />
    if (tab === 'confessions') return <ParishSchedules schedules={schedules} onAdd={addSchedule} onRemove={removeSchedule} type="CONFESSION" />
    if (tab === 'adoration')   return <ParishSchedules schedules={schedules} onAdd={addSchedule} onRemove={removeSchedule} type="ADORATION" />
    if (tab === 'events')      return <ParishEvents events={events} onAdd={addEvent} onUpdate={updateEvent} onRemove={removeEvent} />
    if (tab === 'messages')    return <ParishMessages messages={messages} onMarkRead={markRead} />
    if (tab === 'streaming')   return <ParishStreaming />
    if (tab === 'profile')     return <ParishProfilePanel user={user} />
    if (tab === 'parishes')    return <DioceseParishes parishes={parishes} onVerify={verifyParish} onSuspend={suspendParish} />
    if (tab === 'dioceses')    return <AdminOverview stats={stats} onNavigate={setTab} />
    if (tab === 'users')       return <AdminUsers />
    if (tab === 'miracles')    return <ModerationNotAvailable />
    return <div className="panel-wrap"><div className="panel-empty">Sezione in arrivo</div></div>
  }

  return (
    <>
      {/* Banner DEMO — visibile solo se dati non reali */}
      {isDemoMode && (
        <div style={{ background:'#fef3c7', borderBottom:'2px solid #f59e0b', padding:'6px 14px', fontSize:'.72rem', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <span style={{ fontWeight:700, color:'#92400e' }}>⚠️ [DEMO] Dati simulati</span>
          <span style={{ color:'#92400e' }}>— Completa la configurazione Supabase per vedere i dati reali.</span>
          {/* Switcher ruolo: SOLO in development */}
          {isDev && (
            <span style={{ marginLeft:'auto', display:'flex', gap:4 }}>
              {(['PARISH_ADMIN','DIOCESE_ADMIN','SUPER_ADMIN'] as UserRole[]).map(r => (
                <button key={r} onClick={() => { loginAs(r); setTab('overview') }}
                  style={{ padding:'2px 8px', borderRadius:4, border:'1px solid #f59e0b', background: user.role===r?'#f59e0b':'white', cursor:'pointer', fontSize:'.68rem' }}>
                  {r.replace('_ADMIN','').replace('SUPER_','S.')}
                </button>
              ))}
            </span>
          )}
        </div>
      )}
      <DashboardLayout user={user} activeTab={tab} setActiveTab={setTab} unread={unread}>
        {renderPanel()}
      </DashboardLayout>
    </>
  )
}

function ParishProfilePanel({ user }: { user: any }) {
  return (
    <div className="panel-wrap">
      <div className="panel-header"><h2 className="panel-title">Profilo Parrocchia</h2></div>
      <div className="form-card">
        <div className="form-grid">
          {[
            ['Nome parrocchia', user.parish?.name ?? ''],
            ['Email contatto', user.email],
          ].map(([label, val]) => (
            <div key={label} className="form-field">
              <label className="form-label">{label.toUpperCase()}</label>
              <input className="form-input" defaultValue={val} />
            </div>
          ))}
        </div>
        <div className="form-actions"><button className="btn-primary">✓ Salva modifiche</button></div>
      </div>
    </div>
  )
}

function ModerationNotAvailable() {
  return (
    <div className="panel-wrap">
      <div className="panel-header">
        <h2 className="panel-title">Moderazione Miracoli</h2>
        <p className="panel-sub">Workflow di revisione contenuti</p>
      </div>
      <div className="alert-banner alert-info">
        ℹ️ Disponibile dopo configurazione Supabase. Richiede la tabella <code>eucharistic_miracles</code> e RLS policy per MODERATOR.
      </div>
    </div>
  )
}
