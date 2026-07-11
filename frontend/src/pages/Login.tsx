import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authService } from '../services/auth'

export function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname ?? '/'

  const [form,    setForm]    = useState({ email:'', password:'' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('av_token')) navigate('/', { replace:true })
  }, [navigate])

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]:v }))

  const submit = async () => {
    if (!form.email || !form.password) { setError('Compila tutti i campi.'); return }
    setLoading(true); setError('')
    try {
      await authService.login(form.email, form.password)
      navigate(from, { replace:true })
    } catch (e: any) {
      setError(e.message ?? 'Credenziali non valide.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-ico">❤️‍🔥</span>
          <div className="auth-brand-name">Adorazione Viva</div>
        </div>

        <h1 className="auth-title">Accedi</h1>
        <p className="auth-sub">Entra nella tua parrocchia o account personale</p>

        {error && <div className="auth-error">⚠️ {error}</div>}

        <div className="auth-form">
          <div className="auth-field">
            <label className="auth-label">EMAIL</label>
            <input className="auth-input" type="email" placeholder="nome@email.com"
              value={form.email} onChange={e => f('email', e.target.value)}
              onKeyDown={e => e.key==='Enter' && submit()} autoComplete="email" />
          </div>
          <div className="auth-field">
            <label className="auth-label">PASSWORD</label>
            <input className="auth-input" type="password" placeholder="••••••••"
              value={form.password} onChange={e => f('password', e.target.value)}
              onKeyDown={e => e.key==='Enter' && submit()} autoComplete="current-password" />
          </div>
          <div className="auth-forgot">
            <Link to="/forgot-password" className="auth-link">Password dimenticata?</Link>
          </div>
          <button className="auth-btn-primary" onClick={submit} disabled={loading}>
            {loading ? '...' : 'Accedi →'}
          </button>
        </div>

        <div className="auth-footer">
          Non hai un account?{' '}
          <Link to="/register" className="auth-link">Registrati</Link>
        </div>

        <div className="auth-divider"><span>oppure</span></div>
        <button className="auth-btn-ghost" onClick={() => navigate('/')}>
          ← Torna all'app senza accedere
        </button>
      </div>
    </div>
  )
}
