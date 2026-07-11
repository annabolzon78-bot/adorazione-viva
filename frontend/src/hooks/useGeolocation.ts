/**
 * useGeolocation
 *
 * Geolocalizzazione utente per centrare la mappa.
 * - Richiesta esplicita (nessun tracciamento automatico)
 * - Una sola lettura, non continua (getCurrentPosition, non watchPosition)
 * - Gestisce permesso negato
 */

import { useState, useCallback } from 'react'

export type GeoError = 'NOT_SUPPORTED' | 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | null

export interface GeoState {
  lat:     number | null
  lng:     number | null
  error:   GeoError
  loading: boolean
  // Messaggio leggibile (l'UI lo traduce con t('map.geo_*'))
  errorCode: GeoError
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    lat: null, lng: null, error: null, loading: false, errorCode: null,
  })

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: 'NOT_SUPPORTED', errorCode: 'NOT_SUPPORTED', loading: false }))
      return
    }

    setState(s => ({ ...s, loading: true, error: null, errorCode: null }))

    // Una sola lettura — non watchPosition (no tracciamento continuo)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          lat:       pos.coords.latitude,
          lng:       pos.coords.longitude,
          error:     null,
          errorCode: null,
          loading:   false,
        })
      },
      (err) => {
        const code: GeoError =
          err.code === 1 ? 'PERMISSION_DENIED' :
          err.code === 2 ? 'POSITION_UNAVAILABLE' : 'TIMEOUT'
        setState(s => ({ ...s, error: code, errorCode: code, loading: false }))
      },
      {
        enableHighAccuracy: false,   // risparmia batteria
        timeout:            8000,
        maximumAge:         300_000, // accetta posizione vecchia 5 minuti
      }
    )
  }, [])

  const reset = useCallback(() => {
    setState({ lat: null, lng: null, error: null, errorCode: null, loading: false })
  }, [])

  return { ...state, locate, reset }
}
