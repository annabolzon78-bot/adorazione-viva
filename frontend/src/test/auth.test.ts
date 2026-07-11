import { describe, it, expect, vi } from 'vitest'

describe('auth service', () => {
  it('DEMO_USER ha i campi obbligatori', async () => {
    // In modalità demo, auth restituisce un utente mock
    const { authService } = await import('../services/auth')
    const user = await authService.login('demo@test.com', 'password')
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('email')
    expect(user).toHaveProperty('name')
    expect(user).toHaveProperty('role')
  })

  it('getSession restituisce null senza Supabase configurato', async () => {
    const { authService } = await import('../services/auth')
    const session = await authService.getSession()
    expect(session).toBeNull()
  })
})
