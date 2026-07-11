
import { useState } from 'react'
import type { Schedule } from '../../../hooks/useDashboard'
interface Props { schedules:Schedule[]; onAdd:(s:Omit<Schedule,'id'>)=>void; onRemove:(id:string)=>void; type?:'MASS'|'CONFESSION'|'ADORATION' }
const DAYS = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato']
const RITES = ['ROMANO','AMBROSIANO','TRIDENTINO','ORIENTALE','ALTRO']
const TYPE_LABELS: Record<string,string> = {MASS:'Messa',CONFESSION:'Confessioni',ADORATION:'Adorazione'}
export function ParishSchedules({ schedules, onAdd, onRemove, type='MASS' }: Props) {
  const [show,setShow] = useState(false)
  const [form,setForm] = useState({dayOfWeek:0,time:'08:00',startTime:'09:00',endTime:'12:00',rite:'ROMANO',notes:''})
  const f = (k:string,v:any) => setForm(p=>({...p,[k]:v}))
  const filtered = schedules.filter(s=>s.type===type)
  const save = () => {
    onAdd(type==='MASS' ? {type,dayOfWeek:+form.dayOfWeek,time:form.time,rite:form.rite,notes:form.notes||undefined}
      : {type,dayOfWeek:+form.dayOfWeek,startTime:form.startTime,endTime:form.endTime,notes:form.notes||undefined})
    setShow(false)
  }
  return (
    <div className="panel-wrap">
      <div className="panel-header-row">
        <div><h2 className="panel-title">{TYPE_LABELS[type]}</h2><p className="panel-sub">{filtered.length} orari</p></div>
        <button className="btn-primary" onClick={()=>setShow(true)}>+ Aggiungi</button>
      </div>
      {show && (
        <div className="form-card">
          <div className="form-title">Nuovo orario {TYPE_LABELS[type]}</div>
          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">GIORNO</label>
              <select className="form-select" value={form.dayOfWeek} onChange={e=>f('dayOfWeek',e.target.value)}>
                {DAYS.map((d,i)=><option key={i} value={i}>{d}</option>)}
              </select>
            </div>
            {type==='MASS' ? (
              <>
                <div className="form-field"><label className="form-label">ORA</label>
                <input className="form-input" type="time" value={form.time} onChange={e=>f('time',e.target.value)}/></div>
                <div className="form-field"><label className="form-label">RITO</label>
                <select className="form-select" value={form.rite} onChange={e=>f('rite',e.target.value)}>
                  {RITES.map(r=><option key={r}>{r}</option>)}</select></div>
              </>
            ) : (
              <>
                <div className="form-field"><label className="form-label">DALLE</label>
                <input className="form-input" type="time" value={form.startTime} onChange={e=>f('startTime',e.target.value)}/></div>
                <div className="form-field"><label className="form-label">ALLE</label>
                <input className="form-input" type="time" value={form.endTime} onChange={e=>f('endTime',e.target.value)}/></div>
              </>
            )}
            <div className="form-field form-field-full"><label className="form-label">NOTE</label>
            <input className="form-input" placeholder="Note opzionali..." value={form.notes} onChange={e=>f('notes',e.target.value)}/></div>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={save}>✓ Salva</button>
            <button className="btn-ghost" onClick={()=>setShow(false)}>Annulla</button>
          </div>
        </div>
      )}
      <div className="table-wrap">
        <table className="dash-table">
          <thead><tr><th>Giorno</th>{type==='MASS'?<><th>Ora</th><th>Rito</th></>:<><th>Dalle</th><th>Alle</th></>}<th>Note</th><th></th></tr></thead>
          <tbody>
            {filtered.length===0
              ? <tr><td colSpan={5} className="td-empty">Nessun orario configurato</td></tr>
              : filtered.map(s=>(
                <tr key={s.id}>
                  <td><span className="tag-day">{DAYS[s.dayOfWeek]}</span></td>
                  {type==='MASS' ? <><td className="td-mono">{s.time}</td><td><span className="tag-rite">{s.rite??'Romano'}</span></td></>
                    : <><td className="td-mono">{s.startTime}</td><td className="td-mono">{s.endTime}</td></>}
                  <td className="td-note">{s.notes??'—'}</td>
                  <td><button className="btn-icon-del" onClick={()=>onRemove(s.id)}>✕</button></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
