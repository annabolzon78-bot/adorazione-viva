import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'

type Step = 'personal' | 'role' | 'parish' | 'done'
type Role = 'USER' | 'PARISH_ADMIN'

export function Register() {
  const navigate = useNavigate()
  const [step,    setStep]    = useState<Step>('personal')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [form, setForm] = useState({
    name:'', email:'', password:'', confirmPassword:'',
    role:'USER' as Role,
    parishName:'', parishCity:'', parishCountry:'Italy',
    acceptPrivacy: false,
  })

  const f = (k: string, v: any) => setForm(p => ({ ...p, [k]:v }))

  const validatePersonal = () => {
    if (!form.name.trim())        return 'Inserisci il tuo nome.'
    if (!form.email.includes('@')) return 'Email non valida.'
    if (form.password.length < 8)  return 'La password deve avere almeno 8 caratteri.'
    if (form.password !== form.confirmPassword) return 'Le password non coincidono.'
    return ''
  }

  const submit = async () => {
    if (!form.acceptPrivacy) { setError('Devi accettare la privacy policy.'); return }
    setLoading(true); setError('')
    try {
      await authService.register({
        name:     form.name,
        email:    form.email,
        password: form.password,
        role:     form.role,
        parish:   form.role === 'PARISH_ADMIN' ? { name:form.parishName, city:form.parishCity, country:form.parishCountry } : undefined,
      })
      setStep('done')
    } catch (e: any) {
      setError(e.message ?? 'Errore durante la registrazione.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'done') return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign:'center' }}>
        <div style={{ fontSize:'3rem', marginBottom:16 }}>✉️</div>
        <h2 className="auth-title">Controlla la tua email</h2>
        <p className="auth-sub" style={{ marginBottom:24 }}>
          Abbiamo inviato un link di conferma a <strong>{form.email}</strong>.
          Clicca il link per attivare il tuo account.
        </p>
        <button className="auth-btn-primary" onClick={() => navigate('/login')}>Vai al login</button>
      </div>
    </div>
  )

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-ico">❤️‍🔥</span>
          <div className="auth-brand-name">Adorazione Eucaristica</div>
        </div>
        <h1 className="auth-title">Crea account</h1>

        {/* Step indicator */}
        <div className="auth-steps">
          {['personal','role', form.role==='PARISH_ADMIN' ? 'parish' : null].filter(Boolean).map((s,i,arr) => (
            <div key={s!} className={`auth-step ${step===s?'active':i<arr.indexOf(step)?'done':''}`}>
              <div className="auth-step-dot">{i+1}</div>
            </div>
          ))}
        </div>

        {error && <div className="auth-error">⚠️ {error}</div>}

        {/* Step 1: Dati personali */}
        {step === 'personal' && (
          <div className="auth-form">
            <div className="auth-field">
              <label className="auth-label">NOME COMPLETO</label>
              <input className="auth-input" placeholder="Mario Rossi" value={form.name} onChange={e => f('name', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">EMAIL</label>
              <input className="auth-input" type="email" placeholder="mario@email.com" value={form.email} onChange={e => f('email', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">PASSWORD (min. 8 caratteri)</label>
              <input className="auth-input" type="password" placeholder="••••••••" value={form.password} onChange={e => f('password', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">CONFERMA PASSWORD</label>
              <input className="auth-input" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => f('confirmPassword', e.target.value)} />
            </div>
            <button className="auth-btn-primary" onClick={() => { const err = validatePersonal(); err ? setError(err) : (setError(''), setStep('role')) }}>
              Continua →
            </button>
          </div>
        )}

        {/* Step 2: Ruolo */}
        {step === 'role' && (
          <div className="auth-form">
            <p className="auth-sub">Come vuoi usare Adorazione Eucaristica?</p>
            {[
              { role:'USER' as Role, icon:'🙏', title:'Fedele', desc:'Cerco cappelle, seguo streaming, tengo il diario spirituale' },
              { role:'PARISH_ADMIN' as Role, icon:'⛪', title:'Amministratore di Parrocchia', desc:'Gestisco gli orari, lo streaming e gli eventi della mia parrocchia' },
            ].map(({ role, icon, title, desc }) => (
              <div key={role} className={`auth-role-card ${form.role===role?'selected':''}`}
                onClick={() => f('role', role)}>
                <span style={{ fontSize:'1.5rem' }}>{icon}</span>
                <div>
                  <div style={{ fontWeight:700 }}>{title}</div>
                  <div style={{ fontSize:'.78rem', color:'var(--t3)', marginTop:2 }}>{desc}</div>
                </div>
                <div className={`auth-role-check ${form.role===role?'on':''}`}>✓</div>
              </div>
            ))}
            <button className="auth-btn-primary" style={{ marginTop:12 }}
              onClick={() => form.role === 'PARISH_ADMIN' ? setStep('parish') : (setError(''), setStep('done'), submit())}>
              {form.role === 'PARISH_ADMIN' ? 'Continua →' : 'Crea account'}
            </button>
            <button className="auth-btn-ghost" onClick={() => setStep('personal')}>← Indietro</button>
          </div>
        )}

        {/* Step 3: Dati parrocchia */}
        {step === 'parish' && (
          <div className="auth-form">
            <p className="auth-sub">Dimmi dove si trova la tua parrocchia.</p>
            <div className="auth-field">
              <label className="auth-label">NOME DELLA PARROCCHIA</label>
              <input className="auth-input" placeholder="es. Parrocchia di San Giovanni" value={form.parishName} onChange={e => f('parishName', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">CITTÀ</label>
              <input className="auth-input" placeholder="es. Roma" value={form.parishCity} onChange={e => f('parishCity', e.target.value)} />
            </div>
            <div className="auth-field">
              <label className="auth-label">PAESE</label>
              <input className="auth-input" placeholder="es. Italy" value={form.parishCountry} onChange={e => f('parishCountry', e.target.value)} />
            </div>
            <div className="auth-privacy">
              <input type="checkbox" id="privacy" checked={form.acceptPrivacy} onChange={e => f('acceptPrivacy', e.target.checked)} />
              <label htmlFor="privacy">
                Accetto la <a href="/privacy" target="_blank" className="auth-link">privacy policy</a> e
                i <a href="/terms" target="_blank" className="auth-link">termini di servizio</a>.
              </label>
            </div>
            <button className="auth-btn-primary" onClick={submit} disabled={loading}>
              {loading ? 'Registrazione...' : '✓ Crea account'}
            </button>
            <button className="auth-btn-ghost" onClick={() => setStep('role')}>← Indietro</button>
          </div>
        )}

        <div className="auth-footer">
          Hai già un account?{' '}<Link to="/login" className="auth-link">Accedi</Link>
        </div>
      </div>
    </div>
  )
}
