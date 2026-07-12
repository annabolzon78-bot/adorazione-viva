import { useState, useEffect, useCallback, useRef } from 'react'

export interface MiracleImage     { id:string; url:string; caption?:string; credit?:string; altText?:string; isCover:boolean; sortOrder:number }
export interface MiracleVideo     { id:string; title:string; url:string; embedUrl?:string; platform:string; videoId?:string; description?:string; duration?:number; language?:string }
export interface MiracleDocument  { id:string; title:string; url:string; fileType:string; description?:string; year?:number; author?:string; language?:string }
export interface MiracleBiblio    { id:string; authors:string; title:string; publisher?:string; year?:number; journal?:string; volume?:string; pages?:string; isbn?:string; doi?:string; url?:string; type:string; language?:string; notes?:string }
export interface MiraclePilgrimage{ id:string; name:string; description?:string; location:string; lat?:number; lng?:number; websiteUrl?:string; contactEmail?:string; phone?:string; organizer?:string; frequency?:string; nextDate?:string; imageUrl?:string }

export interface Miracle {
  id:                       string
  title:                    string
  slug:                     string
  location:                 string
  city?:                    string
  state?:                   string
  continent:                string
  year?:                    number
  yearCa?:                  string
  verificationLevel:        'STORICO'|'DIOCESANO'|'PONTIFICIO'|'SCIENTIFICO'
  summary:                  string
  fullDescription?:         string
  context?:                 string
  miracle?:                 string
  aftermath?:               string
  scientificAnalysis?:      string
  tissueType?:              string
  bloodType?:               string
  analyzedBy?:              string
  analysisYear?:            number
  analysisInstitution?:     string
  ecclesiasticalRecognition?:string
  officialRecognition?:     string
  recognizedBy?:            string
  recognitionYear?:         number
  isVisitableToday:         boolean
  visitingInfo?:            string
  conservedAt?:             string
  openingHours?:            string
  entryFee?:                string
  accessInfo?:              string
  imageUrl?:                string
  thumbnailUrl?:            string
  lat?:                     number
  lng?:                     number
  country?:                 { code:string; nameIt:string; flagEmoji?:string }
  saints?:                  { id:string; name:string; slug:string }[]
  images:                   MiracleImage[]
  videos:                   MiracleVideo[]
  documents:                MiracleDocument[]
  bibliography:             MiracleBiblio[]
  pilgrimages:              MiraclePilgrimage[]
  _count?:                  { images:number; videos:number; documents:number; bibliography:number; pilgrimages:number }
  viewCount:                number
  featuredOrder?:           number
}

export interface MiracleFilter {
  q?:                string
  continent?:        string
  countryId?:        string
  verificationLevel?:string
  yearFrom?:         number
  yearTo?:           number
  isVisitable?:      boolean
  hasScience?:       boolean
  hasVideo?:         boolean
  sortBy?:           string
  sortDir?:          'asc'|'desc'
}

