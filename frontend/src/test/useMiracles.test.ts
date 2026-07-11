import { describe, it, expect } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useMiracles } from '../hooks/useMiracles'

describe('useMiracles hook', () => {
  it('ha loading inizialmente true', () => {
    const { result } = renderHook(() => useMiracles({}))
    expect(result.current.loading).toBe(true)
  })

  it('restituisce array dopo il caricamento', async () => {
    const { result } = renderHook(() => useMiracles({}))
    await act(async () => {
      await waitFor(() => !result.current.loading, { timeout: 2000 })
    })
    expect(Array.isArray(result.current.miracles)).toBe(true)
  })

  it('total è un numero', async () => {
    const { result } = renderHook(() => useMiracles({}))
    await act(async () => {
      await waitFor(() => !result.current.loading, { timeout: 2000 })
    })
    expect(typeof result.current.total).toBe('number')
  })
})
