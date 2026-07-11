import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

interface Props {
  children: JSX.Element
  roles?: string[]
  redirectTo?: string
}

export function ProtectedRoute({ children, roles, redirectTo = '/login' }: Props) {
  const location = useLocation()
  const [status, setStatus] = useState<'loading'|'auth'|'unauth'>('loading')
  const [userRole, setUserRole] = useState<string>('')

  useEffect(() => {
    // In dev senza Supabase: tutto aperto
    if (!isSupabaseConfigured()) {
      setStatus('auth')
      setUserRole('PARISH_ADMIN')
      return
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setStatus('unauth'); return }
      // Recupera ruolo dal profilo
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
      setUserRole((data as any)?.role ?? 'USER')
      setStatus('auth')
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? 'auth' : 'unauth')
    })
    return () => subscription.unsubscribe()
  }, [])

  if (status === 'loading') return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <span style={{ fontFamily:'Cinzel,serif', color:'#8b1a2a' }}>❤️‍🔥 Verifica sessione...</span>
    </div>
  )

  if (status === 'unauth') {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (roles && roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/" replace />
  }

  return children
}
