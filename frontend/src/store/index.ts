/**
 * Zustand stores
 *
 * - AuthStore: deprecato — la sessione è ora gestita da Supabase Auth
 *              Mantenuto solo per compatibilità con codice legacy durante la migrazione
 * - MapStore: stato locale mappa (non necessita persistenza remota)
 *
 * NOTE: useStatsStore è stato rimosso — i dati arrivano da useAdoration (Supabase Realtime)
 */

import { create } from 'zustand'
import type { Chapel, MapFilter } from '../types'

// ── Map Store ────────────────────────────────────────────────
interface MapState {
  selectedChapel: Chapel | null
  filters:        MapFilter
  setSelectedChapel: (chapel: Chapel | null) => void
  setFilters:        (filters: MapFilter) => void
  resetFilters:      () => void
}

export const useMapStore = create<MapState>((set) => ({
  selectedChapel: null,
  filters:        {},
  setSelectedChapel: (chapel) => set({ selectedChapel: chapel }),
  setFilters:        (filters) => set({ filters }),
  resetFilters:      ()        => set({ filters: {} }),
}))

// ── UI Store (preferenze locali) ─────────────────────────────
interface UIState {
  isDemoMode: boolean
  setDemoMode: (v: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isDemoMode:  false,
  setDemoMode: (v) => set({ isDemoMode: v }),
}))
