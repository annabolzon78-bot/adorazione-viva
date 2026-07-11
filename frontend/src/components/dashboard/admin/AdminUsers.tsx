
import { useState } from 'react'
const MOCK_USERS = [
  { id:'u1', name:'Don Marco', email:'don.marco@stmarys.ie', role:'PARISH_ADMIN', status:'ACTIVE', createdAt:'2026-01-15', lastLogin:'2026-07-10' },
  { id:'u2', name:'Maria Rossi', email:'maria.rossi@gmail.com', role:'USER', status:'ACTIVE', createdAt:'2026-03-10', lastLogin:'2026-07-09' },
  { id:'u3', name:'Père Henri', email:'henri@notredame.fr', role:'PARISH_ADMIN', status:'ACTIVE', createdAt:'2025-11-20', lastLogin:'2026-07-08' },
  { id:'u4', name:'Test User', email:'test@test.com', role:'USER', status:'SUSPENDED', createdAt:'2026-05-01', lastLogin:'2026-06-01' },
]
const ROLE_LABELS: Record<string,string> = {USER:'Utente',PARISH_ADMIN:'Admin Parrocchia',DIOCESE_ADMIN:'Admin Diocesi',ADMIN:'Admin',SUPER_ADMIN:'Super Admin'}
export function AdminUsers() {
  const [users,setUsers] = useState(MOCK_USERS)
  const [search,setSearch] = useState('')
  const [roleFilter,setRoleFilter] = useState('ALL')
  const filtered = users.filter(u=>roleFilter==='ALL'||u.role===roleFilter).filter(u=>!search||u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase()))
  const suspend=(id:string)=>setUsers(p=>p.map(u=>u.id===id?{...u,status:u.status==='ACTIVE'?'SUSPENDED':'ACTIVE'}:u))
  return (
    <div className="panel-wrap">
      <div className="panel-header"><h2 className="panel-title">Utenti</h2><p className="panel-sub">{users.length} utenti registrati</p></div>
      <div className="filter-bar">
        <input className="filter-search" placeholder="Cerca utente..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <select className="form-select" style={{maxWidth:180}} value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}>
          <option value="ALL">Tutti i ruoli</option>
          {Object.entries(ROLE_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="table-wrap">
        <table className="dash-table">
          <thead><tr><th>Nome</th><th>Email</th><th>Ruolo</th><th>Stato</th><th>Ultimo accesso</th><th></th></tr></thead>
          <tbody>
            {filtered.map(u=>(
              <tr key={u.id}>
                <td className="td-bold">{u.name}</td>
                <td className="td-note">{u.email}</td>
                <td><span className="tag-rite">{ROLE_LABELS[u.role]}</span></td>
                <td><span className={`status-pill status-${u.status.toLowerCase()}`}>{u.status}</span></td>
                <td className="td-note">{new Date(u.lastLogin).toLocaleDateString('it-IT')}</td>
                <td><button className={u.status==='ACTIVE'?'btn-suspend':'btn-verify'} onClick={()=>suspend(u.id)}>{u.status==='ACTIVE'?'Sospendi':'Riattiva'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
