import { useEffect, useRef, useState } from 'react'
import type { StreamData } from '../../hooks/useStreams'

interface Props {
  stream:   StreamData
  autoplay?: boolean
}

export function StreamPlayer({ stream, autoplay = true }: Props) {
  const videoRef  = useRef<HTMLVideoElement>(null)
  const hlsRef    = useRef<any>(null)
  const [error, setError]   = useState<string | null>(null)
  const [ready, setReady]   = useState(false)

  // Carica HLS.js solo quando necessario
  useEffect(() => {
    if (stream.type !== 'HLS' || !videoRef.current) return
    const url = stream.hlsUrl ?? stream.url

    const initHls = async () => {
      try {
        const { default: Hls } = await import('hls.js')
        if (Hls.isSupported()) {
          const hls = new Hls({ enableWorker: false })
          hls.loadSource(url)
          hls.attachMedia(videoRef.current!)
          hls.on(Hls.Events.MANIFEST_PARSED, () => { setReady(true); if (autoplay) videoRef.current?.play().catch(() => {}) })
          hls.on(Hls.Events.ERROR, (_e: any, d: any) => { if (d.fatal) setError('Stream non disponibile') })
          hlsRef.current = hls
        } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.current.src = url
          videoRef.current.addEventListener('loadedmetadata', () => setReady(true))
        } else {
          setError('Il tuo browser non supporta questo tipo di stream')
        }
      } catch { setError('Errore nel caricamento del player') }
    }
    initHls()
    return () => { hlsRef.current?.destroy(); hlsRef.current = null }
  }, [stream.type, stream.hlsUrl, stream.url, autoplay])

  // ── YouTube / Vimeo ──────────────────────────────────────
  if (stream.type === 'YOUTUBE_LIVE' || stream.type === 'YOUTUBE_CHANNEL') {
    // Niente iframe: YouTube mostra pubblicità dentro l'embed e non esiste
    // un parametro per toglierla. Mostriamo un'anteprima statica cliccabile
    // che apre YouTube in una scheda esterna — zero pubblicità dentro l'app.
    const watchUrl = stream.url ?? (stream.videoId ? `https://www.youtube.com/watch?v=${stream.videoId}` : null)
    if (!stream.videoId || !watchUrl) return <PlayerError message="Video YouTube non disponibile" stream={stream} />
    return (
      <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="player-wrap" style={{ display:'block', position:'relative', textDecoration:'none' }}>
        <img
          src={`https://img.youtube.com/vi/${stream.videoId}/hqdefault.jpg`}
          alt={stream.title}
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
        />
        <div style={{ position:'absolute', inset:0, background:'rgba(8,5,10,.35)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(0,0,0,.55)', border:'2px solid #e8d08a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', color:'#e8d08a' }}>
            ▶
          </div>
        </div>
      </a>
    )
  }

  if (stream.type === 'VIMEO') {
    const src = stream.embedUrl ?? (stream.videoId
      ? `https://player.vimeo.com/video/${stream.videoId}?autoplay=${autoplay ? 1 : 0}&color=8b1a2a`
      : null)
    if (!src) return <PlayerError message="ID Vimeo non trovato" stream={stream} />
    return (
      <div className="player-wrap">
        <iframe
          src={src}
          className="player-iframe"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={stream.title}
        />
      </div>
    )
  }

  if (stream.type === 'FACEBOOK_LIVE') {
    const encoded = encodeURIComponent(stream.url)
    const src = `https://www.facebook.com/plugins/video.php?href=${encoded}&autoplay=${autoplay ? 'true' : 'false'}&show_text=false`
    return (
      <div className="player-wrap">
        <iframe
          src={src}
          className="player-iframe"
          allow="autoplay; fullscreen"
          allowFullScreen
          scrolling="no"
          title={stream.title}
        />
      </div>
    )
  }

  if (stream.type === 'CUSTOM_EMBED' && stream.embedHtml) {
    return (
      <iframe
          className="player-iframe"
          srcDoc={stream.embedHtml}
          sandbox="allow-scripts allow-same-origin allow-presentation"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{ width:'100%', height:'100%', border:'none' }}
          title={stream.title}
        />
    )
  }

  if (stream.type === 'RTSP') {
    return (
      <div className="player-wrap">
        <div className="player-rtsp-msg">
          <div className="prm-icon">🔗</div>
          <div className="prm-title">Stream RTSP</div>
          <div className="prm-text">
            Gli stream RTSP richiedono un proxy backend per essere visualizzati nel browser.
            Contatta l'amministratore per abilitare la conversione HLS.
          </div>
          <a href={stream.url} className="prm-link" target="_blank" rel="noopener noreferrer">
            Apri nel player esterno ↗
          </a>
        </div>
      </div>
    )
  }

  // ── HLS ─────────────────────────────────────────────────
  if (stream.type === 'HLS') {
    if (error) return <PlayerError message={error} stream={stream} />
    return (
      <div className="player-wrap">
        {!ready && <div className="player-loading"><span>❤️‍🔥</span><span>Connessione in corso...</span></div>}
        <video
          ref={videoRef}
          className="player-video"
          controls
          playsInline
          style={{ opacity: ready ? 1 : 0 }}
        />
      </div>
    )
  }

  return <PlayerError message="Tipo di stream non supportato" stream={stream} />
}

function PlayerError({ message, stream }: { message: string; stream: StreamData }) {
  return (
    <div className="player-wrap">
      <div className="player-error">
        <div className="pe-icon">⛪</div>
        <div className="pe-msg">{message}</div>
        <a href={stream.url} target="_blank" rel="noopener noreferrer" className="pe-link">
          Apri lo stream originale ↗
        </a>
      </div>
    </div>
  )
}

/*
 * NOTE HLS.js bundle size:
 * hls.js produce un chunk da ~525KB (gzip: ~162KB).
 * È caricato in modo lazy SOLO per stream di tipo HLS.
 * Non impatta il caricamento iniziale dell'app.
 * YouTube/Vimeo/Facebook non richiedono hls.js.
 * Non è possibile ridurre ulteriormente senza fork della libreria.
 */
