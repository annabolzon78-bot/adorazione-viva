
import { useState } from 'react'
interface Parish { id:string; name:string; city:string; country:string; status:string; admin:string; chapels:number; verifiedAt:string|null }
interface Props { parishes:Parish[]; onVerify:(id:string)=>void; onSuspend:(id:string)=>void }
const STATUS_COLOR: Record<string,string> = { VERIFIED:'#166534', PENDING:'#92400e', SUSPENDED:'#7f1d1d' }
const STATUS_BG:    Record<string,string> = { VERIFIED:'#dcfce7', PENDING:'#fef3c7', SUSPENDED:'#fee2e2' }
export function DioceseParishes({ parishes, onVerify, onSuspend }: Props) {
  const [filter,setFilter] = useState('ALL')
  const [search,setSearch] = useState('')
  const filtered = parishes
    .filter(p => filter==='ALL' || p.status===filter)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase()))
  const counts = { ALL:parishes.length, PENDING:parishes.filter(p=>p.status==='PENDING').length, VERIFIED:parishes.filter(p=>p.status==='VERIFIED').length, SUSPENDED:parishes.filter(p=>p.status==='SUSPENDED').length }
  return (
    <div className="panel-wrap">
      <div className="panel-header">
        <h2 className="panel-title">Parrocchie nella diocesi</h2>
        <p className="panel-sub">{counts.ALL} parrocchie · {counts.PENDING} in attesa di verifica</p>
      </div>
      {counts.PENDING>0 && (
        <div className="alert-banner alert-warning">
          ⚠️ {counts.PENDING} parrocchie in attesa di verifica
        </div>
      )}
      <div className="filter-bar">
        <input className="filter-search" placeholder="Cerca parrocchia..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <div className="filter-tabs">
          {Object.entries(counts).map(([k,v])=>(
            <button key={k} className={`filter-tab ${filter===k?'active':''}`} onClick={()=>setFilter(k)}>
              {k==='ALL'?'Tutte':k} <span className="filter-count">{v}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="parishes-list">
        {filtered.length===0
          ? <div className="panel-empty">Nessuna parrocchia trovata</div>
          : filtered.map(p=>(
            <div key={p.id} className="parish-row">
              <div className="pr-main">
                <div className="pr-name">{p.name}</div>
                <div className="pr-meta">{p.city}, {p.country} · {p.chapels} cappell{p.chapels===1?'a':'e'} · Admin: {p.admin}</div>
                {p.verifiedAt && <div className="pr-date">Verificata il {new Date(p.verifiedAt).toLocaleDateString('it-IT')}</div>}
              </div>
              <div className="pr-right">
                <span className="status-pill" style={{background:STATUS_BG[p.status],color:STATUS_COLOR[p.status]}}>{p.status}</span>
                <div className="pr-actions">
                  {p.status==='PENDING' && <button className="btn-verify" onClick={()=>onVerify(p.id)}>✓ Verifica</button>}
                  {p.status==='VERIFIED' && <button className="btn-suspend" onClick={()=>onSuspend(p.id)}>Sospendi</button>}
                  {p.status==='SUSPENDED' && <button className="btn-verify" onClick={()=>onVerify(p.id)}>Riattiva</button>}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
