import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const PRAYER_DATA = [
  { catKey:'adoration', ico:'🙏', titleKey:'Atto di Adorazione', subKey:'La preghiera fondamentale', text:'O Gesù, vero Dio e vero uomo, presente nel Santissimo Sacramento dell\'altare, ti adoro con profonda riverenza. Credo fermamente che sei qui presente. Ti amo sopra ogni cosa e desidero riceverti nella mia anima. Rimani con me, Signore. Amen.' },
  { catKey:'adoration', ico:'💌', titleKey:'Comunione Spirituale', subKey:'Per chi non può comunicarsi', text:'Gesù mio, credo che sei nel Santissimo Sacramento. Ti amo sopra ogni cosa e ti desidero nell\'anima mia. Poiché ora non posso riceverti sacramentalmente, vieni almeno spiritualmente nel mio cuore. Come se già fossi venuto, ti abbraccio e mi unisco tutto a te: non permettere che mi separi da te. Amen.' },
  { catKey:'saints', ico:'✝️', titleKey:'Anima Christi', subKey:'Attribuita a San Ignazio di Loyola', text:'Anima di Cristo, santificami.\nCorpo di Cristo, salvami.\nSangue di Cristo, inebriami.\nAcqua del costato di Cristo, lavami.\nPassione di Cristo, confortami.\nO buon Gesù, esaudiscimi.\nNascondimi nelle tue piaghe.\nNon permettere che mi separi da te.\nDifendimi dal nemico maligno.\nNell\'ora della mia morte chiamami\ne comanda che io venga a te,\naffinché con i tuoi santi ti lodi nei secoli. Amen.' },
  { catKey:'suffrage', ico:'🕊️', titleKey:'Per le Anime del Purgatorio', subKey:'Offri l\'adorazione in suffragio', text:'Signore Gesù, presente in questo Santissimo Sacramento, ti offro quest\'ora di adorazione a suffragio delle Anime del Purgatorio. Esse non possono pregare per sé stesse: la mia preghiera sia la loro voce davanti a te.\n\nDona loro il riposo eterno, e splenda ad essi la luce perpetua. Riposino in pace. Amen.\n\n«È cosa santa e salutare pregare per i morti.» — 2 Mac 12,46' },
  { catKey:'saints', ico:'✨', titleKey:'Tantum Ergo', subKey:'San Tommaso d\'Aquino', text:'Adoriamo dunque prostrati un sì grande Sacramento, e l\'antica figura lasci il posto alla novità; la fede supplisca ai sensi venuti meno.\n\nAl Padre e al Figlio sia data lode e giubilo, salute, onore, virtù e sia anche benedizione; a Colui che procede da entrambi uguale lode si innalzi. Amen.' },
  { catKey:'saints', ico:'🌟', titleKey:'San Pietro Giuliano Eymard', subKey:'Apostolo dell\'Eucaristia', text:'«L\'Eucaristia è il grande atto d\'amore di Gesù verso di noi. Egli è rimasto con noi non come re nel suo palazzo, ma come amico nella nostra casa.\n\nNon è forse questo il più grande dei miracoli? Il Dio dell\'universo che aspetta te. Oggi. Adesso. In quella piccola chiesa.»\n\n— San Pietro Giuliano Eymard' },
  { catKey:'reparation', ico:'💛', titleKey:'Atto di Riparazione', subKey:'Per le offese al Santissimo', text:'Dolcissimo Gesù, il cui amore immenso per gli uomini viene ripagato con tanta ingratitudine, noi ci prostriamo davanti al tuo altare per riparare con lodi speciali e adorazioni la fredda indifferenza e il disprezzo con cui gli uomini trattano il tuo Santissimo Cuore. Amen.' },
  { catKey:'adoration', ico:'📿', titleKey:'Rosario Eucaristico', subKey:'Meditazione davanti al Santissimo', text:'Il Rosario Eucaristico si prega davanti al Santissimo unendo ogni decina a un mistero:\n\n🌹 Gioiosi — Gesù viene a noi come nell\'Incarnazione\n🌹 Luminosi — Gesù istituisce l\'Eucaristia\n🌹 Dolorosi — Gesù offre il suo sacrificio\n🌹 Gloriosi — Gesù ci dà caparra della risurrezione\n\nOgni Padre Nostro: «Gesù, ti adoro qui presente.»' },
]

export function Prega() {
  const { t } = useTranslation()
  const [activeCat, setActiveCat] = useState('all')
  const [openIdx,  setOpenIdx]   = useState<number | null>(null)

  const CATS = [
    { key:'all',        label: t('prayers.all') },
    { key:'adoration',  label: t('prayers.adoration') },
    { key:'suffrage',   label: t('prayers.suffrage') },
    { key:'reparation', label: t('prayers.reparation') },
    { key:'saints',     label: t('prayers.saints') },
  ]

  const filtered = PRAYER_DATA.filter(p => activeCat === 'all' || p.catKey === activeCat)

  return (
    <div className="pg">
      <div style={{ background:'linear-gradient(135deg,var(--red),#5a0f1a)', borderRadius:14, padding:18, textAlign:'center', color:'#fff', marginBottom:14 }}>
        <div style={{ fontSize:'2rem', marginBottom:6 }}>❤️‍🔥</div>
        <div style={{ fontFamily:'Cinzel,serif', fontSize:'.95rem', marginBottom:4 }}>{t('prayers.title')}</div>
        <div style={{ fontSize:'.75rem', opacity:.75 }}>{t('prayers.tap_to_open')}</div>
      </div>

      <div style={{ display:'flex', gap:8, overflowX:'auto', marginBottom:14, paddingBottom:2 }}>
        {CATS.map(c => (
          <button key={c.key} onClick={() => setActiveCat(c.key)}
            style={{ flexShrink:0, padding:'5px 14px', borderRadius:20, fontSize:'.7rem', fontWeight:600, cursor:'pointer', border:`1.5px solid ${activeCat===c.key?'var(--red)':'var(--br)'}`, background:activeCat===c.key?'var(--red)':'var(--white)', color:activeCat===c.key?'#fff':'var(--t2)', fontFamily:'Lato,sans-serif', transition:'all .2s' }}>
            {c.label}
          </button>
        ))}
      </div>

      {filtered.map((p, i) => (
        <div key={i} style={{ background:'var(--white)', border:'1px solid var(--br)', borderRadius:12, overflow:'hidden', marginBottom:9, boxShadow:'0 1px 6px rgba(139,26,42,.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:11, padding:'13px 14px', cursor:'pointer', background:'var(--bg)' }}
            onClick={() => setOpenIdx(openIdx === i ? null : i)}>
            <span style={{ fontSize:'1.2rem', flexShrink:0 }}>{p.ico}</span>
            <div>
              <div style={{ fontWeight:600, fontSize:'.86rem', color:'var(--text)' }}>{p.titleKey}</div>
              <div style={{ fontSize:'.68rem', color:'var(--t3)', marginTop:1 }}>{p.subKey}</div>
            </div>
            <span style={{ marginLeft:'auto', color:'var(--t3)', fontSize:'.9rem', transform:openIdx===i?'rotate(90deg)':'none', transition:'transform .2s' }}>›</span>
          </div>
          {openIdx === i && (
            <div style={{ padding:'13px 14px', fontStyle:'italic', fontSize:'.9rem', color:'var(--t2)', lineHeight:1.85, borderTop:'1px solid var(--br)', whiteSpace:'pre-line' }}>{p.text}</div>
          )}
        </div>
      ))}
    </div>
  )
}
