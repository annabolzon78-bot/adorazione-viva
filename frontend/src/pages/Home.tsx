import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const STREAMS = [
  'https://www.youtube.com/embed/hMNLrStmcTs?autoplay=1&rel=0&modestbranding=1',
  'https://www.youtube.com/embed/GlGkFWPKomU?autoplay=1&rel=0&modestbranding=1',
]

export function Home() {
  const { t } = useTranslation()
  const navigate  = useNavigate()
  const [count,   setCount]      = useState(18427)
  const [adoring, setAdoring]    = useState(false)
  const [liveIdx, setLiveIdx]    = useState(0)

  useEffect(() => {
    const tick = setInterval(() => {
      setCount(v => v + Math.floor(Math.sin(Date.now() / 9000) * 200 + Math.random() * 60 - 30))
    }, 5000)
    return () => clearInterval(tick)
  }, [])

  const toggle = () => { setAdoring(p => !p); setCount(v => v + (adoring ? -1 : 1)) }

  const SHORTCUTS = [
    { ico:'🗺️', lbl: t('home.find_jesus'),  sub: t('home.find_jesus_sub'),  to:'/trova' },
    { ico:'🙏', lbl: t('home.pray'),         sub: t('home.pray_sub'),         to:'/prega' },
    { ico:'🌍', lbl: t('home.chain'),        sub: t('home.chain_sub'),        to:'/catena' },
    { ico:'👥', lbl: t('home.community'),    sub: t('home.community_sub'),    to:'/comunita' },
  ]

  return (
    <div className="pg home-page">
      <div className="home-hero">
        <span className="hh-crown">❤️‍🔥</span>
        <div className="hh-title">{t('home.hero_title')}</div>
        <div className="hh-sub">{t('home.hero_sub')}</div>
      </div>

      <div style={{ textAlign:'center', margin:'12px 0' }}>
        <span className="live-chip">
          <span className="ldot"/>
          {count.toLocaleString()} {t('home.people_adoring')} · 132 {t('home.nations')}
        </span>
      </div>

      <div className="home-stats">
        <div className="hs-item"><span className="hs-num">4.218</span><span className="hs-lbl">{t('home.chapels_world')}</span></div>
        <div className="hs-item"><span className="hs-num">312</span><span className="hs-lbl">{t('home.perpetual_count')}</span></div>
        <div className="hs-item"><span className="hs-num">{count.toLocaleString()}</span><span className="hs-lbl">{t('home.adorers_now')}</span></div>
      </div>

      <button
        className="home-adoration-btn"
        style={adoring ? { background:'linear-gradient(135deg,#166534,#15803d)' } : {}}
        onClick={toggle}
      >
        {adoring ? t('home.adoring_active') : t('home.adoring_now')}
      </button>

      <div className="home-cta-grid">
        {SHORTCUTS.map(({ ico, lbl, sub, to }) => (
          <div key={to} className="hcg-btn" onClick={() => navigate(to)}>
            <span className="hcg-icon">{ico}</span>
            <span className="hcg-label">{lbl}</span>
            <span className="hcg-sub">{sub}</span>
          </div>
        ))}
      </div>

      <div style={{ background:'#08050a', borderRadius:14, overflow:'hidden', marginBottom:14 }}>
        <iframe
          src={STREAMS[liveIdx]}
          style={{ width:'100%', aspectRatio:'16/9', border:'none', display:'block' }}
          allow="autoplay; fullscreen; picture-in-picture"
          title={t('home.live_label')}
        />
        <div style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:8 }}>
          <span className="ldot"/>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:'.72rem', color:'#e8d08a' }}>{t('home.live_label')}</div>
          </div>
          <div style={{ marginLeft:'auto', fontSize:'.62rem', color:'rgba(245,237,224,.45)', cursor:'pointer', borderBottom:'1px solid rgba(245,237,224,.2)' }}
            onClick={() => setLiveIdx(i => (i + 1) % STREAMS.length)}>
            {t('home.chapel2')}
          </div>
        </div>
      </div>

      <div style={{ background:'var(--goldl)', border:'1px solid var(--goldb)', borderRadius:10, padding:'12px 14px', textAlign:'center', fontStyle:'italic', fontSize:'.83rem', color:'var(--t2)', lineHeight:1.7 }}>
        {t('home.quote_jp2')}
        <span style={{ display:'block', fontSize:'.62rem', color:'var(--t3)', marginTop:4, fontStyle:'normal' }}>{t('home.quote_jp2_author')}</span>
      </div>
    </div>
  )
}
