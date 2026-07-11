import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'

// Mock già in setup.ts: supabase.auth.getSession → null
// isSupabaseConfigured → false

describe('ProtectedRoute', () => {
  const Protected = () => <div>CONTENUTO PROTETTO</div>

  it('mostra il contenuto in modalità DEMO (Supabase non configurato)', async () => {
    const { findByText } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <Protected />
        </ProtectedRoute>
      </MemoryRouter>
    )
    // In dev senza Supabase: accesso concesso
    const el = await findByText('CONTENUTO PROTETTO', {}, { timeout: 3000 })
    expect(el).toBeDefined()
  })

  it('ProtectedRoute accetta prop roles', () => {
    // Verifica che il componente non lanci errori con la prop roles
    expect(() => render(
      <MemoryRouter>
        <ProtectedRoute roles={['PARISH_ADMIN', 'ADMIN']}>
          <Protected />
        </ProtectedRoute>
      </MemoryRouter>
    )).not.toThrow()
  })
})
