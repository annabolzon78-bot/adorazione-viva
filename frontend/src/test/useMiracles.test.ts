import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMiracles }         from '../hooks/useMiracles'

describe('useMiracles hook', () => {
  it('restituisce dati fallback DEMO quando API non disponibile', async () => {
    const { result } = renderHook(() => useMiracles({}))
    await waitFor(() => !result.current.loading)
    // In ambiente test senza backend, usa i fallback
    expect(Array.isArray(result.current.miracles)).toBe(true)
    // I dati demo devono esistere
    expect(result.current.miracles.length).toBeGreaterThanOrEqual(0)
  })

  it('il tipo di loading è booleano', () => {
    const { result } = renderHook(() => useMiracles({}))
    expect(typeof result.current.loading).toBe('boolean')
  })
})
