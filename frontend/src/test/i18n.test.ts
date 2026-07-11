import { describe, it, expect } from 'vitest'
import it_json from '../i18n/locales/it/translation.json'
import en_json from '../i18n/locales/en/translation.json'
import ar_json from '../i18n/locales/ar/translation.json'

describe('i18n translation files', () => {
  const ALL_LANGS = ['it','en','es','fr','de','pt','pl','zh','ja','ko','ar'] as const

  it('italiano ha tutte le sezioni principali', () => {
    const sections = ['nav','common','home','map','live','miracles','prayers','catena','community','lang']
    sections.forEach(s => {
      expect(it_json).toHaveProperty(s)
    })
  })

  it('inglese ha le stesse chiavi di navigazione dell\'italiano', () => {
    const itNav = Object.keys(it_json.nav)
    const enNav = Object.keys(en_json.nav)
    expect(enNav).toEqual(itNav)
  })

  it('arabo ha chiave lang.ar', () => {
    expect(ar_json.lang).toBeDefined()
    expect(ar_json.lang.ar).toBeDefined()
  })

  it('nessun file di traduzione è vuoto', () => {
    ;[it_json, en_json, ar_json].forEach(f => {
      expect(Object.keys(f).length).toBeGreaterThan(0)
    })
  })
})
