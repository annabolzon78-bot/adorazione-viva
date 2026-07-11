import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Supabase (non disponibile in test)
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession:        vi.fn().mockResolvedValue({ data: { session: null } }),
      getUser:           vi.fn().mockResolvedValue({ data: { user: null } }),
      signInWithPassword: vi.fn(),
      signUp:            vi.fn(),
      signOut:           vi.fn(),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
    rpc:     vi.fn().mockResolvedValue({ data: null, error: null }),
    channel: vi.fn().mockReturnValue({
      on:        vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    }),
    removeChannel: vi.fn(),
  },
  isSupabaseConfigured: vi.fn().mockReturnValue(false),
}))

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t:  (key: string) => key,
    i18n: { language: 'it', changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
  Trans: ({ children }: any) => children,
}))

// Mock leaflet (non funziona in jsdom)
vi.mock('leaflet', () => ({
  default: { map: vi.fn(), tileLayer: vi.fn(), divIcon: vi.fn(), marker: vi.fn() },
}))
