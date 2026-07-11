-- ============================================================
-- 001 — ENUM TYPES
-- Adorazione Viva · Supabase Migration
-- ============================================================

-- Ruolo utente
CREATE TYPE user_role AS ENUM (
  'USER', 'PARISH_ADMIN', 'DIOCESE_ADMIN',
  'MODERATOR', 'ADMIN', 'SUPER_ADMIN'
);

-- Stato parrocchia
CREATE TYPE parish_status AS ENUM (
  'PENDING', 'VERIFIED', 'SUSPENDED', 'REJECTED'
);

-- Tipo adorazione
CREATE TYPE adoration_type AS ENUM (
  'PERPETUAL', 'DAILY', 'WEEKLY', 'MONTHLY', 'OCCASIONAL', 'ONLINE'
);

-- Rito Messa
CREATE TYPE mass_rite AS ENUM (
  'ROMANO', 'AMBROSIANO', 'TRIDENTINO', 'ORIENTALE', 'ALTRO'
);

-- Tipo schedule
CREATE TYPE schedule_type AS ENUM ('MASS', 'CONFESSION', 'ADORATION');

-- Stato stream
CREATE TYPE stream_status AS ENUM ('ACTIVE', 'OFFLINE', 'SCHEDULED', 'UNKNOWN');

-- Tipo stream
CREATE TYPE stream_type AS ENUM (
  'YOUTUBE_LIVE', 'YOUTUBE_CHANNEL', 'VIMEO',
  'HLS', 'RTSP', 'FACEBOOK_LIVE', 'TWITCH', 'CUSTOM_EMBED'
);

-- Lingua stream
CREATE TYPE stream_language AS ENUM (
  'IT','EN','ES','FR','PT','DE','PL','LA','AR','ZH','JA','KO','OTHER'
);

-- Continente
CREATE TYPE continent AS ENUM (
  'EUROPA','AMERICA_NORD','AMERICA_SUD',
  'AFRICA','ASIA','OCEANIA','MEDIO_ORIENTE'
);

-- Livello verifica miracolo
CREATE TYPE miracle_level AS ENUM (
  'STORICO', 'DIOCESANO', 'PONTIFICIO', 'SCIENTIFICO'
);

-- Stato sessione adorazione
CREATE TYPE session_status AS ENUM ('ACTIVE', 'ENDED', 'ABANDONED');

-- Tipo evento
CREATE TYPE event_type AS ENUM (
  'MESSA_SPECIALE', 'VEGLIA', 'RITIRO', 'PELLEGRINAGGIO',
  'CONCERTO_SACRO', 'CONFERENZA', 'ALTRO'
);

-- Tipo notifica
CREATE TYPE notification_type AS ENUM (
  'SHIFT_REMINDER', 'NEW_INTENTION', 'PARISH_UPDATE',
  'EVENT_REMINDER', 'SYSTEM', 'ADORATION_REMINDER', 'MODERATION'
);

-- Stato pubblicazione
CREATE TYPE publish_status AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'REJECTED', 'ARCHIVED');
