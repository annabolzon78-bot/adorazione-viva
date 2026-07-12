import{j as e}from"./index-CtV0VUXW.js";import{r as t}from"./vendor-DenMWx0Z.js";import{u as m}from"./i18n-DnFyKl6w.js";import"./supabase-BSyF6ipX.js";const p=[{catKey:"adoration",ico:"🙏",titleKey:"Atto di Adorazione",subKey:"La preghiera fondamentale",text:"O Gesù, vero Dio e vero uomo, presente nel Santissimo Sacramento dell'altare, ti adoro con profonda riverenza. Credo fermamente che sei qui presente. Ti amo sopra ogni cosa e desidero riceverti nella mia anima. Rimani con me, Signore. Amen."},{catKey:"adoration",ico:"💌",titleKey:"Comunione Spirituale",subKey:"Per chi non può comunicarsi",text:"Gesù mio, credo che sei nel Santissimo Sacramento. Ti amo sopra ogni cosa e ti desidero nell'anima mia. Poiché ora non posso riceverti sacramentalmente, vieni almeno spiritualmente nel mio cuore. Come se già fossi venuto, ti abbraccio e mi unisco tutto a te: non permettere che mi separi da te. Amen."},{catKey:"saints",ico:"✝️",titleKey:"Anima Christi",subKey:"Attribuita a San Ignazio di Loyola",text:`Anima di Cristo, santificami.
Corpo di Cristo, salvami.
Sangue di Cristo, inebriami.
Acqua del costato di Cristo, lavami.
Passione di Cristo, confortami.
O buon Gesù, esaudiscimi.
Nascondimi nelle tue piaghe.
Non permettere che mi separi da te.
Difendimi dal nemico maligno.
Nell'ora della mia morte chiamami
e comanda che io venga a te,
affinché con i tuoi santi ti lodi nei secoli. Amen.`},{catKey:"suffrage",ico:"🕊️",titleKey:"Per le Anime del Purgatorio",subKey:"Offri l'adorazione in suffragio",text:`Signore Gesù, presente in questo Santissimo Sacramento, ti offro quest'ora di adorazione a suffragio delle Anime del Purgatorio. Esse non possono pregare per sé stesse: la mia preghiera sia la loro voce davanti a te.

Dona loro il riposo eterno, e splenda ad essi la luce perpetua. Riposino in pace. Amen.

«È cosa santa e salutare pregare per i morti.» — 2 Mac 12,46`},{catKey:"saints",ico:"✨",titleKey:"Tantum Ergo",subKey:"San Tommaso d'Aquino",text:`Adoriamo dunque prostrati un sì grande Sacramento, e l'antica figura lasci il posto alla novità; la fede supplisca ai sensi venuti meno.

Al Padre e al Figlio sia data lode e giubilo, salute, onore, virtù e sia anche benedizione; a Colui che procede da entrambi uguale lode si innalzi. Amen.`},{catKey:"saints",ico:"🌟",titleKey:"San Pietro Giuliano Eymard",subKey:"Apostolo dell'Eucaristia",text:`«L'Eucaristia è il grande atto d'amore di Gesù verso di noi. Egli è rimasto con noi non come re nel suo palazzo, ma come amico nella nostra casa.

Non è forse questo il più grande dei miracoli? Il Dio dell'universo che aspetta te. Oggi. Adesso. In quella piccola chiesa.»

— San Pietro Giuliano Eymard`},{catKey:"reparation",ico:"💛",titleKey:"Atto di Riparazione",subKey:"Per le offese al Santissimo",text:"Dolcissimo Gesù, il cui amore immenso per gli uomini viene ripagato con tanta ingratitudine, noi ci prostriamo davanti al tuo altare per riparare con lodi speciali e adorazioni la fredda indifferenza e il disprezzo con cui gli uomini trattano il tuo Santissimo Cuore. Amen."},{catKey:"adoration",ico:"📿",titleKey:"Rosario Eucaristico",subKey:"Meditazione davanti al Santissimo",text:`Il Rosario Eucaristico si prega davanti al Santissimo unendo ogni decina a un mistero:

🌹 Gioiosi — Gesù viene a noi come nell'Incarnazione
🌹 Luminosi — Gesù istituisce l'Eucaristia
🌹 Dolorosi — Gesù offre il suo sacrificio
🌹 Gloriosi — Gesù ci dà caparra della risurrezione

Ogni Padre Nostro: «Gesù, ti adoro qui presente.»`}];function v(){const{t:a}=m(),[o,s]=t.useState("all"),[r,l]=t.useState(null),d=[{key:"all",label:a("prayers.all")},{key:"adoration",label:a("prayers.adoration")},{key:"suffrage",label:a("prayers.suffrage")},{key:"reparation",label:a("prayers.reparation")},{key:"saints",label:a("prayers.saints")}],c=p.filter(i=>o==="all"||i.catKey===o);return e.jsxs("div",{className:"pg",children:[e.jsxs("div",{style:{background:"linear-gradient(135deg,var(--red),#5a0f1a)",borderRadius:14,padding:18,textAlign:"center",color:"#fff",marginBottom:14},children:[e.jsx("div",{style:{fontSize:"2rem",marginBottom:6},children:"❤️‍🔥"}),e.jsx("div",{style:{fontFamily:"Cinzel,serif",fontSize:".95rem",marginBottom:4},children:a("prayers.title")}),e.jsx("div",{style:{fontSize:".75rem",opacity:.75},children:a("prayers.tap_to_open")})]}),e.jsx("div",{style:{display:"flex",gap:8,overflowX:"auto",marginBottom:14,paddingBottom:2},children:d.map(i=>e.jsx("button",{onClick:()=>s(i.key),style:{flexShrink:0,padding:"5px 14px",borderRadius:20,fontSize:".7rem",fontWeight:600,cursor:"pointer",border:`1.5px solid ${o===i.key?"var(--red)":"var(--br)"}`,background:o===i.key?"var(--red)":"var(--white)",color:o===i.key?"#fff":"var(--t2)",fontFamily:"Lato,sans-serif",transition:"all .2s"},children:i.label},i.key))}),c.map((i,n)=>e.jsxs("div",{style:{background:"var(--white)",border:"1px solid var(--br)",borderRadius:12,overflow:"hidden",marginBottom:9,boxShadow:"0 1px 6px rgba(139,26,42,.06)"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:11,padding:"13px 14px",cursor:"pointer",background:"var(--bg)"},onClick:()=>l(r===n?null:n),children:[e.jsx("span",{style:{fontSize:"1.2rem",flexShrink:0},children:i.ico}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:600,fontSize:".86rem",color:"var(--text)"},children:i.titleKey}),e.jsx("div",{style:{fontSize:".68rem",color:"var(--t3)",marginTop:1},children:i.subKey})]}),e.jsx("span",{style:{marginLeft:"auto",color:"var(--t3)",fontSize:".9rem",transform:r===n?"rotate(90deg)":"none",transition:"transform .2s"},children:"›"})]}),r===n&&e.jsx("div",{style:{padding:"13px 14px",fontStyle:"italic",fontSize:".9rem",color:"var(--t2)",lineHeight:1.85,borderTop:"1px solid var(--br)",whiteSpace:"pre-line"},children:i.text})]},n))]})}export{v as Prega};
