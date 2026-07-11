import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Layout }         from './components/layout/Layout'
import { Home }           from './pages/Home'
import { Login }          from './pages/Login'
import { Register }       from './pages/Register'
import './styles/global.css'
import './styles/auth.css'

// Lazy load pagine pesanti
const Trova    = lazy(() => import('./pages/Trova').then(m=>({default:m.Trova})))
const Live     = lazy(() => import('./pages/Live').then(m=>({default:m.Live})))
const Miracoli = lazy(() => import('./pages/Miracoli').then(m=>({default:m.Miracoli})))
const Prega    = lazy(() => import('./pages/Prega').then(m=>({default:m.Prega})))
const Catena   = lazy(() => import('./pages/Catena').then(m=>({default:m.Catena})))
const Comunita = lazy(() => import('./pages/Comunita').then(m=>({default:m.Comunita})))
const Dashboard= lazy(() => import('./pages/Dashboard').then(m=>({default:m.Dashboard})))

function PageLoader() {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'80vh',flexDirection:'column',gap:10}}>
      <span style={{fontSize:'1.8rem',animation:'pulse 1.5s ease-in-out infinite'}}>❤️‍🔥</span>
      <span style={{fontFamily:'Cinzel,serif',fontSize:'.78rem',color:'#9b8878'}}>Caricamento...</span>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes — senza layout app */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard — layout proprio */}
        <Route path="/dashboard/*" element={
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        } />

        {/* App routes — con layout principale */}
        <Route path="/" element={<Layout />}>
          <Route index         element={<Home />} />
          <Route path="trova"  element={<Suspense fallback={<PageLoader />}><Trova /></Suspense>} />
          <Route path="live"   element={<Suspense fallback={<PageLoader />}><Live /></Suspense>} />
          <Route path="miracoli" element={<Suspense fallback={<PageLoader />}><Miracoli /></Suspense>} />
          <Route path="prega"  element={<Suspense fallback={<PageLoader />}><Prega /></Suspense>} />
          <Route path="catena" element={<Suspense fallback={<PageLoader />}><Catena /></Suspense>} />
          <Route path="comunita" element={<Suspense fallback={<PageLoader />}><Comunita /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
