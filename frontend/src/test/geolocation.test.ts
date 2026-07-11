import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGeolocation } from '../hooks/useGeolocation'

describe('useGeolocation', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('stato iniziale: lat/lng null, loading false', () => {
    const { result } = renderHook(() => useGeolocation())
    expect(result.current.lat).toBeNull()
    expect(result.current.lng).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('imposta loading=true durante la richiesta', () => {
    // Mock: getCurrentPosition non chiama callback (simula attesa)
    Object.defineProperty(window.navigator, 'geolocation', {
      value: { getCurrentPosition: vi.fn() },
      writable: true, configurable: true,
    })
    const { result } = renderHook(() => useGeolocation())
    act(() => { result.current.locate() })
    expect(result.current.loading).toBe(true)
  })

  it('imposta lat/lng dopo successo', async () => {
    Object.defineProperty(window.navigator, 'geolocation', {
      value: {
        getCurrentPosition: vi.fn((success) => {
          success({ coords: { latitude: 41.9, longitude: 12.5, accuracy: 10 } })
        })
      },
      writable: true, configurable: true,
    })
    const { result } = renderHook(() => useGeolocation())
    await act(async () => { result.current.locate() })
    expect(result.current.lat).toBe(41.9)
    expect(result.current.lng).toBe(12.5)
    expect(result.current.loading).toBe(false)
  })

  it('imposta error=PERMISSION_DENIED se permesso negato', async () => {
    Object.defineProperty(window.navigator, 'geolocation', {
      value: {
        getCurrentPosition: vi.fn((_, error) => {
          error({ code: 1, message: 'User denied' })
        })
      },
      writable: true, configurable: true,
    })
    const { result } = renderHook(() => useGeolocation())
    await act(async () => { result.current.locate() })
    expect(result.current.error).toBe('PERMISSION_DENIED')
    expect(result.current.loading).toBe(false)
  })

  it('imposta error=NOT_SUPPORTED se geolocation non disponibile', () => {
    Object.defineProperty(window.navigator, 'geolocation', {
      value: undefined, writable: true, configurable: true,
    })
    const { result } = renderHook(() => useGeolocation())
    act(() => { result.current.locate() })
    expect(result.current.error).toBe('NOT_SUPPORTED')
  })

  it('reset azzera lat/lng/error', async () => {
    Object.defineProperty(window.navigator, 'geolocation', {
      value: {
        getCurrentPosition: vi.fn((success) => {
          success({ coords: { latitude: 41.9, longitude: 12.5, accuracy: 10 } })
        })
      },
      writable: true, configurable: true,
    })
    const { result } = renderHook(() => useGeolocation())
    await act(async () => { result.current.locate() })
    expect(result.current.lat).toBe(41.9)
    act(() => { result.current.reset() })
    expect(result.current.lat).toBeNull()
    expect(result.current.error).toBeNull()
  })
})
