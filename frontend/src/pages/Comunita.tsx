import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function Comunita() {
  const { t, i18n } = useTranslation()
  const [lang, setLang] = useState(i18n.language || 'it')

  const challenges = [
    { ico:'⏱️', nameKey:'challenge_10min',     descKey:'challenge_10min_desc',     current:10,  total:10  },
    { ico:'🕐', nameKey:'challenge_1hour',      descKey:'challenge_1hour_desc',     current:39,  total:60  },
    { ico:'🌙', nameKey:'challenge_night',      descKey:'challenge_night_desc',     current:0,   total:1   },
    { ico:'⛪', nameKey:'challenge_10churches', descKey:'challenge_10churches_desc', current:3,   total:10  },
    { ico:'🏆', nameKey:'challenge_100hours',   descKey:'challenge_100hours_desc',  current:39,  total:100 },
  ]

  const langs = ['it','en','es','fr','de','pt','pl','zh','ja','ko','ar']

  const changeLang = (code: string) => { setLang(code); i18n.changeLanguage(code) }

  return (
    <div className="pg">
      <div style={{ fontFamily:'Cinzel,serif', fontSize:'.68rem', letterSpacing:'.14em', color:'var(--red)', marginBottom:10 }}>{t('community.challenges_title')}</div>
      <div style={{ background:'var(--redl)', border:'1px solid var(--redb)', borderRadius:10, padding:'12px 14px', marginBottom:12, fontSize:'.8rem', color:'var(--t2)', lineHeight:1.6 }}>
        {t('community.challenges_intro')}
      </div>

      {challenges.map((c, i) => {
        const pct  = Math.min(100, Math.round(c.current / c.total * 100))
        const done = pct >= 100
        return (
          <div key={i} style={{ background:'var(--white)', border:'1px solid var(--br)', borderRadius:12, padding:14, marginBottom:9 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'var(--redl)', border:'1px solid var(--redb)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>{c.ico}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:'.88rem', color:'var(--text)', marginBottom:2 }}>{t(`community.${c.nameKey}`)}</div>
                <div style={{ fontSize:'.72rem', color:'var(--t3)' }}>{t(`community.${c.descKey}`)}</div>
              </div>
            </div>
            <div style={{ height:6, background:'var(--br)', borderRadius:3, overflow:'hidden', marginBottom:6 }}>
              <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,var(--red),#b02235)', borderRadius:3 }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.68rem', color:'var(--t3)' }}>
              {done ? <span style={{ color:'var(--red)', fontWeight:700 }}>{t('community.completed')}</span> : <span>{c.current}/{c.total}</span>}
              <span>{done ? '' : t('community.in_progress')}</span>
            </div>
          </div>
        )
      })}

      <div style={{ fontFamily:'Cinzel,serif', fontSize:'.68rem', letterSpacing:'.14em', color:'var(--red)', marginTop:6, marginBottom:10 }}>{t('community.testimonials_title')}</div>
      {[
        { text:'«Ho iniziato a fare un\'ora di adorazione alla settimana. L\'adorazione ha cambiato il mio matrimonio, il mio rapporto con i figli, la mia pace interiore.»', name:'Francesca M.', loc:'Milano, Italia' },
        { text:'«Sono un medico. Ho iniziato a fermarmi in cappella prima dei turni di notte. Adesso non mi manca mai.»', name:'Dr. António S.', loc:'Lisbona, Portogallo' },
      ].map((tes, i) => (
        <div key={i} style={{ background:'var(--white)', border:'1px solid var(--br)', borderRadius:12, padding:14, marginBottom:9 }}>
          <div style={{ fontSize:'.9rem', fontStyle:'italic', color:'var(--t2)', lineHeight:1.7, marginBottom:8 }}>{tes.text}</div>
          <div style={{ fontSize:'.75rem', fontWeight:600, color:'var(--red)' }}>{tes.name}</div>
          <div style={{ fontSize:'.7rem', color:'var(--t3)' }}>{tes.loc}</div>
        </div>
      ))}

      <div style={{ fontFamily:'Cinzel,serif', fontSize:'.68rem', letterSpacing:'.14em', color:'var(--red)', marginBottom:10 }}>{t('community.parishes_title')}</div>
      <div style={{ background:'var(--white)', border:'1px solid var(--br)', borderRadius:12, overflow:'hidden', marginBottom:9 }}>
        <div style={{ background:'var(--redl)', borderBottom:'1px solid var(--redb)', padding:'12px 14px', display:'flex', gap:10 }}>
          <span style={{ fontSize:'1.4rem' }}>⛪</span>
          <div><div style={{ fontWeight:700, fontSize:'.88rem', color:'var(--red)' }}>St Mary's Parish</div>
          <div style={{ fontSize:'.7rem', color:'var(--t2)' }}>Navan, Co. Meath — Irlanda 🇮🇪</div></div>
        </div>
        <div style={{ padding:'12px 14px' }}>
          {[['community.adoration','community.perpetual_24h'],['community.streaming','community.live_youtube'],['community.open_shifts',`3 ${t('community.available')}`],['community.registered_adorers','247']].map(([lk,v],i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:'.78rem', padding:'4px 0', borderBottom:'1px solid var(--bg)', color:'var(--t2)' }}>
              <span style={{ fontSize:'.72rem', color:'var(--t3)' }}>{t(lk)}</span>
              <span>{lk.includes('streaming') || lk.includes('adoration') ? t(v) : v}</span>
            </div>
          ))}
        </div>
      </div>

      <button style={{ width:'100%', padding:12, background:'var(--red)', color:'#fff', border:'none', borderRadius:10, fontFamily:'Cinzel,serif', fontSize:'.8rem', letterSpacing:'.08em', cursor:'pointer', marginBottom:14 }}>
        {t('community.register_parish')}
      </button>

      <div style={{ fontFamily:'Cinzel,serif', fontSize:'.68rem', letterSpacing:'.14em', color:'var(--red)', marginBottom:10 }}>{t('community.languages_title')}</div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:14 }}>
        {langs.map(l => (
          <div key={l} onClick={() => changeLang(l)}
            style={{ padding:'5px 12px', background:lang===l?'var(--red)':'var(--white)', border:`1px solid ${lang===l?'var(--red)':'var(--br)'}`, borderRadius:20, fontSize:'.72rem', color:lang===l?'#fff':'var(--t2)', cursor:'pointer', transition:'all .2s' }}>
            {t(`lang.${l}`)}
          </div>
        ))}
      </div>

      <div style={{ background:'var(--goldl)', border:'1px solid var(--goldb)', borderRadius:10, padding:'12px 14px', textAlign:'center', fontStyle:'italic', fontSize:'.83rem', color:'var(--t2)', lineHeight:1.7 }}>
        {t('community.vision_quote')}
        <span style={{ display:'block', fontSize:'.62rem', color:'var(--t3)', marginTop:4, fontStyle:'normal' }}>{t('community.vision_author')}</span>
      </div>
    </div>
  )
}