// 15 miracoli documentati come fallback
const FALLBACK: Miracle[] = [
  { id:'1', title:'Lanciano', slug:'lanciano', location:'Lanciano', city:'Lanciano', state:'Abruzzo', continent:'EUROPA', year:750, yearCa:'VIII secolo d.C.', verificationLevel:'SCIENTIFICO', summary:'Durante la Messa di un monaco basiliano in dubbio sulla presenza reale, il pane consacrato si trasformò in carne e il vino in sangue. È il miracolo eucaristico più antico documentato e il più studiato.', scientificAnalysis:'Analisi del 1970 (Prof. Odoardo Linoli): tessuto muscolare cardiaco umano (miocardio del ventricolo sinistro), sangue tipo AB, struttura intatta dopo 12 secoli. 500 scienziati ONU: nessuna spiegazione naturale.', tissueType:'Miocardio — ventricolo sinistro', bloodType:'AB', analyzedBy:'Prof. Odoardo Linoli; OMS (500 scienziati)', analysisYear:1970, analysisInstitution:'Università di Siena; OMS', officialRecognition:'Riconosciuto dalla Chiesa dall\'VIII secolo', ecclesiasticalRecognition:'Conservato e venerato dal VIII secolo nella Basilica del Miracolo Eucaristico di Lanciano. Approvato da numerosi vescovi e da delegazioni pontificie nel corso dei secoli.', recognizedBy:'Vescovado di Lanciano; Delegazioni pontificie', isVisitableToday:true, visitingInfo:'Basilica del Miracolo Eucaristico, Lanciano (CH)', conservedAt:'Basilica del Miracolo Eucaristico, Lanciano', openingHours:'Mar-Dom 9:00-12:00, 16:00-19:00', imageUrl:'https://upload.wikimedia.org/wikipedia/commons/b/b6/Miracolo_Eucaristico_di_Lanciano_-_foto_dal_vivo.JPG', thumbnailUrl:'', country:{ code:'IT', nameIt:'Italia', flagEmoji:'🇮🇹' }, images:[], videos:[], documents:[], bibliography:[ { id:'b1', authors:'Linoli O.', title:'Ricerche istologiche, immunologiche ed elettroforetiche del miracolo eucaristico di Lanciano', publisher:'Quaderni Sclavo di diagnostica', year:1971, type:'ARTICLE', journal:'Quaderni Sclavo', volume:'7', pages:'661–674' } ], pilgrimages:[ { id:'p1', name:'Pellegrinaggio a Lanciano', location:'Lanciano, Abruzzo, Italia', frequency:'Tutto l\'anno', organizer:'Frati Minori Conventuali' } ], viewCount:0, featuredOrder:1 },
  { id:'2', title:'Buenos Aires', slug:'buenos-aires', location:'Buenos Aires', city:'Buenos Aires', continent:'AMERICA_SUD', year:1996, yearCa:'1992, 1994, 1996', verificationLevel:'SCIENTIFICO', summary:'In tre episodi distinti, alcune ostie cadute mostrarono una trasformazione in tessuto. Le analisi furono autorizzate dall\'allora arcivescovo di Buenos Aires, il cardinale Jorge Mario Bergoglio, poi Papa Francesco.', scientificAnalysis:'Prof. Frederick Zugibe (cardiologo Columbia NY): miocardio del ventricolo sinistro, globuli bianchi vivi in movimento, sangue AB. DNA identico ai campioni di Lanciano a 800 anni di distanza.', tissueType:'Miocardio — ventricolo sinistro', bloodType:'AB', analyzedBy:'Prof. Frederick Zugibe', analysisYear:1999, analysisInstitution:'Columbia University, New York', officialRecognition:'Autorizzato dal Card. Bergoglio (futuro Papa Francesco)', ecclesiasticalRecognition:'Il Cardinal Jorge Mario Bergoglio, allora Arcivescovo di Buenos Aires, autorizzò personalmente le analisi scientifiche nel 1999. Documentato ufficialmente dall\'Arcidiocesi.', recognizedBy:'Card. Jorge Mario Bergoglio (poi Papa Francesco)', recognitionYear:1999, isVisitableToday:false, country:{ code:'AR', nameIt:'Argentina', flagEmoji:'🇦🇷' }, images:[], videos:[], documents:[], bibliography:[], pilgrimages:[], viewCount:0, featuredOrder:2 },
  { id:'3', title:'Sokółka', slug:'sokolka', location:'Sokółka', city:'Sokółka', state:'Podlaskie', continent:'EUROPA', year:2008, verificationLevel:'SCIENTIFICO', summary:'Un\'ostia caduta e posta in acqua, secondo la prassi liturgica, mostrò nei giorni successivi un tessuto non separabile dal pane consacrato. Le analisi dell\'Università di Białystok non ne hanno trovato una spiegazione naturale.', scientificAnalysis:'Università di Białystok: miocardio strettamente intrecciato con il pane dell\'Ostia, impossibile separarlo. Sangue AB. Cuore in agonia.', tissueType:'Miocardio — fuso con il pane eucaristico', bloodType:'AB', analyzedBy:'Prof. Sulkowski; Università Medica di Białystok', analysisYear:2009, analysisInstitution:'Università Medica di Białystok', officialRecognition:'Dichiarato miracolo eucaristico dalla Conferenza Episcopale Polacca', ecclesiasticalRecognition:'Approvato dalla Conferenza Episcopale Polacca nel 2009. Conservato nella chiesa di Sant\'Antonio a Sokółka.', recognizedBy:'Conferenza Episcopale Polacca', recognitionYear:2009, isVisitableToday:true, conservedAt:'Chiesa di Sant\'Antonio, Sokółka', country:{ code:'PL', nameIt:'Polonia', flagEmoji:'🇵🇱' }, images:[], videos:[], documents:[], bibliography:[], pilgrimages:[], viewCount:0, featuredOrder:3 },
  { id:'4', title:'Siena', slug:'siena', location:'Siena', city:'Siena', state:'Toscana', continent:'EUROPA', year:1730, verificationLevel:'STORICO', summary:'Trecentoquarantotto ostie consacrate, rubate nel 1730 e ritrovate tre giorni dopo, si conservano intatte da quasi tre secoli, senza alcun agente conservante rilevato dalle analisi.', scientificAnalysis:'Analisi 1914 e 2007: nessun agente conservante, pane ancora perfettamente commestibile dopo quasi 300 anni.', isVisitableToday:true, officialRecognition:'Conservate nella Basilica di San Francesco, Siena', conservedAt:'Basilica di San Francesco, Siena', country:{ code:'IT', nameIt:'Italia', flagEmoji:'🇮🇹' }, images:[], videos:[], documents:[], bibliography:[], pilgrimages:[ { id:'p4', name:'Visita alle Sacre Particole', location:'Basilica di San Francesco, Siena', frequency:'Tutto l\'anno' } ], viewCount:0, featuredOrder:4 },
  { id:'5', title:'Santarém', slug:'santarem', location:'Santarém', city:'Santarém', continent:'EUROPA', year:1247, verificationLevel:'STORICO', summary:'Secondo la tradizione, un\'ostia consacrata portata via da una donna iniziò a sanguinare. È venerata ininterrottamente da oltre settecento anni.', isVisitableToday:true, conservedAt:'Chiesa di Santo Stefano, Santarém', country:{ code:'PT', nameIt:'Portogallo', flagEmoji:'🇵🇹' }, images:[], videos:[], documents:[], bibliography:[], pilgrimages:[], viewCount:0, featuredOrder:5 },
  { id:'6', title:'Tixtla', slug:'tixtla', location:'Tixtla', city:'Tixtla', state:'Guerrero', continent:'AMERICA_NORD', year:2006, verificationLevel:'SCIENTIFICO', summary:'Del sangue apparve sulla superficie di un\'ostia consacrata durante l\'adorazione. È tra i casi più recenti sottoposti ad analisi scientifica indipendente.', tissueType:'Miocardio in agonia', bloodType:'AB', analyzedBy:'Instituto Politécnico Nacional, Messico', analysisYear:2007, country:{ code:'MX', nameIt:'Messico', flagEmoji:'🇲🇽' }, isVisitableToday:false, images:[], videos:[], documents:[], bibliography:[], pilgrimages:[], viewCount:0, featuredOrder:6 },
  { id:'7', title:'Bolsena', slug:'bolsena', location:'Bolsena', city:'Bolsena', state:'Lazio', continent:'EUROPA', year:1263, verificationLevel:'STORICO', summary:'Durante la Messa di un sacerdote in dubbio sulla presenza reale, l\'ostia consacrata sanguinò sul corporale. L\'evento portò Papa Urbano IV a istituire la solennità del Corpus Domini.', officialRecognition:'Papa Urbano IV istituì il Corpus Domini', ecclesiasticalRecognition:'Papa Urbano IV commissionò a San Tommaso d\'Aquino la liturgia del Corpus Domini. Il corporale insanguinato è conservato nella Cattedrale di Orvieto, ancora venerato ogni anno durante la processione del Corpus Domini.', recognizedBy:'Papa Urbano IV', recognitionYear:1264, isVisitableToday:true, conservedAt:'Cattedrale di Orvieto (corporale)', country:{ code:'IT', nameIt:'Italia', flagEmoji:'🇮🇹' }, images:[], videos:[], documents:[], bibliography:[], pilgrimages:[ { id:'p7', name:'Processione del Corpus Domini a Orvieto', location:'Orvieto, Umbria', frequency:'Annuale (Corpus Domini)' } ], viewCount:0, featuredOrder:7 },
  { id:'8', title:'Legnica', slug:'legnica', location:'Legnica', city:'Legnica', state:'Bassa Slesia', continent:'EUROPA', year:2013, verificationLevel:'SCIENTIFICO', summary:'Un\'ostia caduta durante la distribuzione della Comunione, nel Natale 2013, mostrò nei mesi successivi un tessuto analizzato da due università polacche.', tissueType:'Miocardio in agonia', bloodType:'AB', analyzedBy:'Università di Medicina di Breslavia', analysisYear:2014, recognitionYear:2016, recognizedBy:'Vescovo Zbigniew Kiernikowski', country:{ code:'PL', nameIt:'Polonia', flagEmoji:'🇵🇱' }, isVisitableToday:true, images:[], videos:[], documents:[], bibliography:[], pilgrimages:[], viewCount:0, featuredOrder:8 },
  { id:'9', title:'Amsterdam', slug:'amsterdam', location:'Amsterdam', city:'Amsterdam', continent:'EUROPA', year:1345, verificationLevel:'STORICO', summary:'Secondo la tradizione del 1345, un\'ostia gettata nel fuoco rimase intatta. L\'evento è ricordato ogni anno dal pellegrinaggio silenzioso Stille Omgang.', isVisitableToday:true, visitingInfo:'Kapel ter Heilige Stede, Amsterdam', country:{ code:'NL', nameIt:'Olanda', flagEmoji:'🇳🇱' }, images:[], videos:[], documents:[], bibliography:[], pilgrimages:[ { id:'p9', name:'Stille Omgang — Processione Silenziosa', location:'Amsterdam, Olanda', frequency:'Annuale (terza domenica di marzo)', organizer:'Gezelschap van den Heiligen Stede' } ], viewCount:0, featuredOrder:9 },
  { id:'10', title:'Chirattakonam', slug:'chirattakonam', location:'Chirattakonam', city:'Chirattakonam', state:'Kerala', continent:'ASIA', year:2001, verificationLevel:'STORICO', summary:'Durante l\'adorazione, alcuni fedeli riferirono di un\'immagine visibile sull\'ostia consacrata, poi fotografata. L\'episodio è tramandato come tradizione locale.', isVisitableToday:true, country:{ code:'IN', nameIt:'India', flagEmoji:'🇮🇳' }, images:[], videos:[], documents:[], bibliography:[], pilgrimages:[], viewCount:0, featuredOrder:10 },
  { id:'11', title:'Ferrara', slug:'ferrara', location:'Ferrara', city:'Ferrara', state:'Emilia-Romagna', continent:'EUROPA', year:1171, verificationLevel:'STORICO', summary:'Nel 1171, durante la Messa di Pasqua, l\'ostia sanguinò davanti all\'assemblea. L\'episodio fu riportato in una lettera a Papa Alessandro III.', country:{ code:'IT', nameIt:'Italia', flagEmoji:'🇮🇹' }, isVisitableToday:false, images:[], videos:[], documents:[], bibliography:[], pilgrimages:[], viewCount:0, featuredOrder:11 },
  { id:'12', title:'Offida', slug:'offida', location:'Offida', city:'Offida', state:'Marche', continent:'EUROPA', year:1280, verificationLevel:'STORICO', summary:'Un\'ostia trasformata in tessuto, sepolta per nasconderla, fu ritrovata intatta. Le reliquie sono state visitate da Papa Giovanni Paolo II nel 2000.', isVisitableToday:true, conservedAt:'Basilica di Santa Maria della Rocca, Offida', country:{ code:'IT', nameIt:'Italia', flagEmoji:'🇮🇹' }, images:[], videos:[], documents:[], bibliography:[], pilgrimages:[], viewCount:0, featuredOrder:12 },
  { id:'13', title:'Walldürn', slug:'walldurn', location:'Walldürn', city:'Walldürn', state:'Baden-Württemberg', continent:'EUROPA', year:1330, verificationLevel:'STORICO', summary:'Su un corporale macchiato durante la Messa si formò un\'immagine ripetuta, venerata da secoli. Il santuario è tuttora meta di pellegrinaggio ogni anno.', isVisitableToday:true, conservedAt:'Basilica di San Giorgio, Walldürn', recognizedBy:'Papa Urbano V', country:{ code:'DE', nameIt:'Germania', flagEmoji:'🇩🇪' }, images:[], videos:[], documents:[], bibliography:[], pilgrimages:[ { id:'p13', name:'Grande Pellegrinaggio di Walldürn', location:'Walldürn, Germania', frequency:'Annuale (settimana dopo Corpus Domini)', organizer:'Diocesi di Magonza' } ], viewCount:0, featuredOrder:13 },
  { id:'14', title:'Avignon', slug:'avignon', location:'Avignon', city:'Avignon', state:'Provenza', continent:'EUROPA', year:1433, verificationLevel:'STORICO', summary:'Durante un\'alluvione del Rodano nel 1433, alcune ostie consacrate rimasero sommerse per 33 giorni e furono ritrovate intatte.', country:{ code:'FR', nameIt:'Francia', flagEmoji:'🇫🇷' }, isVisitableToday:false, images:[], videos:[], documents:[], bibliography:[], pilgrimages:[], viewCount:0, featuredOrder:14 },
  { id:'15', title:'Macerata Feltria', slug:'macerata-feltria', location:'Macerata Feltria', city:'Macerata Feltria', state:'Marche', continent:'EUROPA', year:1356, verificationLevel:'STORICO', summary:'Secondo la tradizione, un contadino vide una luce nei campi legata a un\'ostia consacrata. Sul luogo fu edificata una cappella, ancora meta di pellegrinaggio.', country:{ code:'IT', nameIt:'Italia', flagEmoji:'🇮🇹' }, isVisitableToday:true, images:[], videos:[], documents:[], bibliography:[], pilgrimages:[], viewCount:0, featuredOrder:15 },
]

