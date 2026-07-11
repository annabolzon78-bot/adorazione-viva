import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../../i18n'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  const current = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language)
    ?? SUPPORTED_LANGUAGES.find(l => l.code === 'it')!

  const changeLang = (code: string) => {
    i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="ls-btn"
        title={current.label}
        aria-label="Seleziona lingua"
      >
        <span style={{ fontSize: '1rem' }}>{current.label.split(' ')[0]}</span>
        <span className="ls-code">{current.code.toUpperCase()}</span>
      </button>

      {open && (
        <>
          <div className="ls-backdrop" onClick={() => setOpen(false)} />
          <div className="ls-dropdown">
            {SUPPORTED_LANGUAGES.map(l => (
              <button
                key={l.code}
                className={`ls-option ${l.code === i18n.language ? 'active' : ''}`}
                onClick={() => changeLang(l.code)}
                dir={l.dir}
              >
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
