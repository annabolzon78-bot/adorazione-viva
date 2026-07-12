import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header }    from './Header'
import { BottomNav } from './BottomNav'

// Playlist di musica sacra di sottofondo — canti gregoriani/eucaristici
// tradizionali. Tutti da Wikimedia Commons, licenza libera (GFDL/CC-BY-SA).
// NOTA: i link non sono verificabili con gli strumenti di rete di questo
// ambiente (dominio non raggiungibile da qui) — va controllato che
// l'audio parta davvero una volta pubblicato.
const SACRED_TRACKS = [
  {
    title: 'Tantum Ergo',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Tantum_Ergo_I_Gregorian.ogg',
    credit: 'Gareth Hughes — Wikimedia Commons',
  },
  {
    title: 'Ave Verum Corpus',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Ave_Verum_Corpus_-_Duvnant_Male_Voice_Choir.ogg',
    credit: 'Duvnant Male Voice Choir — Wikimedia Commons',
  },
  {
    title: 'Pater Noster',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Schola_Gregoriana-Pater_Noster.ogg',
    credit: 'Schola Gregoriana — Wikimedia Commons',
  },
  {
    title: 'Rorate Caeli',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Rorate_Caeli_~_Gregorian_Chant.ogg',
    credit: 'Canto gregoriano — Wikimedia Commons',
  },
  {
    title: 'Gloria',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/GloriaGregorianChant.ogg',
    credit: 'Canto gregoriano — Wikimedia Commons',
  },
]

export function Layout() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying]   = useState(false)
  const [trackIdx, setTrackIdx] = useState(0)
  const track = SACRED_TRACKS[trackIdx]

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }

  const nextTrack = () => {
    setTrackIdx(i => (i + 1) % SACRED_TRACKS.length)
  }

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.load()
    if (playing) {
      audioRef.current.play().catch(() => setPlaying(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIdx])

  return (
    <div id="app">
      <Header />
      <main style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <BottomNav />

      <audio ref={audioRef} src={track.url} preload="none" onEnded={nextTrack} />

      <div style={{ position: 'fixed', bottom: 78, right: 16, zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        {playing && (
          <div style={{
            background: 'rgba(20,10,6,.9)', border: '1px solid #e8d08a', borderRadius: 10,
            padding: '5px 10px', fontSize: '.62rem', color: '#e8d08a', maxWidth: 150, textAlign: 'right',
          }}>
            {track.title}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={nextTrack}
            aria-label={`Cambia brano — attuale: ${track.title}`}
            title="Prossimo brano"
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(20,10,6,.85)', border: '1.5px solid #e8d08a',
              color: '#e8d08a', fontSize: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0,0,0,.35)', cursor: 'pointer', flexShrink: 0,
            }}
          >
            ⏭
          </button>
          <button
            onClick={toggleMusic}
            aria-label={playing ? 'Metti in pausa la musica sacra' : 'Attiva la musica sacra di sottofondo'}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              height: 56, padding: '0 18px 0 16px', borderRadius: 28,
              background: playing ? 'linear-gradient(135deg,#b8932a,#d4af37)' : 'rgba(20,10,6,.9)',
              border: '2px solid #e8d08a',
              color: playing ? '#2a1a05' : '#e8d08a', fontSize: '1.5rem', fontWeight: 700,
              boxShadow: playing ? '0 4px 20px rgba(212,175,55,.55)' : '0 4px 14px rgba(0,0,0,.4)',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <span>{playing ? '🔊' : '🔈'}</span>
            <span style={{ fontSize: '.78rem', fontFamily: 'Cinzel,serif', letterSpacing: '.03em' }}>
              {playing ? 'Musica' : 'Musica'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
