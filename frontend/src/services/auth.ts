/**
 * Auth Service — Supabase Auth
 * Usato da: Login.tsx, Register.tsx, ProtectedRoute.tsx, Dashboard.tsx
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase'

export interface UserProfile {
  id: string
  email: string
  name: string
  role: 'USER'|'PARISH_ADMIN'|'DIOCESE_ADMIN'|'MODERATOR'|'ADMIN'|'SUPER_ADMIN'
  avatar_url?: string
  language: string
  is_active: boolean
  parish?: { id: string; name: string; status: string } | null
}

export const authService = {
  /** LOGIN con email + password */
  async login(email: string, password: string): Promise<UserProfile> {
    if (!isSupabaseConfigured()) {
      // Modalità DEMO: simula login
      console.warn('[Auth] Supabase non configurato — modalità DEMO')
      return DEMO_USER
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    const profile = await authService.getProfile(data.user.id)
    return profile
  },

  /** REGISTRAZIONE */
  async register(payload: {
    name: string; email: string; password: string; role?: string
    parish?: { name: string; city: string; country: string }
  }): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase non ancora configurato. Inserisci le credenziali in .env')
    }
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          name: payload.name,
          role: payload.role ?? 'USER',
          parish: payload.parish ?? null,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw new Error(error.message)
    // La parrocchia viene creata server-side tramite trigger/edge function
  },

  /** LOGOUT */
  async logout(): Promise<void> {
    await supabase.auth.signOut()
  },

  /** RESET PASSWORD */
  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) throw new Error(error.message)
  },

  /** AGGIORNA PASSWORD (dopo reset) */
  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw new Error(error.message)
  },

  /** ELIMINA ACCOUNT */
  async deleteAccount(): Promise<void> {
    // Richiede Edge Function Supabase con service_role
    const { error } = await supabase.functions.invoke('delete-account')
    if (error) throw new Error(error.message)
  },

  /** PROFILO UTENTE */
  async getProfile(userId?: string): Promise<UserProfile> {
    const uid = userId ?? (await supabase.auth.getUser()).data.user?.id
    if (!uid) throw new Error('Non autenticato')

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, email, name, role, avatar_url, language, is_active,
        parishes:parishes!admin_id (id, name, status)
      `)
      .eq('id', uid)
      .single()

    if (error) throw new Error(error.message)
    const d = data as any
    return {
      id: d.id, email: d.email, name: d.name, role: d.role,
      avatar_url: d.avatar_url, language: d.language, is_active: d.is_active,
      parish: d.parishes?.[0] ?? null,
    } as UserProfile
  },

  /** SESSIONE CORRENTE */
  async getSession() {
    const { data } = await supabase.auth.getSession()
    return data.session
  },

  /** È AUTENTICATO? */
  async isAuthenticated(): Promise<boolean> {
    if (!isSupabaseConfigured()) return false
    const session = await authService.getSession()
    return !!session
  },

  /** UTENTE CORRENTE (sincrono da cache) */
  getCurrentUser() {
    return supabase.auth.getUser()
  },

  /** LISTENER cambi sessione */
  onAuthStateChange(cb: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(cb)
  },
}

/** DEMO USER (solo quando Supabase non è configurato) */
const DEMO_USER: UserProfile = {
  id: 'demo-user-id',
  email: 'demo@adorazioneviva.test',
  name: 'Demo Parish Admin',
  role: 'PARISH_ADMIN',
  language: 'it',
  is_active: true,
  parish: { id: 'demo-parish-id', name: "[DEMO] St Mary's Parish Navan", status: 'VERIFIED' },
}
