import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../services/auth'
import { isSupabaseConfigured } from '../lib/supabase'
import '../styles/auth.css'

type Mode = 'login' | 'reset' | 'reset-sent'

export function Login() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const from       = (location.state as any)?.from?.pathname ?? '/'
  const [mode,    setMode]    = useState<Mode>('login')
  const [form,    setForm]    = useState({ email:'', password:'' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const isDemoMode = !isSupabaseConfigured()

  useEffect(() => {
    authService.getSession().then(s => { if (s) navigate('/', { replace:true }) })
  }, [navigate])

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]:v }))

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError('Compila tutti i campi.'); return }
    setLoading(true); setError('')
    try {
      await authService.login(form.email, form.password)
      navigate(from, { replace:true })
    } catch (e: any) {
      setError(e.message ?? 'Credenziali non valide.')
    } finally { setLoading(false) }
  }

  const handleReset = async () => {
    if (!form.email) { setError('Inserisci la tua email.'); return }
    setLoading(true); setError('')
    try {
      await authService.resetPassword(form.email)
      setMode('reset-sent')
    } catch (e: any) {
      setError(e.message ?? 'Errore. Riprova.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-ico">❤️‍🔥</span>
          <div className="auth-brand-name">Adorazione Viva</div>
        </div>

        {isDemoMode && (
          <div style={{ background:'#fef3c7', border:'1px solid #f59e0b', borderRadius:8, padding:'8px 12px', marginBottom:14, fontSize:'.75rem', color:'#92400e' }}>
            🛠 <strong>Modalità DEMO</strong> — Supabase non configurato.<br/>
            <Link to="/dashboard" className="auth-link">Apri la dashboard in demo →</Link>
          </div>
        )}

        {mode === 'reset-sent' ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:12 }}>✉️</div>
            <h2 className="auth-title">Email inviata</h2>
            <p className="auth-sub">Controlla la tua casella. Clicca il link per reimpostare la password.</p>
            <button className="auth-btn-ghost" style={{ marginTop:16, width:'100%' }} onClick={() => setMode('login')}>← Torna al login</button>
          </div>
        ) : (
          <>
            <h1 className="auth-title">{mode === 'reset' ? 'Reimposta password' : 'Accedi'}</h1>
            {mode === 'login' && <p className="auth-sub">Entra nella tua parrocchia o account personale</p>}

            {error && <div className="auth-error">⚠️ {error}</div>}

            <div className="auth-form">
              <div className="auth-field">
                <label className="auth-label">EMAIL</label>
                <input className="auth-input" type="email" placeholder="nome@email.com"
                  value={form.email} onChange={e => f('email', e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleReset())}
                  autoComplete="email" />
              </div>

              {mode === 'login' && (
                <div className="auth-field">
                  <label className="auth-label">PASSWORD</label>
                  <input className="auth-input" type="password" placeholder="••••••••"
                    value={form.password} onChange={e => f('password', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    autoComplete="current-password" />
                </div>
              )}

              {mode === 'login' && (
                <div className="auth-forgot">
                  <button className="auth-link" style={{ background:'none', border:'none', cursor:'pointer' }}
                    onClick={() => { setMode('reset'); setError('') }}>
                    Password dimenticata?
                  </button>
                </div>
              )}

              <button className="auth-btn-primary"
                onClick={mode === 'login' ? handleLogin : handleReset}
                disabled={loading}>
                {loading ? '...' : mode === 'login' ? 'Accedi →' : 'Invia email di reset'}
              </button>

              {mode === 'reset' && (
                <button className="auth-btn-ghost" onClick={() => { setMode('login'); setError('') }}>
                  ← Torna al login
                </button>
              )}
            </div>

            {mode === 'login' && (
              <>
                <div className="auth-footer">
                  Non hai un account?{' '}
                  <Link to="/register" className="auth-link">Registrati</Link>
                </div>
                <div className="auth-divider"><span>oppure</span></div>
                <button className="auth-btn-ghost" onClick={() => navigate('/')}>
                  ← Torna all'app senza accedere
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
