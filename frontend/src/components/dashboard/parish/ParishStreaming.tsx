
import { useState } from 'react'
interface StreamEntry { id:string; title:string; type:string; url:string; status:string; isDefault:boolean; language:string }
const MOCK_STREAMS: StreamEntry[] = [
  { id:'st1', title:"Adorazione Perpetua — Cappella 1", type:'YOUTUBE_LIVE', url:'https://www.youtube.com/embed/hMNLrStmcTs', status:'ACTIVE', isDefault:true, language:'EN' },
  { id:'st2', title:"Adorazione Perpetua — Cappella 2", type:'YOUTUBE_LIVE', url:'https://www.youtube.com/embed/GlGkFWPKomU', status:'ACTIVE', isDefault:false, language:'EN' },
]
const TYPES = ['YOUTUBE_LIVE','YOUTUBE_CHANNEL','VIMEO','HLS','FACEBOOK_LIVE','TWITCH','CUSTOM_EMBED']
const LANGS = ['IT','EN','ES','FR','DE','PT','PL','ZH','JA','KO','AR']
export function ParishStreaming() {
  const [streams,setStreams] = useState<StreamEntry[]>(MOCK_STREAMS)
  const [show,setShow] = useState(false)
  const [form,setForm] = useState({title:'',type:'YOUTUBE_LIVE',url:'',language:'IT',isDefault:false})
  const f=(k:string,v:any)=>setForm(p=>({...p,[k]:v}))
  const add=()=>{
    setStreams(p=>[...p,{...form,id:`s${Date.now()}`,status:'ACTIVE'}])
    setShow(false);setForm({title:'',type:'YOUTUBE_LIVE',url:'',language:'IT',isDefault:false})
  }
  const toggle=(id:string)=>setStreams(p=>p.map(s=>s.id===id?{...s,status:s.status==='ACTIVE'?'OFFLINE':'ACTIVE'}:s))
  const remove=(id:string)=>setStreams(p=>p.filter(s=>s.id!==id))
  return (
    <div className="panel-wrap">
      <div className="panel-header-row">
        <div><h2 className="panel-title">Streaming</h2><p className="panel-sub">{streams.filter(s=>s.status==='ACTIVE').length} attivi · {streams.length} totali</p></div>
        <button className="btn-primary" onClick={()=>setShow(true)}>+ Aggiungi</button>
      </div>
      {show && (
        <div className="form-card">
          <div className="form-title">Nuovo stream</div>
          <div className="form-grid">
            <div className="form-field form-field-full"><label className="form-label">TITOLO *</label>
            <input className="form-input" placeholder="es. Adorazione Live — Cappella Principale" value={form.title} onChange={e=>f('title',e.target.value)}/></div>
            <div className="form-field"><label className="form-label">TIPO</label>
            <select className="form-select" value={form.type} onChange={e=>f('type',e.target.value)}>
              {TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
            <div className="form-field"><label className="form-label">LINGUA</label>
            <select className="form-select" value={form.language} onChange={e=>f('language',e.target.value)}>
              {LANGS.map(l=><option key={l}>{l}</option>)}</select></div>
            <div className="form-field form-field-full"><label className="form-label">URL STREAM *</label>
            <input className="form-input" placeholder="https://..." value={form.url} onChange={e=>f('url',e.target.value)}/></div>
          </div>
          <div className="form-checks">
            <label className="form-check"><input type="checkbox" checked={form.isDefault} onChange={e=>f('isDefault',e.target.checked)}/> Stream principale parrocchia</label>
          </div>
          <div className="form-actions">
            <button className="btn-primary" onClick={add}>✓ Aggiungi</button>
            <button className="btn-ghost" onClick={()=>setShow(false)}>Annulla</button>
          </div>
        </div>
      )}
      <div className="stream-list">
        {streams.map(s=>(
          <div key={s.id} className="stream-row">
            <div className="sr-status-dot" style={{background:s.status==='ACTIVE'?'#16a34a':'#9ca3af'}}/>
            <div className="sr-main">
              <div className="sr-title">{s.title}{s.isDefault && <span className="sr-default">★ Principale</span>}</div>
              <div className="sr-meta">{s.type} · {s.language} · <span className={s.status==='ACTIVE'?'text-green':'text-gray'}>{s.status}</span></div>
              <div className="sr-url">{s.url}</div>
            </div>
            <div className="sr-actions">
              <button className="btn-icon" onClick={()=>toggle(s.id)}>{s.status==='ACTIVE'?'Disattiva':'Attiva'}</button>
              <button className="btn-icon-del" onClick={()=>remove(s.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
