/**
 * Storage Service — Supabase Storage
 *
 * Bucket configurati (da creare su Supabase Dashboard):
 *   avatars    → public, 2MB max, jpg/png/webp
 *   parishes   → public, 5MB max, jpg/png/webp
 *   miracles   → public, 10MB max, jpg/png/webp + pdf 20MB
 *   documents  → private, 50MB max, pdf only
 *   thumbnails → public, 1MB max, jpg/png/webp
 */

import { supabase } from '../lib/supabase'

// ── Config ───────────────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = ['image/jpeg','image/png','image/webp']
const ALLOWED_DOC_TYPES   = ['application/pdf']

const LIMITS = {
  avatars:    2  * 1024 * 1024,   // 2MB
  parishes:   5  * 1024 * 1024,   // 5MB
  miracles:   10 * 1024 * 1024,   // 10MB
  documents:  50 * 1024 * 1024,   // 50MB
  thumbnails: 1  * 1024 * 1024,   // 1MB
} as const

type Bucket = keyof typeof LIMITS

// ── Validazione ──────────────────────────────────────────────

function validateFile(file: File, bucket: Bucket): void {
  const maxSize = LIMITS[bucket]
  if (file.size > maxSize) {
    throw new Error(`File troppo grande. Massimo ${maxSize / 1024 / 1024}MB per ${bucket}.`)
  }
  const allowedTypes = bucket === 'documents' ? ALLOWED_DOC_TYPES : ALLOWED_IMAGE_TYPES
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Tipo file non consentito. Tipi permessi: ${allowedTypes.join(', ')}`)
  }
}

/** Genera nome file sicuro (no path traversal) */
function safeName(original: string): string {
  const ext = original.split('.').pop()?.toLowerCase() ?? 'bin'
  const safe = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  return safe.replace(/[^a-z0-9.\-_]/g, '_')
}

// ── Upload functions ─────────────────────────────────────────

export const storageService = {
  /** Upload avatar utente */
  async uploadAvatar(userId: string, file: File): Promise<string> {
    validateFile(file, 'avatars')
    const path = `${userId}/avatar.${file.name.split('.').pop()}`
    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type })
    if (error) throw new Error(`Upload avatar: ${error.message}`)
    return storageService.getPublicUrl('avatars', path)
  },

  /** Upload logo/cover parrocchia */
  async uploadParishImage(
    parishId: string,
    file: File,
    type: 'logo' | 'cover' | 'gallery'
  ): Promise<string> {
    validateFile(file, 'parishes')
    const filename = type === 'gallery' ? `gallery/${safeName(file.name)}` : `${type}.${file.name.split('.').pop()}`
    const path = `${parishId}/${filename}`
    const { error } = await supabase.storage
      .from('parishes')
      .upload(path, file, { upsert: true, contentType: file.type })
    if (error) throw new Error(`Upload immagine parrocchia: ${error.message}`)
    return storageService.getPublicUrl('parishes', path)
  },

  /** Upload immagine miracolo */
  async uploadMiracleImage(miracleSlug: string, file: File): Promise<string> {
    validateFile(file, 'miracles')
    const path = `${miracleSlug}/images/${safeName(file.name)}`
    const { error } = await supabase.storage
      .from('miracles')
      .upload(path, file, { contentType: file.type })
    if (error) throw new Error(`Upload immagine miracolo: ${error.message}`)
    return storageService.getPublicUrl('miracles', path)
  },

  /** Upload documento ecclesiastico (PDF, private) */
  async uploadDocument(file: File, folder: string = 'ecclesiastical'): Promise<string> {
    validateFile(file, 'documents')
    if (file.type !== 'application/pdf') throw new Error('Solo PDF consentiti per i documenti.')
    const path = `${folder}/${safeName(file.name)}`
    const { error } = await supabase.storage
      .from('documents')
      .upload(path, file, { contentType: 'application/pdf' })
    if (error) throw new Error(`Upload documento: ${error.message}`)
    // Restituisce URL firmato (privato, scade in 1 ora)
    const { data } = await supabase.storage
      .from('documents')
      .createSignedUrl(path, 3600)
    return data?.signedUrl ?? ''
  },

  /** Upload thumbnail streaming */
  async uploadStreamThumbnail(streamId: string, file: File): Promise<string> {
    validateFile(file, 'thumbnails')
    const ext  = file.name.split('.').pop() ?? 'jpg'
    const path = `streams/${streamId}/thumb.${ext}`
    const { error } = await supabase.storage
      .from('thumbnails')
      .upload(path, file, { upsert: true, contentType: file.type })
    if (error) throw new Error(`Upload thumbnail: ${error.message}`)
    return storageService.getPublicUrl('thumbnails', path)
  },

  /** URL pubblico */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  },

  /** Elimina file */
  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) throw new Error(`Eliminazione file: ${error.message}`)
  },
}
