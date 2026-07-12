import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import type { Miracle }       from '../../hooks/useMiracles'
import { fetchMiracleDetail } from '../../hooks/useMiracles'
import { MiracleGallery }     from './MiracleGallery'
import { MiracleMap }         from './MiracleMap'

const LEVEL_COLOR: Record<string, string> = {
  SCIENTIFICO:'#1e40af', PONTIFICIO:'#8b1a2a', DIOCESANO:'#8b1a2a', STORICO:'#92400e',
}
const LEVEL_LABEL: Record<string, string> = {
  SCIENTIFICO:'Oggetto di analisi', PONTIFICIO:'Riconosciuto dall\'autorità ecclesiastica',
  DIOCESANO:'Riconosciuto dall\'autorità ecclesiastica', STORICO:'Documentato storicamente',
}

type Tab = 'overview'|'science'|'church'|'media'|'map'|'docs'|'biblio'|'pilgrimages'

interface Props { miracle: Miracle | null; slug: string | null; onClose: () => void }

export function MiracleDetail({ miracle: initial, slug, onClose }: Props) {
  const [miracle, setMiracle] = useState<Miracle | null>(initial)
  const [tab,     setTab]     = useState<Tab>('overview')
  const [loading, setLoading] = useState(!initial)

  useEffect(() => {
    if (initial) { setMiracle(initial); setLoading(false); return }
    if (!slug)   return
    setLoading(true)
    fetchMiracleDetail(slug).then(m => { setMiracle(m); setLoading(false) })
  }, [initial, slug])

  if (loading) return (
    <div className="md-loading"><span>❤️‍🔥</span><span>Caricamento...</span></div>
  )
  if (!miracle) return (
    <div className="md-error"><span>Miracolo non trovato.</span><button onClick={onClose}>✕</button></div>
  )

  const { t } = useTranslation()
  const m = miracle
  const lc = LEVEL_COLOR[m.verificationLevel] ?? '#6b7280'

  const TABS = [
    { id:'overview',    label:'📖 Descrizione' },
    { id:'science',     label:'🔬 Scienza',   show: !!m.scientificAnalysis },
    { id:'church',      label:'⛪ Riconoscimento', show: !!(m.ecclesiasticalRecognition || m.officialRecognition) },
    { id:'media',       label:`🖼 Media (${(m.images?.length??0)+(m.videos?.length??0)})` },
    { id:'map',         label:'🗺 Mappa',     show: !!(m.lat && m.lng) },
    { id:'docs',        label:`📄 Documenti (${m.documents?.length??0})`, show: (m.documents?.length??0) > 0 },
    { id:'biblio',      label:`📚 Biblio (${m.bibliography?.length??0})`, show: (m.bibliography?.length??0) > 0 },
    { id:'pilgrimages', label:`🛐 Pellegrinaggi (${m.pilgrimages?.length??0})`, show: (m.pilgrimages?.length??0) > 0 },
  ].filter((t): t is { id: Tab; label: string; show?: boolean } => t.show !== false)

  return (
    <div className="md-wrap">
      {/* Header */}
      <div className="md-header">
        <div className="md-header-top">
          <div>
            <div className="md-title">{m.title}</div>
            <div className="md-loc">
              {m.country?.flagEmoji} {m.location}{m.city ? `, ${m.city}` : ''}{m.state ? ` (${m.state})` : ''}
              {m.yearCa ? ` · ${m.yearCa}` : m.year ? ` · ${m.year}` : ''}
            </div>
          </div>
          <button className="md-close" onClick={onClose}>✕</button>
        </div>
        <div className="md-badges">
          <span className="md-badge" style={{ background: lc, color:'#fff' }}>{LEVEL_LABEL[m.verificationLevel]}</span>
          {m.isVisitableToday && <span className="md-badge md-badge-visit">📍 Visitabile oggi</span>}
          {m.bloodType && <span className="md-badge md-badge-info">🩸 Sangue {m.bloodType}</span>}
          {m.tissueType && <span className="md-badge md-badge-info">🫀 {m.tissueType.split('—')[0].trim()}</span>}
        </div>
      </div>

      {/* Tabs */}
      <div className="md-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`md-tab ${tab === t.id ? 'md-tab-active' : ''}`}
            onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div className="md-content">

        {tab === 'overview' && (
          <div className="md-section">
            <p className="md-summary">{m.summary}</p>
            {m.context && <><div className="md-section-label">{t('miracles.historical_context')}</div><p className="md-text">{m.context}</p></>}
            {m.miracle && <><div className="md-section-label">{t('miracles.the_event')}</div><p className="md-text">{m.miracle}</p></>}
            {m.fullDescription && !m.miracle && <p className="md-text">{m.fullDescription}</p>}
            {m.aftermath && <><div className="md-section-label">{t('miracles.history_aftermath')}</div><p className="md-text">{m.aftermath}</p></>}
            {m.conservedAt && (
              <div className="md-info-box">
                <div className="md-info-label">{t('miracles.conserved_at')}</div>
                <div className="md-info-val">{m.conservedAt}</div>
                {m.openingHours && <div className="md-info-sub">⏰ {m.openingHours}</div>}
                {m.entryFee    && <div className="md-info-sub">🎟 {m.entryFee}</div>}
                {m.accessInfo  && <div className="md-info-sub">ℹ️ {m.accessInfo}</div>}
              </div>
            )}
          </div>
        )}

        {tab === 'science' && (
          <div className="md-section">
            <div className="md-sci-grid">
              {m.tissueType && <div className="md-sci-card"><div className="md-sci-l">{t('miracles.tissue')}</div><div className="md-sci-v">🫀 {m.tissueType}</div></div>}
              {m.bloodType  && <div className="md-sci-card"><div className="md-sci-l">{t('miracles.blood_type')}</div><div className="md-sci-v">🩸 {m.bloodType}</div></div>}
              {m.analyzedBy && <div className="md-sci-card"><div className="md-sci-l">{t('miracles.analyzed_by')}</div><div className="md-sci-v">🔬 {m.analyzedBy}</div></div>}
              {m.analysisYear && <div className="md-sci-card"><div className="md-sci-l">{t('miracles.analysis_year')}</div><div className="md-sci-v">📅 {m.analysisYear}</div></div>}
              {m.analysisInstitution && <div className="md-sci-card md-sci-full"><div className="md-sci-l">{t('miracles.institution')}</div><div className="md-sci-v">🏫 {m.analysisInstitution}</div></div>}
            </div>
            {m.scientificAnalysis && <><div className="md-section-label">{t('miracles.analysis_detail')}</div><p className="md-text">{m.scientificAnalysis}</p></>}
          </div>
        )}

        {tab === 'church' && (
          <div className="md-section">
            {m.officialRecognition && <div className="md-info-box"><div className="md-info-label">✝️ RICONOSCIMENTO UFFICIALE</div><div className="md-info-val">{m.officialRecognition}</div></div>}
            {m.recognizedBy && <div className="md-info-box"><div className="md-info-label">👤 RICONOSCIUTO DA</div><div className="md-info-val">{m.recognizedBy}{m.recognitionYear ? ` (${m.recognitionYear})` : ''}</div></div>}
            {m.ecclesiasticalRecognition && <><div className="md-section-label">{t('miracles.ecclesiastical_detail')}</div><p className="md-text">{m.ecclesiasticalRecognition}</p></>}
          </div>
        )}

        {tab === 'media' && (
          <div className="md-section">
            {(m.images?.length ?? 0) > 0 && (
              <><div className="md-section-label">{t('miracles.images')}</div>
              <MiracleGallery images={m.images ?? []} title={m.title} /></>
            )}
            {(m.videos?.length ?? 0) > 0 && (
              <><div className="md-section-label" style={{marginTop:16}}>{t('miracles.videos')}</div>
              <div className="md-videos">
                {m.videos!.map(v => (
                  <div key={v.id} className="md-video-item">
                    {v.embedUrl
                      ? <div className="md-video-embed"><iframe src={v.embedUrl} allowFullScreen title={v.title} className="md-video-iframe"/></div>
                      : <a href={v.url} target="_blank" rel="noopener noreferrer" className="md-video-link">▶ {v.title}</a>
                    }
                    {v.description && <div className="md-video-desc">{v.description}</div>}
                  </div>
                ))}
              </div></>
            )}
            {!m.images?.length && !m.videos?.length && (
              <div className="md-empty">Nessun contenuto multimediale disponibile.</div>
            )}
          </div>
        )}

        {tab === 'map' && m.lat && m.lng && (
          <div className="md-section">
            <MiracleMap lat={m.lat} lng={m.lng} title={m.title} isVisitable={m.isVisitableToday} />
            {m.visitingInfo && <div className="md-info-box" style={{marginTop:12}}><div className="md-info-label">ℹ️ INFO VISITA</div><div className="md-info-val">{m.visitingInfo}</div></div>}
          </div>
        )}

        {tab === 'docs' && (
          <div className="md-section">
            {m.documents?.map(d => (
              <a key={d.id} href={d.url} target="_blank" rel="noopener noreferrer" className="md-doc-item">
                <div className="md-doc-type">{d.fileType}</div>
                <div className="md-doc-info">
                  <div className="md-doc-title">{d.title}</div>
                  {d.author && <div className="md-doc-meta">{d.author}{d.year ? ` · ${d.year}` : ''}</div>}
                  {d.description && <div className="md-doc-desc">{d.description}</div>}
                </div>
                <div className="md-doc-arrow">↗</div>
              </a>
            ))}
          </div>
        )}

        {tab === 'biblio' && (
          <div className="md-section">
            {m.bibliography?.map((b, i) => (
              <div key={b.id} className="md-bib-item">
                <div className="md-bib-num">{i + 1}</div>
                <div className="md-bib-body">
                  <div className="md-bib-authors">{b.authors}</div>
                  <div className="md-bib-title">{b.url ? <a href={b.url} target="_blank" rel="noopener noreferrer">{b.title} ↗</a> : b.title}</div>
                  <div className="md-bib-meta">
                    {[b.publisher, b.journal, b.volume && `vol. ${b.volume}`, b.pages && `pp. ${b.pages}`, b.year].filter(Boolean).join(' · ')}
                  </div>
                  {b.isbn && <div className="md-bib-isbn">ISBN: {b.isbn}</div>}
                  {b.notes && <div className="md-bib-notes">{b.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'pilgrimages' && (
          <div className="md-section">
            {m.pilgrimages?.map(p => (
              <div key={p.id} className="md-pilg-item">
                <div className="md-pilg-name">{p.name}</div>
                <div className="md-pilg-loc">📍 {p.location}</div>
                {p.organizer  && <div className="md-pilg-meta">👥 {p.organizer}</div>}
                {p.frequency  && <div className="md-pilg-meta">🗓 {p.frequency}</div>}
                {p.nextDate   && <div className="md-pilg-meta">📅 Prossima data: {new Date(p.nextDate).toLocaleDateString('it-IT')}</div>}
                {p.description && <p className="md-pilg-desc">{p.description}</p>}
                {p.websiteUrl  && <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="md-pilg-link">Sito web ↗</a>}
              </div>
            ))}
          </div>
        )}

        {/* Fonti */}
        {tab === 'overview' && (m as any).sources?.length > 0 && (
          <div className="md-sources">
            <div className="md-section-label">{t('miracles.sources')}</div>
            {((m as any).sources as string[]).map((s, i) => (
              <a key={i} href={s} target="_blank" rel="noopener noreferrer" className="md-source-link">{s}</a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
