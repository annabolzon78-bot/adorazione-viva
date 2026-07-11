/**
 * Frontend shared types
 * 
 * NOTE: i tipi del database (tabelle Supabase) sono in types/database.ts
 * Qui ci sono i tipi applicativi del frontend.
 */

// ── Chapel ───────────────────────────────────────────────────
export type AdorationTypeEnum =
  | 'PERPETUA' | 'GIORNALIERA' | 'SETTIMANALE'
  | 'MENSILE' | 'OCCASIONALE' | 'ONLINE'

export interface Schedule {
  id:        string
  chapelId:  string
  dayOfWeek: number
  startTime: string
  endTime:   string
  type:      'MASS' | 'ADORATION' | 'CONFESSION'
  rite?:     string
  notes?:    string
}

export interface Chapel {
  id:             string
  name:           string
  address?:       string
  city?:          string
  country?:       string
  lat:            number
  lng:            number
  adorationType:  AdorationTypeEnum
  isOpenNow:      boolean
  is24h:          boolean
  hasLiveStream:  boolean
  streamUrl?:     string
  hasConfessions: boolean
  accessible:     boolean
  hasMass?:       boolean
  phone?:         string
  email?:         string
  websiteUrl?:    string
  parish?:        { id: string; name: string }
  schedule:       Schedule[]
  createdAt:      string
  updatedAt:      string
}

// ── Map Filter ───────────────────────────────────────────────
export interface MapFilter {
  type?:           AdorationTypeEnum
  openNow?:        boolean
  has24h?:         boolean
  hasLive?:        boolean
  hasConfessions?: boolean
  radiusKm?:       number
  lat?:            number
  lng?:            number
}

// ── Parish ───────────────────────────────────────────────────
export interface Parish {
  id:       string
  name:     string
  address?: string
  city?:    string
  country?: string
  lat?:     number
  lng?:     number
  email?:   string
  phone?:   string
  website?: string
  chapels:  Chapel[]
  verified: boolean
}

// ── API Response (backend Express legacy) ────────────────────
export interface ApiResponse<T> {
  success: boolean
  data:    T
  message?: string
  error?:  string
}

export interface PaginatedMeta {
  total:   number
  page:    number
  limit:   number
  pages:   number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  success: boolean
  data:    T[]
  meta:    PaginatedMeta
}
