
import { useState } from 'react'
interface Message { id:string; from:string; email:string; subject:string; text:string; date:string; read:boolean }
interface Props { messages: Message[]; onMarkRead:(id:string)=>void }
export function ParishMessages({ messages, onMarkRead }: Props) {
  const [selected, setSelected] = useState<Message|null>(null)
  const [reply, setReply] = useState('')
  const [sent, setSent] = useState<string[]>([])
  const open = (m: Message) => { setSelected(m); if(!m.read) onMarkRead(m.id); setReply('') }
  const sendReply = () => {
    if(!reply.trim() || !selected) return
    setSent(p=>[...p, selected.id])
    setReply('')
    alert(`Risposta inviata a ${selected.email}`)
  }
  const unread = messages.filter(m=>!m.read).length
  return (
    <div className="panel-wrap">
      <div className="panel-header">
        <h2 className="panel-title">Messaggi {unread>0 && <span className="badge-count">{unread}</span>}</h2>
        <p className="panel-sub">{messages.length} messaggi · {unread} da leggere</p>
      </div>
      <div className="messages-layout">
        <div className="msg-list">
          {messages.length===0
            ? <div className="panel-empty">Nessun messaggio</div>
            : messages.map(m=>(
              <div key={m.id} className={`msg-item ${selected?.id===m.id?'active':''} ${!m.read?'unread':''}`}
                onClick={()=>open(m)}>
                <div className="mi-top">
                  <span className="mi-from">{m.from}</span>
                  <span className="mi-date">{new Date(m.date).toLocaleDateString('it-IT')}</span>
                </div>
                <div className="mi-subject">{m.subject}</div>
                <div className="mi-preview">{m.text.slice(0,60)}...</div>
                {!m.read && <span className="mi-dot"/>}
              </div>
            ))}
        </div>
        <div className="msg-detail">
          {!selected
            ? <div className="msg-empty-state">Seleziona un messaggio</div>
            : (
              <>
                <div className="md-header-msg">
                  <div className="md-from">{selected.from} <span className="md-email">&lt;{selected.email}&gt;</span></div>
                  <div className="md-subject">{selected.subject}</div>
                  <div className="md-date">{new Date(selected.date).toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
                </div>
                <div className="md-body">{selected.text}</div>
                {sent.includes(selected.id)
                  ? <div className="md-sent">✓ Risposta inviata</div>
                  : (
                    <div className="md-reply-form">
                      <div className="form-label">RISPOSTA</div>
                      <textarea className="form-input" rows={4} placeholder={`Scrivi a ${selected.from}...`}
                        value={reply} onChange={e=>setReply(e.target.value)}/>
                      <button className="btn-primary" style={{marginTop:8}} onClick={sendReply}>
                        Invia risposta
                      </button>
                    </div>
                  )}
              </>
            )}
        </div>
      </div>
    </div>
  )
}
