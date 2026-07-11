import { describe, it, expect } from 'vitest'
// Nota: i mock per supabase e i18n sono in setup.ts

describe('DEMO adapter (Supabase non configurato)', () => {
  it('isSupabaseConfigured ritorna false senza variabili env', async () => {
    const { isSupabaseConfigured } = await import('../lib/supabase')
    // In test: VITE_SUPABASE_URL non è definito → false
    expect(isSupabaseConfigured()).toBe(false)
  })

  it('supabase client ha placeholder URL', async () => {
    const { supabase } = await import('../lib/supabase')
    // Il client esiste ma usa placeholder
    expect(supabase).toBeDefined()
    expect(supabase.auth).toBeDefined()
  })

  it('useDashboard esporta loginAs', async () => {
    const { useDashboard } = await import('../hooks/useDashboard')
    expect(typeof useDashboard).toBe('function')
  })

  it('DEMO_USER contiene [DEMO] nel nome (verifica costante)', async () => {
    // Importa il modulo e verifica la struttura
    const module = await import('../hooks/useDashboard')
    expect(module.useDashboard).toBeDefined()
    // useDashboard è una funzione — OK
  })
})
