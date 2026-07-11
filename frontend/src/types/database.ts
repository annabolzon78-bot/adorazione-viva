/**
 * Tipi auto-generabili con:
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
 *
 * Questo file è uno STUB che verrà sovrascritto dopo la creazione del progetto Supabase.
 */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; email: string; name: string; role: string
          avatar_url: string | null; bio: string | null
          language: string; is_active: boolean; created_at: string; updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['profiles']['Row']>
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      parishes: {
        Row: {
          id: string; name: string; slug: string; city: string | null
          country_id: number | null; status: string; admin_id: string | null
          lat: number | null; lng: number | null; has_streaming: boolean
          has_adoration: boolean; has_confession: boolean; is_featured: boolean
          email: string | null; website_url: string | null; created_at: string
        }
        Insert: Partial<Database['public']['Tables']['parishes']['Row']>
        Update: Partial<Database['public']['Tables']['parishes']['Row']>
      }
      chapels: {
        Row: {
          id: string; parish_id: string; name: string; slug: string
          lat: number | null; lng: number | null; adoration_type: string
          is_24h: boolean; has_live_stream: boolean; is_open_now: boolean
          is_verified: boolean; created_at: string
        }
        Insert: Partial<Database['public']['Tables']['chapels']['Row']>
        Update: Partial<Database['public']['Tables']['chapels']['Row']>
      }
      adoration_sessions: {
        Row: {
          id: string; user_id: string | null; chapel_id: string | null
          country_code: string | null; is_anonymous: boolean
          status: string; started_at: string; ended_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['adoration_sessions']['Row']>
        Update: Partial<Database['public']['Tables']['adoration_sessions']['Row']>
      }
      live_streams: {
        Row: {
          id: string; parish_id: string | null; title: string
          type: string; url: string; embed_url: string | null
          language: string; status: string; is_active: boolean
          is_featured: boolean; viewers_count: number | null; created_at: string
        }
        Insert: Partial<Database['public']['Tables']['live_streams']['Row']>
        Update: Partial<Database['public']['Tables']['live_streams']['Row']>
      }
      eucharistic_miracles: {
        Row: {
          id: string; slug: string; title: string; location: string | null
          city: string | null; year: number | null; summary: string
          verification_level: string; is_visitable_today: boolean
          lat: number | null; lng: number | null; status: string
          image_url: string | null; view_count: number; created_at: string
        }
        Insert: Partial<Database['public']['Tables']['eucharistic_miracles']['Row']>
        Update: Partial<Database['public']['Tables']['eucharistic_miracles']['Row']>
      }
      favorites: {
        Row: { id: string; user_id: string; entity_type: string; entity_id: string; created_at: string }
        Insert: Partial<Database['public']['Tables']['favorites']['Row']>
        Update: Partial<Database['public']['Tables']['favorites']['Row']>
      }
      notifications: {
        Row: { id: string; user_id: string; type: string; title: string; body: string | null; is_read: boolean; created_at: string }
        Insert: Partial<Database['public']['Tables']['notifications']['Row']>
        Update: Partial<Database['public']['Tables']['notifications']['Row']>
      }
    }
    Views: {
      adorers_now: { Row: { total: number; nations: number; authenticated: number; anonymous: number } }
      adorers_by_country: { Row: { country_code: string; count: number } }
    }
    Functions: {
      start_adoration:       { Args: { p_user_id?: string; p_chapel_id?: string; p_country?: string }; Returns: string }
      end_adoration:         { Args: { p_session_id: string }; Returns: void }
      book_shift:            { Args: { p_shift_id: string; p_user_id: string }; Returns: boolean }
      chapels_within_radius: { Args: { center_lat: number; center_lng: number; radius_km?: number }; Returns: any[] }
      current_user_role:     { Args: {}; Returns: string }
    }
    Enums: {
      user_role: 'USER'|'PARISH_ADMIN'|'DIOCESE_ADMIN'|'MODERATOR'|'ADMIN'|'SUPER_ADMIN'
      parish_status: 'PENDING'|'VERIFIED'|'SUSPENDED'|'REJECTED'
      stream_status: 'ACTIVE'|'OFFLINE'|'SCHEDULED'|'UNKNOWN'
      miracle_level: 'STORICO'|'DIOCESANO'|'PONTIFICIO'|'SCIENTIFICO'
    }
  }
}
