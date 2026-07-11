
import { useState } from 'react'
import type { ParishEvent } from '../../../hooks/useDashboard'
interface Props { events:ParishEvent[]; onAdd:(e:Omit<ParishEvent,'id'|'slug'>)=>void; onUpdate:(id:string,d:Partial<ParishEvent>)=>void; onRemove:(id:string)=>void }
const TYPES = ['MESSA SPECIALE','VEGLIA','RITIRO','PELLEGRINAGGIO','CONCERTO SACRO','CONFERENZA','ALTRO']
const EMPTY = {title:'',type:'VEGLIA',startDate:'',endDate:'',description:'',isPublished:false,isFeatured:false,isFree:true,price:0,address:''}
export function ParishEvents({ events, onAdd, onUpdate, onRemove }: Props) {
  const [show,setShow] = useState(false)
  const [form,setForm] = useState<any>({...EMPTY})
  const [editId,setEditId] = useState<string|null>(null)
  const f=(k:string,v:any)=>setForm((p:any)=>({...p,[k]:v}))
  const edit=(e:ParishEvent)=>{setForm({...e,price:e.price??0});setEditId(e.id);setShow(true)}
  const save=()=>{
    const {id,slug,...rest}=form as any
    if(editId){onUpdate(editId,rest)}else{onAdd(rest)}
    setShow(false);setEditId(null);setForm({...EMPTY})
  }
  return (
    <div className="panel-wrap">
      <div className="panel-header-row">
        <div><h2 className="panel-title">Eventi</h2><p className="panel-sub">{events.length} eventi · {events.filter(e=>e.isPublished).length} pubblicati</p></div>
        <button className="btn-primary" onClick={()=>{setForm({...EMPTY});setEditId(null);setShow(true)}}>+ Nuovo</button>
      </div>
      {show && (
        <div className="form-card">
          <div className="form-title">{editId?'Modifica evento':'Nuovo evento'}</div>
          <div className="form-grid">
            <div className="form-field form-field-full"><label className="form-label">TITOLO *</label>
            <input className="form-input" placeholder="es. Veglia di Adorazione" value={form.title} onChange={e=>f('title',e.target.value)}/></div>
            <div className="form-field"><label className="form-label">TIPO</label>
            <select className="form-select" value={form.type} onChange={e=>f('type',e.target.value)}>
              {TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div className="form-field"><label className="form-label">DATA INIZIO</label>
            <input className="form-input" type="datetime-local" value={form.startDate} onChange={e=>f('startDate',e.target.value)}/></div>
            <div className="form-field"><label className="form-label">DATA FINE (opz.)</label>
            <input className="form-input" type="datetime-local" value={form.endDate??''} onChange={e=>f('endDate',e.target.value)}/></div>
            <div className="form-field form-field-full"><label className="form-label">DESCRIZIONE</label>
            <textarea className="form-input" rows={3} placeholder="Descrizione dell'evento..." value={form.description} onChange={e=>f('description',e.target.value)}/></div>
            <div className="form-field form-field-full"><label className="form-label">INDIRIZZO (opz.)</label>
            <input className="form-input" placeholder="es. Via Roma 1, Milano" value={form.address??''} onChange={e=>f('address',e.target.value)}/></div>
            <div className="form-field"><label className="form-label">INGRESSO</label>
            <select className="form-select" value={form.isFree?'free':'paid'} onChange={e=>f('isFree',e.target.value==='free')}>
              <option value="free">Gratuito</option><option value="paid">A pagamento</option></select></div>
            {!form.isFree && <div className="form-field"><label className="form-label">PREZZO €</label>
            <input className="form-input" type="number" min={0} value={form.price} onChange={e=>f('price',+e.target.value)}/></div>}
          </div>
          <div className="form-checks">
            <label className="form-check"><input type="checkbox" checked={form.isPublished} onChange={e=>f('isPublished',e.target.checked)}/> Pubblica subito</label>
            <label className="form-check"><input type="checkbox" checked={form.isFeatured} onChange={e=>f('isFeatured',e.target.checked)}/> In evidenza</label>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={save}>✓ Salva</button>
            <button className="btn-ghost" onClick={()=>{setShow(false);setEditId(null)}}>Annulla</button>
          </div>
        </div>
      )}
      <div className="events-list">
        {events.length===0
          ? <div className="panel-empty">Nessun evento. Creane uno!</div>
          : events.map(ev=>(
            <div key={ev.id} className="event-row">
              <div className="er-left">
                <span className={`er-status ${ev.isPublished?'pub':'draft'}`}>{ev.isPublished?'Pubblicato':'Bozza'}</span>
                {ev.isFeatured && <span className="er-featured">★</span>}
              </div>
              <div className="er-main">
                <div className="er-title">{ev.title}</div>
                <div className="er-meta">{ev.type} · {new Date(ev.startDate).toLocaleDateString('it-IT',{day:'numeric',month:'short',year:'numeric'})} · {ev.isFree?'Gratuito':`€${ev.price}`}</div>
              </div>
              <div className="er-actions">
                <button className="btn-icon" onClick={()=>onUpdate(ev.id,{isPublished:!ev.isPublished})}>{ev.isPublished?'Nascondi':'Pubblica'}</button>
                <button className="btn-icon" onClick={()=>edit(ev)}>✏️</button>
                <button className="btn-icon-del" onClick={()=>onRemove(ev.id)}>✕</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