const API_URL = (import.meta as any).env?.VITE_API_URL ?? '/api'

export function useMiracles(filter: MiracleFilter = {}) {
  const [miracles, setMiracles] = useState<Miracle[]>([])
  const [loading, setLoading]   = useState(true)
  const [total, setTotal]       = useState(0)
  const abort = useRef<AbortController|null>(null)

  const fetch = useCallback(async () => {
    abort.current?.abort()
    abort.current = new AbortController()
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit:'50' })
      Object.entries(filter).forEach(([k,v]) => { if (v !== undefined && v !== '') params.set(k, String(v)) })
      const res  = await window.fetch(`${API_URL}/miracles?${params}`, { signal: abort.current.signal })
      if (!res.ok) throw new Error()
      const json = await res.json()
      setMiracles(json.data); setTotal(json.meta?.total ?? json.data.length)
    } catch(e: any) {
      if (e.name === 'AbortError') return
      let data = [...FALLBACK]
      if (filter.continent)         data = data.filter(m => m.continent === filter.continent)
      if (filter.verificationLevel) data = data.filter(m => m.verificationLevel === filter.verificationLevel)
      if (filter.isVisitable)       data = data.filter(m => m.isVisitableToday)
      if (filter.hasScience)        data = data.filter(m => !!m.scientificAnalysis)
      if (filter.yearFrom)          data = data.filter(m => (m.year ?? 0) >= filter.yearFrom!)
      if (filter.yearTo)            data = data.filter(m => (m.year ?? 9999) <= filter.yearTo!)
      if (filter.q) { const q = filter.q.toLowerCase(); data = data.filter(m => m.title.toLowerCase().includes(q) || m.location.toLowerCase().includes(q) || m.summary.toLowerCase().includes(q)) }
      setMiracles(data); setTotal(data.length)
    } finally { setLoading(false) }
  }, [JSON.stringify(filter)])

  useEffect(() => { fetch() }, [fetch])
  return { miracles, loading, total, refetch: fetch }
}

export async function fetchMiracleDetail(slug: string): Promise<Miracle|null> {
  try {
    const res = await window.fetch(`${API_URL}/miracles/${slug}`)
    if (!res.ok) throw new Error()
    const json = await res.json()
    return json.data
  } catch {
    return FALLBACK.find(m => m.slug === slug) ?? null
  }
}
