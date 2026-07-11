-- ============================================================
-- 001 — ENUM TYPES
-- Adorazione Viva · Supabase Migration
-- Idempotente: usa DO block per verificare esistenza
-- ============================================================

DO $$ BEGIN

  -- Ruolo utente
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('USER','PARISH_ADMIN','DIOCESE_ADMIN','MODERATOR','ADMIN','SUPER_ADMIN');
  END IF;

  -- Stato parrocchia
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'parish_status') THEN
    CREATE TYPE parish_status AS ENUM ('PENDING','VERIFIED','SUSPENDED','REJECTED');
  END IF;

  -- Tipo adorazione
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'adoration_type') THEN
    CREATE TYPE adoration_type AS ENUM ('PERPETUAL','DAILY','WEEKLY','MONTHLY','OCCASIONAL','ONLINE');
  END IF;

  -- Rito Messa
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mass_rite') THEN
    CREATE TYPE mass_rite AS ENUM ('ROMANO','AMBROSIANO','TRIDENTINO','ORIENTALE','ALTRO');
  END IF;

  -- Tipo schedule
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'schedule_type') THEN
    CREATE TYPE schedule_type AS ENUM ('MASS','CONFESSION','ADORATION');
  END IF;

  -- Stato stream
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stream_status') THEN
    CREATE TYPE stream_status AS ENUM ('ACTIVE','OFFLINE','SCHEDULED','UNKNOWN');
  END IF;

  -- Tipo stream
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stream_type') THEN
    CREATE TYPE stream_type AS ENUM ('YOUTUBE_LIVE','YOUTUBE_CHANNEL','VIMEO','HLS','RTSP','FACEBOOK_LIVE','TWITCH','CUSTOM_EMBED');
  END IF;

  -- Lingua stream
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stream_language') THEN
    CREATE TYPE stream_language AS ENUM ('IT','EN','ES','FR','PT','DE','PL','LA','AR','ZH','JA','KO','OTHER');
  END IF;

  -- Continente
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'continent') THEN
    CREATE TYPE continent AS ENUM ('EUROPA','AMERICA_NORD','AMERICA_SUD','AFRICA','ASIA','OCEANIA','MEDIO_ORIENTE');
  END IF;

  -- Livello verifica miracolo
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'miracle_level') THEN
    CREATE TYPE miracle_level AS ENUM ('STORICO','DIOCESANO','PONTIFICIO','SCIENTIFICO');
  END IF;

  -- Stato sessione adorazione
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'session_status') THEN
    CREATE TYPE session_status AS ENUM ('ACTIVE','ENDED','ABANDONED');
  END IF;

  -- Tipo evento
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_type') THEN
    CREATE TYPE event_type AS ENUM ('MESSA_SPECIALE','VEGLIA','RITIRO','PELLEGRINAGGIO','CONCERTO_SACRO','CONFERENZA','ALTRO');
  END IF;

  -- Tipo notifica
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE notification_type AS ENUM ('SHIFT_REMINDER','NEW_INTENTION','PARISH_UPDATE','EVENT_REMINDER','SYSTEM','ADORATION_REMINDER','MODERATION');
  END IF;

  -- Stato pubblicazione
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'publish_status') THEN
    CREATE TYPE publish_status AS ENUM ('DRAFT','REVIEW','PUBLISHED','REJECTED','ARCHIVED');
  END IF;

END $$;
